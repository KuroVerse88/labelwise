export type ContractParam = {
  name: string;
  type: "string" | "int" | "bool" | "address";
};

export type ContractMethod = {
  name: string;
  kind: "read" | "write";
  params: readonly ContractParam[];
  returns: string;
};

export const contractSurfaceIdentity = {
  "layout": "sheet",
  "kicker": "Labelwise / formula base",
  "title": "Formula contract sheet",
  "description": "Use every formula, ingredient, supplier, allergen, conflict, incident and revision operation from one typed base.",
  "readLabel": "Formula queries",
  "writeLabel": "Base mutations",
  "searchPlaceholder": "Filter formula operations",
  "readAction": "Run formula query",
  "writeAction": "Commit base mutation",
  "resultLabel": "Cell output",
  "emptyResult": "Query results and committed formula mutations will populate this output cell.",
  "colors": {
    "background": "#f7f7fb",
    "panel": "#ffffff",
    "ink": "#202124",
    "muted": "#666a73",
    "accent": "#6c4cf1",
    "border": "#d7d9e0"
  }
} as const;

export const contractMethods = [
  {
    "name": "get_allergen_claims",
    "kind": "read",
    "params": [
      {
        "name": "formula_id",
        "type": "string"
      }
    ],
    "returns": "array"
  },
  {
    "name": "get_allergen_graph",
    "kind": "read",
    "params": [
      {
        "name": "formula_id",
        "type": "string"
      }
    ],
    "returns": "dict"
  },
  {
    "name": "get_formula",
    "kind": "read",
    "params": [
      {
        "name": "formula_id",
        "type": "string"
      }
    ],
    "returns": "dict"
  },
  {
    "name": "get_formula_conflicts",
    "kind": "read",
    "params": [
      {
        "name": "formula_id",
        "type": "string"
      }
    ],
    "returns": "array"
  },
  {
    "name": "get_formula_ingredients",
    "kind": "read",
    "params": [
      {
        "name": "formula_id",
        "type": "string"
      }
    ],
    "returns": "array"
  },
  {
    "name": "get_formula_timeline",
    "kind": "read",
    "params": [
      {
        "name": "formula_id",
        "type": "string"
      }
    ],
    "returns": "array"
  },
  {
    "name": "get_formulas_by_state",
    "kind": "read",
    "params": [
      {
        "name": "state",
        "type": "string"
      }
    ],
    "returns": "array"
  },
  {
    "name": "get_frontend_bootstrap",
    "kind": "read",
    "params": [],
    "returns": "dict"
  },
  {
    "name": "get_incident_notices",
    "kind": "read",
    "params": [
      {
        "name": "formula_id",
        "type": "string"
      }
    ],
    "returns": "array"
  },
  {
    "name": "get_label_assessment",
    "kind": "read",
    "params": [
      {
        "name": "formula_id",
        "type": "string"
      }
    ],
    "returns": "dict"
  },
  {
    "name": "get_label_revisions",
    "kind": "read",
    "params": [
      {
        "name": "formula_id",
        "type": "string"
      }
    ],
    "returns": "array"
  },
  {
    "name": "get_registry_config",
    "kind": "read",
    "params": [],
    "returns": "dict"
  },
  {
    "name": "get_supplier_declarations",
    "kind": "read",
    "params": [
      {
        "name": "formula_id",
        "type": "string"
      }
    ],
    "returns": "array"
  },
  {
    "name": "get_supplier_filings",
    "kind": "read",
    "params": [
      {
        "name": "account",
        "type": "address"
      }
    ],
    "returns": "array"
  },
  {
    "name": "add_ingredient",
    "kind": "write",
    "params": [
      {
        "name": "formula_id",
        "type": "string"
      },
      {
        "name": "ingredient_id",
        "type": "string"
      },
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "function",
        "type": "string"
      },
      {
        "name": "declared_allergens_json",
        "type": "string"
      }
    ],
    "returns": "null"
  },
  {
    "name": "clear_formula_hold",
    "kind": "write",
    "params": [
      {
        "name": "formula_id",
        "type": "string"
      },
      {
        "name": "release_note",
        "type": "string"
      }
    ],
    "returns": "null"
  },
  {
    "name": "close_incident",
    "kind": "write",
    "params": [
      {
        "name": "incident_id",
        "type": "string"
      },
      {
        "name": "resolution",
        "type": "string"
      }
    ],
    "returns": "null"
  },
  {
    "name": "close_supplier_window",
    "kind": "write",
    "params": [
      {
        "name": "formula_id",
        "type": "string"
      }
    ],
    "returns": "null"
  },
  {
    "name": "configure_registry",
    "kind": "write",
    "params": [
      {
        "name": "registry_name",
        "type": "string"
      },
      {
        "name": "disclosure_policy",
        "type": "string"
      }
    ],
    "returns": "null"
  },
  {
    "name": "create_formula",
    "kind": "write",
    "params": [
      {
        "name": "formula_id",
        "type": "string"
      },
      {
        "name": "product_name",
        "type": "string"
      },
      {
        "name": "sku",
        "type": "string"
      },
      {
        "name": "specification_url",
        "type": "string"
      }
    ],
    "returns": "null"
  },
  {
    "name": "draft_label_revision",
    "kind": "write",
    "params": [
      {
        "name": "formula_id",
        "type": "string"
      },
      {
        "name": "revision_id",
        "type": "string"
      },
      {
        "name": "label_url",
        "type": "string"
      },
      {
        "name": "change_note",
        "type": "string"
      }
    ],
    "returns": "null"
  },
  {
    "name": "lock_ingredient_deck",
    "kind": "write",
    "params": [
      {
        "name": "formula_id",
        "type": "string"
      }
    ],
    "returns": "null"
  },
  {
    "name": "open_label_conflict",
    "kind": "write",
    "params": [
      {
        "name": "formula_id",
        "type": "string"
      },
      {
        "name": "conflict_id",
        "type": "string"
      },
      {
        "name": "ingredient_id",
        "type": "string"
      },
      {
        "name": "grounds",
        "type": "string"
      },
      {
        "name": "evidence_url",
        "type": "string"
      }
    ],
    "returns": "null"
  },
  {
    "name": "open_supplier_window",
    "kind": "write",
    "params": [
      {
        "name": "formula_id",
        "type": "string"
      }
    ],
    "returns": "null"
  },
  {
    "name": "propose_allergen_claim",
    "kind": "write",
    "params": [
      {
        "name": "formula_id",
        "type": "string"
      },
      {
        "name": "claim_id",
        "type": "string"
      },
      {
        "name": "allergen",
        "type": "string"
      },
      {
        "name": "claim_type",
        "type": "string"
      },
      {
        "name": "label_text",
        "type": "string"
      }
    ],
    "returns": "null"
  },
  {
    "name": "reconcile_label",
    "kind": "write",
    "params": [
      {
        "name": "formula_id",
        "type": "string"
      }
    ],
    "returns": "null"
  },
  {
    "name": "release_label",
    "kind": "write",
    "params": [
      {
        "name": "revision_id",
        "type": "string"
      }
    ],
    "returns": "null"
  },
  {
    "name": "report_incident",
    "kind": "write",
    "params": [
      {
        "name": "formula_id",
        "type": "string"
      },
      {
        "name": "incident_id",
        "type": "string"
      },
      {
        "name": "lot_code",
        "type": "string"
      },
      {
        "name": "notice_url",
        "type": "string"
      },
      {
        "name": "description",
        "type": "string"
      }
    ],
    "returns": "null"
  },
  {
    "name": "resolve_label_conflict",
    "kind": "write",
    "params": [
      {
        "name": "conflict_id",
        "type": "string"
      },
      {
        "name": "sustained",
        "type": "bool"
      },
      {
        "name": "resolution_note",
        "type": "string"
      }
    ],
    "returns": "null"
  },
  {
    "name": "retire_formula",
    "kind": "write",
    "params": [
      {
        "name": "formula_id",
        "type": "string"
      },
      {
        "name": "reason",
        "type": "string"
      }
    ],
    "returns": "null"
  },
  {
    "name": "set_label_reviewer",
    "kind": "write",
    "params": [
      {
        "name": "account",
        "type": "address"
      },
      {
        "name": "allowed",
        "type": "bool"
      }
    ],
    "returns": "null"
  },
  {
    "name": "submit_supplier_declaration",
    "kind": "write",
    "params": [
      {
        "name": "formula_id",
        "type": "string"
      },
      {
        "name": "declaration_id",
        "type": "string"
      },
      {
        "name": "ingredient_id",
        "type": "string"
      },
      {
        "name": "supplier",
        "type": "string"
      },
      {
        "name": "source_url",
        "type": "string"
      },
      {
        "name": "declared_allergens_json",
        "type": "string"
      }
    ],
    "returns": "null"
  }
] as const satisfies readonly ContractMethod[];
