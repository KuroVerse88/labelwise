# Labelwise

> A formula-to-label control ledger for allergen declarations.

## At A Glance

Labelwise detects when a product label drifts away from its formula, supplier declarations, or incident evidence. Food and quality teams work from one ledger where every change remains attributable and every ambiguous case can be held instead of prematurely approved.

**Active deployment:** [`0xB10a169dd7785243859879E129c9f7E9c33F7466`](https://explorer-studio.genlayer.com/address/0xB10a169dd7785243859879E129c9f7E9c33F7466) on GenLayer Studionet.

## Ledger Model

```text
FORMULA
  + ingredient declarations
  + supplier evidence
  + proposed label
  + review / objection / reconsideration
  = attributable label decision
```

The intelligent contract exposes 32 public methods. Its neutral outcome, `hold_label`, protects consumers when the record cannot support a definitive declaration.

## Two Product Surfaces

### `/ledger`

The primary formula command sheet. It combines formula registration, ingredient evidence, label comparison, consensus review, and contract actions in a spreadsheet-oriented workspace.

### `/incidents`

The separate incident surface. Incidents remain distinct because post-market evidence has its own urgency, operators, and follow-up history.

The root route `/` is the public introduction. Historical formula and ingredient pages were intentionally consolidated into the ledger.

## Decision Discipline

Labelwise is built around four rules:

1. A supplier declaration is evidence, not an automatic truth.
2. Every allergen claim must remain traceable to formula and source material.
3. New counter-evidence must be preserved through objection and reconsideration.
4. Uncertainty yields a hold, never a convenient approval.

## Developer Worksheet

| Task | Command |
| --- | --- |
| Start Next.js | `npm run dev` |
| Type-check | `npm run typecheck` |
| Run source tests | `npm test` |
| Check Studionet reads | `npm run test:studionet` |
| Create production build | `npm run build` |

The app uses the shared frontend runtime installed at the `projects` workspace level.

## Where Things Live

- `contracts/Labelwise.py` defines formulas, ingredients, evidence, reviews, and incidents.
- `src/components/app-shell.tsx` contains the product workspace.
- `src/components/domain-contract-actions.tsx` maps the complete contract API into ledger controls.
- `src/lib/contract-workflow.ts` handles typed method selection and execution state.
- `deployment.json` is the canonical network record.

## Network Coordinates

```yaml
network: genlayer-studionet
chain_id: 61999
protocol: Labelwise Allergen Protocol
contract: 0xB10a169dd7785243859879E129c9f7E9c33F7466
method_count: 32
neutral_outcome: hold_label
deployment_status: configured_verified
