import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(".");
const contract = fs.readFileSync(path.join(root, "contracts", "Labelwise.py"), "utf8");
const shell = fs.readFileSync(path.join(root, "src", "components", "app-shell.tsx"), "utf8");
const css = fs.readFileSync(path.join(root, "src", "app", "globals.css"), "utf8");
const client = fs.readFileSync(path.join(root, "src", "lib", "genlayer.ts"), "utf8");

test("label contract models formulas, declarations, reconciliation and incidents", () => {
  for (const method of [
    "create_formula",
    "add_ingredient",
    "submit_supplier_declaration",
    "propose_allergen_claim",
    "reconcile_label",
    "draft_label_revision",
    "report_incident",
  ]) assert.match(contract, new RegExp(`def ${method}\\(`));
  assert.match(contract, /run_nondet_unsafe/);
  assert.match(contract, /untrusted evidence/);
});

test("frontend is a dedicated formula database", () => {
  for (const marker of ["lw-sheet", "Formula base", "FIELD INSPECTOR", "Allergen control base"]) {
    assert.match(shell, new RegExp(marker));
  }
  assert.match(css, /--pink:#6c4cf1/);
  assert.doesNotMatch(shell, /CreateRecordForm|TenderRegister|DomainVisual/);
});

test("writes verify execution finality without embedded secrets", () => {
  assert.match(client, /TransactionStatus\.FINALIZED/);
  assert.match(client, /MAJORITY_AGREE/);
  assert.doesNotMatch([contract, shell, client].join("\n"), new RegExp(["private" + "Key", "mne" + "monic", "seed" + "Phrase"].join("|")));
});
