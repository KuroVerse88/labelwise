import json
from pathlib import Path

import pytest


CONTRACT_PATH = str(Path(__file__).resolve().parents[2] / "contracts" / "Labelwise.py")
POLICY = (
    "Every allergen statement must be reconciled against the locked ingredient deck "
    "and attributable supplier declarations before a public label is released."
)


def deploy_registry(direct_vm, direct_deploy, owner):
    direct_vm.sender = owner
    contract = direct_deploy(CONTRACT_PATH)
    contract.configure_registry("Labelwise public formula registry", POLICY)
    return contract


def create_formula(contract):
    contract.create_formula(
        "formula-alpha",
        "Alpha oat drink",
        "AO-101",
        "https://example.org/specifications/alpha",
    )


def prepare_review(contract, direct_vm, owner, supplier):
    create_formula(contract)
    contract.add_ingredient(
        "formula-alpha",
        "ingredient-oat",
        "Oat base",
        "Primary cereal base",
        '["gluten"]',
    )
    contract.lock_ingredient_deck("formula-alpha")
    contract.open_supplier_window("formula-alpha")
    direct_vm.sender = supplier
    contract.submit_supplier_declaration(
        "formula-alpha",
        "declaration-oat",
        "ingredient-oat",
        "North Mill",
        "https://example.org/declarations/oat",
        '["gluten"]',
    )
    direct_vm.sender = owner
    contract.propose_allergen_claim(
        "formula-alpha",
        "claim-gluten",
        "gluten",
        "CONTAINS",
        "Contains gluten",
    )
    contract.close_supplier_window("formula-alpha")


def mock_compliant_assessment(direct_vm):
    direct_vm.clear_mocks()
    direct_vm.mock_web(
        r".*example\.org.*",
        {"status": 200, "body": "Attributable formula and supplier declaration evidence."},
    )
    direct_vm.mock_llm(
        r".*reconciling a food or cosmetic formula.*",
        json.dumps(
            {
                "ingredient_findings": [
                    {
                        "ingredient_id": "ingredient-oat",
                        "finding": "CONSISTENT",
                        "allergens": ["gluten"],
                        "reason": "The locked deck and supplier declaration agree.",
                    }
                ],
                "confidence_bps": 9100,
                "summary": "The proposed label is supported by attributable declarations.",
            }
        ),
    )


def test_configuration_is_owner_only(direct_vm, direct_deploy, direct_alice, direct_bob):
    direct_vm.sender = direct_alice
    contract = direct_deploy(CONTRACT_PATH)
    direct_vm.sender = direct_bob
    with pytest.raises(Exception):
        contract.configure_registry("Unauthorized registry", POLICY)
    direct_vm.sender = direct_alice
    contract.configure_registry("Labelwise registry", POLICY)
    assert contract.get_registry_config()["configured"] is True


@pytest.mark.parametrize("unsafe_id", ["ab", "UPPER", "has space", "has/slash", "x" * 65])
def test_formula_id_validation(unsafe_id, direct_vm, direct_deploy, direct_alice):
    contract = deploy_registry(direct_vm, direct_deploy, direct_alice)
    with pytest.raises(Exception):
        contract.create_formula(
            unsafe_id, "Alpha product", "SKU-1", "https://example.org/specifications/a"
        )


@pytest.mark.parametrize(
    "unsafe_url",
    [
        "http://example.org/a",
        "https://localhost/a",
        "https://127.0.0.1/a",
        "https://10.0.0.1/a",
        "https://192.168.1.1/a",
    ],
)
def test_specification_url_validation(
    unsafe_url, direct_vm, direct_deploy, direct_alice
):
    contract = deploy_registry(direct_vm, direct_deploy, direct_alice)
    with pytest.raises(Exception):
        contract.create_formula("formula-alpha", "Alpha product", "SKU-1", unsafe_url)


def test_ingredient_allergens_must_be_a_json_array(
    direct_vm, direct_deploy, direct_alice
):
    contract = deploy_registry(direct_vm, direct_deploy, direct_alice)
    create_formula(contract)
    with pytest.raises(Exception):
        contract.add_ingredient(
            "formula-alpha", "ingredient-oat", "Oat", "Base", '{"milk": true}'
        )


def test_ingredient_deck_locks_against_late_mutation(
    direct_vm, direct_deploy, direct_alice
):
    contract = deploy_registry(direct_vm, direct_deploy, direct_alice)
    create_formula(contract)
    contract.add_ingredient(
        "formula-alpha", "ingredient-oat", "Oat", "Base", '["gluten"]'
    )
    contract.lock_ingredient_deck("formula-alpha")
    with pytest.raises(Exception):
        contract.add_ingredient(
            "formula-alpha", "ingredient-cocoa", "Cocoa", "Flavour", "[]"
        )


