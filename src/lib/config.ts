export const appConfig = {
  "projectId": "05-labelwise",
  "name": "Labelwise",
  "theme": "airtable",
  "layout": "ledger",
  "resource": "konva",
  "primary": "Formula",
  "primaryPlural": "Formulas",
  "action": "Triage declaration conflicts",
  "summary": "Stop allergen claims from drifting away from formulas and supplier declarations.",
  "neutral": "hold_label",
  "routes": [
    [
      "/ledger",
      "Queue"
    ],
    [
      "/ledger",
      "Formulas"
    ],
    [
      "/ledger",
      "Ingredients"
    ],
    [
      "/ledger",
      "Labels"
    ],
    [
      "/incidents",
      "Incidents"
    ]
  ],
  "children": [
    [
      "add_ingredient",
      "Ingredient"
    ],
    [
      "add_supplier_declaration",
      "Supplier declaration"
    ],
    [
      "add_allergen_claim",
      "Allergen claim"
    ],
    [
      "add_label_revision",
      "Label revision"
    ],
    [
      "add_incident_notice",
      "Incident notice"
    ]
  ],
  "copy": {
    "network": "Label ledger 61999",
    "loading": "Reconciling formula sheets",
    "readError": "Declaration ledger unavailable",
    "metrics": ["Formulas", "Ingredients", "Labels", "Holds", "Approvals"],
    "emptyTitle": "No formulas queued",
    "emptyBody": "The label queue is empty. Connect the quality wallet to add the first product formula.",
    "childUnit": "declarations",
    "transaction": "Label receipt",
    "createSubtitle": "Open a formula row for declaration review",
    "idLabel": "Formula code",
    "titleLabel": "Product name",
    "sourceLabel": "Specification URL",
    "summaryLabel": "Formula description",
    "createButton": "Add formula",
    "evidenceTitle": "Link declaration",
    "evidenceSubtitle": "Tie ingredients, claims, and revisions to the formula",
    "selectLabel": "Formula",
    "selectPlaceholder": "Choose formula",
    "evidenceTypeLabel": "Declaration class",
    "evidenceIdLabel": "Declaration code",
    "evidenceNameLabel": "Ingredient label",
    "evidenceNoteLabel": "Quality note",
    "evidenceButton": "Link declaration",
    "commands": ["Seal declarations", "Run allergen review", "Approve label", "Retire formula"],
    "filingIdLabel": "Hold code",
    "rationaleLabel": "Conflict detail",
    "fileButton": "Place label hold",
    "waiveButton": "Close hold window",
    "routeKickers": ["Triage queue", "Formula register", "Ingredient sources", "Label workflow", "Incident outcome"],
    "visibleUnit": "formulas listed",
    "safetyTitle": "Hold rule",
    "safetyBody": "A missing supplier declaration or unresolved allergen conflict keeps the label on hold."
  },
  "methods": {
    "create": "create_formula",
    "seal": "seal_formula_declarations",
    "review": "run_allergen_review",
    "finalize": "finalize_label",
    "archive": "retire_formula",
    "openDispute": "open_label_hold",
    "resolveDispute": "resolve_label_hold",
    "waiveDispute": "waive_label_hold_window",
    "openCorrection": "submit_formula_correction",
    "resolveCorrection": "resolve_formula_correction",
    "waiveCorrection": "waive_correction_window"
  },
  "lifecycle": {
    "dispute": "Label hold",
    "correction": "Formula correction"
  }
} as const;
