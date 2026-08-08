"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { FormulaBoard } from "@/components/formula-board";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Columns3,
  Database,
  ExternalLink,
  Filter,
  Grid3X3,
  LoaderCircle,
  Plus,
  Search,
  Send,
  Tag,
} from "lucide-react";
import { appConfig } from "@/lib/config";
import { DomainContractActions } from "@/components/domain-contract-actions";
import {
  contractAddress,
  contractExplorerUrl,
  explorerBaseUrl,
} from "@/lib/deployment";
import { useProtocol } from "@/hooks/use-protocol";
import { useProtocolTransaction } from "@/lib/genlayer";
import type { Formula, LabelBootstrap, TxState } from "@/lib/types";

type Props = { routeIndex: number };
type V = Record<string, string>;
const routeTitles = [
  "Formula base",
  "Product formulas",
  "Ingredient deck",
  "Label revisions",
  "Incident notices",
];
const short = (v: string) =>
  v ? `${v.slice(0, 5)}…${v.slice(-4)}` : "pending";
function Receipt({ s, reset }: { s: TxState; reset: () => void }) {
  if (s.stage === "idle") return null;
  const busy = ["wallet", "submitted", "finalizing"].includes(s.stage);
  return (
    <div className={`lw-receipt ${s.stage}`}>
      {busy ? (
        <LoaderCircle className="spin" />
      ) : s.stage === "finalized" ? (
        <Check />
      ) : (
        <AlertTriangle />
      )}
      <span>
        <b>{s.action}</b>
        {s.error || s.stage}
      </span>
      {s.hash && (
        <a
          href={`${explorerBaseUrl}/tx/${s.hash}`}
          target="_blank"
          rel="noreferrer"
        >
          tx↗
        </a>
      )}
      {!busy && <button onClick={reset}>×</button>}
    </div>
  );
}
function InspectorForm({
  title,
  method,
  fields,
  args,
}: {
  title: string;
  method: string;
  fields: { key: string; label: string; type?: string }[];
  args: (v: V) => unknown[];
}) {
  const tx = useProtocolTransaction();
  const [v, setV] = useState<V>(() =>
    Object.fromEntries(fields.map((f) => [f.key, ""])),
  );
  async function submit(e: FormEvent) {
    e.preventDefault();
    await tx.write(title, method, args(v));
  }
  return (
    <form className="lw-inspector-form" onSubmit={submit}>
      <div className="lw-inspector-title">
        <Tag size={15} />
        <strong>{title}</strong>
      </div>
      {fields.map((f) => (
        <label key={f.key}>
          <span>{f.label}</span>
          {f.type === "area" ? (
            <textarea
              required
              value={v[f.key]}
              onChange={(e) => setV({ ...v, [f.key]: e.target.value })}
            />
          ) : (
            <input
              required
              type={f.type || "text"}
              value={v[f.key]}
              onChange={(e) => setV({ ...v, [f.key]: e.target.value })}
            />
          )}
        </label>
      ))}
      <button>
        <Send size={13} />
        Add to base
      </button>
      <Receipt s={tx.state} reset={tx.reset} />
    </form>
  );
}
function RouteInspector({
  route,
  configured,
}: {
  route: number;
  configured: boolean;
}) {
  if (!configured)
    return (
      <InspectorForm
        title="Configure allergen base"
        method="configure_registry"
        fields={[
          { key: "name", label: "Registry name" },
          { key: "policy", label: "Disclosure policy", type: "area" },
        ]}
        args={(v) => [v.name, v.policy]}
      />
    );
  if (route <= 1)
    return (
      <InspectorForm
        title="New product formula"
        method="create_formula"
        fields={[
          { key: "id", label: "Formula ID" },
          { key: "name", label: "Product name" },
          { key: "sku", label: "SKU" },
          { key: "url", label: "Specification URL", type: "url" },
        ]}
        args={(v) => [v.id, v.name, v.sku, v.url]}
      />
    );
  if (route === 2)
    return (
      <InspectorForm
        title="Append ingredient row"
        method="add_ingredient"
        fields={[
          { key: "formula", label: "Formula ID" },
          { key: "id", label: "Ingredient ID" },
          { key: "name", label: "Ingredient name" },
          { key: "function", label: "Function" },
          { key: "allergens", label: "Allergens JSON", type: "area" },
        ]}
        args={(v) => [v.formula, v.id, v.name, v.function, v.allergens]}
      />
    );
  if (route === 3) return <LabelControls />;
  return (
    <InspectorForm
      title="Open incident notice"
      method="report_incident"
      fields={[
        { key: "formula", label: "Formula ID" },
        { key: "id", label: "Incident ID" },
        { key: "lot", label: "Lot code" },
        { key: "url", label: "Notice URL", type: "url" },
        { key: "description", label: "Incident description", type: "area" },
      ]}
      args={(v) => [v.formula, v.id, v.lot, v.url, v.description]}
    />
  );
}
function LabelControls() {
  const tx = useProtocolTransaction();
  const [formula, setFormula] = useState("");
  const [revision, setRevision] = useState("");
  return (
    <div className="lw-controls">
      <div className="lw-inspector-title">
        <Tag />
        <strong>Label workflow</strong>
      </div>
      <label>
        <span>Formula ID</span>
        <input value={formula} onChange={(e) => setFormula(e.target.value)} />
      </label>
      <button
        onClick={() =>
          tx.write("Lock ingredients", "lock_ingredient_deck", [formula])
        }
      >
        Lock ingredient deck
      </button>
      <button
        onClick={() =>
          tx.write("Open supplier window", "open_supplier_window", [formula])
        }
      >
        Open declarations
      </button>
      <button
        onClick={() =>
          tx.write("Close supplier window", "close_supplier_window", [formula])
        }
      >
        Close declarations
      </button>
      <button
        className="accent"
        onClick={() =>
          tx.write("Reconcile label", "reconcile_label", [formula])
        }
      >
        Run reconciliation
      </button>
      <label>
        <span>Revision ID</span>
        <input value={revision} onChange={(e) => setRevision(e.target.value)} />
      </label>
      <button
        className="release"
        onClick={() => tx.write("Release label", "release_label", [revision])}
      >
        Release revision
      </button>
      <Receipt s={tx.state} reset={tx.reset} />
    </div>
  );
}
function Sheet({ rows }: { rows: Formula[] }) {
  return (
    <div className="lw-sheet">
      <div className="lw-row lw-head">
        <span>#</span>
        <span>Product / SKU</span>
        <span>Formula state</span>
        <span>Ingredients</span>
        <span>Declarations</span>
        <span>Labels</span>
        <span>Incidents</span>
      </div>
      {rows.length ? (
        rows.map((f, i) => (
          <article className="lw-row" key={f.id}>
            <span>{i + 1}</span>
            <div>
              <strong>{f.product_name}</strong>
              <code>
                {f.id} · {f.sku}
              </code>
            </div>
            <b className={`state ${f.state.toLowerCase()}`}>
              {f.state.replaceAll("_", " ")}
            </b>
            <span>{f.ingredient_ids.length}</span>
            <span>{f.declaration_ids.length}</span>
            <span>{f.revision_ids.length}</span>
            <span>{f.incident_ids.length}</span>
          </article>
        ))
      ) : (
        <div className="lw-empty">
          <Database />
          <strong>Empty formula base</strong>
          <span>Create the first row from the field inspector.</span>
        </div>
      )}
    </div>
  );
}
export function AppShell({ routeIndex: initialRouteIndex }: Props) {
  const [routeIndex, setRouteIndex] = useState(initialRouteIndex);
  const p = useProtocol();
  const d = p.data as LabelBootstrap | undefined;
  const c = d?.counts;
  useEffect(() => {
    document.documentElement.dataset.appHydrated = appConfig.projectId;
  }, []);
  return (
    <main className="labelwise">
      <header className="lw-top">
        <Link href="../" className="lw-brand">
          <Database />
          <div>
            <strong>Labelwise</strong>
            <small>Allergen control base</small>
          </div>
        </Link>
        <div>
          <a href={contractExplorerUrl} target="_blank" rel="noreferrer">
            {short(contractAddress)}
            <ExternalLink />
          </a>
          <ConnectButton showBalance={false} chainStatus="icon" />
        </div>
      </header>
      <nav className="lw-tabs">
        {appConfig.routes.map(([href, label], i) => (
          <Link
            key={label}
            href={href}
            className={i === routeIndex ? "active" : ""}
            onClick={(event) => {
              if (i === 4 || initialRouteIndex === 4) return;
              event.preventDefault();
              setRouteIndex(i);
            }}
          >
            <Grid3X3 />
            {label}
          </Link>
        ))}
      </nav>
      <aside className="lw-views">
        <span>VIEWS</span>
        {[
          "All formulas",
          "Needs declaration",
          "Conflicts",
          "Released labels",
          "Active incidents",
        ].map((x, i) => (
          <button
            className={i === routeIndex ? "active" : ""}
            key={x}
            onClick={() => setRouteIndex(i)}
          >
            <Columns3 />
            {x}
            <b>
              {[c?.formulas, c?.declarations, c?.conflicts, c?.released, 0][
                i
              ] ?? 0}
            </b>
          </button>
        ))}
        <button>
          <Plus />
          Create view
        </button>
      </aside>
      <section className="lw-main">
        <header>
          <div>
            <span>BASE / {routeTitles[routeIndex].toUpperCase()}</span>
            <h1>{routeTitles[routeIndex]}</h1>
          </div>
          <div className="lw-tools">
            <button>
              <Filter />
              Filter
            </button>
            <button>
              <ChevronDown />
              Group
            </button>
            <label>
              <Search />
              <input placeholder="Find a formula" />
            </label>
          </div>
        </header>
        <div className="lw-metrics">
          {[
            ["Formulas", c?.formulas],
            ["Ingredients", c?.ingredients],
            ["Declarations", c?.declarations],
            ["Conflicts", c?.conflicts],
            ["Released", c?.released],
          ].map(([k, v]) => (
            <div key={String(k)}>
              <span>{k}</span>
              <b>{v ?? 0}</b>
            </div>
          ))}
        </div>
        <FormulaBoard />
        {p.isLoading ? (
          <div className="lw-loading">
            <LoaderCircle className="spin" />
            Loading base rows
          </div>
        ) : p.isError ? (
          <div className="lw-error">
            {p.error.message}
            <button onClick={() => p.refetch()}>Retry</button>
          </div>
        ) : (
          <Sheet rows={d?.recent_formulas ?? []} />
        )}
      </section>
      <aside className="lw-inspector">
        <span>FIELD INSPECTOR</span>
        <RouteInspector
          route={routeIndex}
          configured={Boolean(d?.registry?.configured)}
        />
        <DomainContractActions />
      </aside>
      <footer>
        <span>Grid view · 30s live refresh</span>
        <span>GenLayer Studionet 61999</span>
      </footer>
    </main>
  );
}