def test_supplier_declaration_is_indexed_and_attributed(
    direct_vm, direct_deploy, direct_alice, direct_bob
):
    contract = deploy_registry(direct_vm, direct_deploy, direct_alice)
    create_formula(contract)
    contract.add_ingredient(
        "formula-alpha", "ingredient-oat", "Oat", "Base", '["gluten"]'
    )
    contract.lock_ingredient_deck("formula-alpha")
    contract.open_supplier_window("formula-alpha")
    direct_vm.sender = direct_bob
    contract.submit_supplier_declaration(
        "formula-alpha",
        "declaration-oat",
        "ingredient-oat",
        "North Mill",
        "https://example.org/declarations/oat",
        '["gluten"]',
    )
    declaration = contract.get_supplier_declarations("formula-alpha")[0]
    assert declaration["supplier"] == "North Mill"
    assert declaration["supplier_account"] == contract._label_actor()


def test_only_brand_owner_controls_formula_workflow(
    direct_vm, direct_deploy, direct_alice, direct_bob
):
    contract = deploy_registry(direct_vm, direct_deploy, direct_alice)
    create_formula(contract)
    direct_vm.sender = direct_bob
    with pytest.raises(Exception):
        contract.lock_ingredient_deck("formula-alpha")


def test_supplier_window_requires_a_declaration_before_close(
    direct_vm, direct_deploy, direct_alice
):
    contract = deploy_registry(direct_vm, direct_deploy, direct_alice)
    create_formula(contract)
    contract.add_ingredient(
        "formula-alpha", "ingredient-oat", "Oat", "Base", '["gluten"]'
    )
    contract.lock_ingredient_deck("formula-alpha")
    contract.open_supplier_window("formula-alpha")
    with pytest.raises(Exception):
        contract.close_supplier_window("formula-alpha")


def test_reconciliation_records_a_compliant_assessment(
    direct_vm, direct_deploy, direct_alice, direct_bob
):
    contract = deploy_registry(direct_vm, direct_deploy, direct_alice)
    prepare_review(contract, direct_vm, direct_alice, direct_bob)
    mock_compliant_assessment(direct_vm)
    contract.reconcile_label("formula-alpha")
    assessment = contract.get_label_assessment("formula-alpha")
    assert assessment["status"] == "COMPLIANT"
    assert assessment["confidence_bucket"] == "HIGH"
    assert contract.get_formula("formula-alpha")["state"] == "COMPLIANT"


def test_conflict_moves_formula_back_to_review(
    direct_vm, direct_deploy, direct_alice, direct_bob
):
    contract = deploy_registry(direct_vm, direct_deploy, direct_alice)
    prepare_review(contract, direct_vm, direct_alice, direct_bob)
    mock_compliant_assessment(direct_vm)
    contract.reconcile_label("formula-alpha")
    direct_vm.sender = direct_bob
    contract.open_label_conflict(
        "formula-alpha",
        "conflict-oat",
        "ingredient-oat",
        "The supplier declaration omits a newer attributable batch notice.",
        "https://example.org/conflicts/oat",
    )
    assert contract.get_formula("formula-alpha")["state"] == "REVIEW_REQUIRED"


def test_release_incident_hold_and_clear(
    direct_vm, direct_deploy, direct_alice, direct_bob
):
    contract = deploy_registry(direct_vm, direct_deploy, direct_alice)
    prepare_review(contract, direct_vm, direct_alice, direct_bob)
    mock_compliant_assessment(direct_vm)
    contract.reconcile_label("formula-alpha")
    contract.draft_label_revision(
        "formula-alpha",
        "revision-one",
        "https://example.org/labels/revision-one",
        "Align the public allergen statement with the reconciled formula.",
    )
    contract.release_label("revision-one")
    direct_vm.sender = direct_bob
    contract.report_incident(
        "formula-alpha",
        "incident-lot",
        "LOT-2026-01",
        "https://example.org/notices/lot-2026-01",
        "A consumer report requires an attributable lot investigation.",
    )
    assert contract.get_formula("formula-alpha")["state"] == "HOLD"
    direct_vm.sender = direct_alice
    contract.close_incident(
        "incident-lot", "The lot was isolated and the declaration was verified."
    )
    contract.clear_formula_hold(
        "formula-alpha", "All open incidents are closed with evidence."
    )
    assert contract.get_formula("formula-alpha")["state"] == "LABEL_RELEASED"


def test_bootstrap_exposes_formula_domain_counts(
    direct_vm, direct_deploy, direct_alice
):
    contract = deploy_registry(direct_vm, direct_deploy, direct_alice)
    create_formula(contract)
    contract.add_ingredient(
        "formula-alpha", "ingredient-oat", "Oat", "Base", '["gluten"]'
    )
    bootstrap = contract.get_frontend_bootstrap()
    assert bootstrap["counts"]["formulas"] == 1
    assert bootstrap["counts"]["ingredients"] == 1
    assert bootstrap["recent_formulas"][0]["id"] == "formula-alpha"
    graph = contract.get_allergen_graph("formula-alpha")
    assert graph["allergens"] == ["gluten"]
    assert graph["ingredients"][0]["id"] == "ingredient-oat"
    assert [link["relation"] for link in graph["links"]] == [
        "CONTAINS_INGREDIENT",
        "DECLARES_ALLERGEN",
    ]
