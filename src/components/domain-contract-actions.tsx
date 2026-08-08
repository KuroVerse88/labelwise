"use client";

import { CornerDownLeft, LoaderCircle, RotateCcw, Sigma } from "lucide-react";
import {
  contractLabel,
  initialContractValue,
  longContractField,
  stringifyContractValue,
  useContractWorkflow,
} from "@/lib/contract-workflow";
import type { ContractParam } from "@/lib/contract-surface";

function FormulaCell({
  param,
  value,
  onChange,
}: {
  param: ContractParam;
  value: string;
  onChange: (value: string) => void;
}) {
  if (param.type === "bool") {
    return (
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="false">FALSE</option>
        <option value="true">TRUE</option>
      </select>
    );
  }
  if (longContractField(param)) {
    return <textarea value={value} onChange={(event) => onChange(event.target.value)} />;
  }
  return (
    <input
      type={param.type === "int" ? "number" : "text"}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export function DomainContractActions() {
  const flow = useContractWorkflow();
  const runFromKeyboard = (event: React.KeyboardEvent<HTMLElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      void flow.execute();
    }
  };

  return (
    <section
      className="lw-domain-actions"
      data-domain-control="formula-command-sheet"
      onKeyDown={runFromKeyboard}
    >
      <div className="lw-formula-bar">
        <b>fx</b>
        <select
          aria-label="Formula ledger operation"
          value={flow.selected.name}
          onChange={(event) => {
            const method = flow.methods.find(
              (item) => item.name === event.target.value,
            );
            if (method) flow.choose(method);
          }}
        >
          {flow.methods.map((method) => (
            <option key={method.name} value={method.name}>
              ={method.name.toUpperCase()}()
            </option>
          ))}
        </select>
        <button type="button" disabled={flow.busy} onClick={() => void flow.execute()}>
          {flow.busy ? <LoaderCircle className="spin" /> : <CornerDownLeft />}
        </button>
      </div>

      <table aria-label="Formula operation cells">
        <thead>
          <tr>
            <th />
            <th>A</th>
            <th>B</th>
            <th>C</th>
          </tr>
        </thead>
        <tbody>
          {flow.selected.params.map((param, index) => (
            <tr key={param.name}>
              <th>{index + 1}</th>
              <td>{contractLabel(param.name)}</td>
              <td>{param.type.toUpperCase()}</td>
              <td>
                <FormulaCell
                  param={param}
                  value={flow.values[param.name] ?? initialContractValue(param)}
                  onChange={(value) =>
                    flow.setValues((current) => ({
                      ...current,
                      [param.name]: value,
                    }))
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="lw-cell-output" aria-live="polite">
        <span>D{Math.max(1, flow.selected.params.length + 1)}</span>
        <Sigma />
        {(flow.result || flow.error) && (
          <button type="button" onClick={flow.reset} aria-label="Clear cell output">
            <RotateCcw />
          </button>
        )}
        {flow.error ? (
          <p>#ERROR! {flow.error}</p>
        ) : flow.result ? (
          <pre>{stringifyContractValue(flow.result)}</pre>
        ) : (
          <code>Ctrl + Enter to calculate</code>
        )}
      </div>

      <style jsx>{`
        .lw-domain-actions{border-top:4px solid #6c4cf1;background:#fff;margin-top:16px}.lw-formula-bar{display:grid;grid-template-columns:42px 1fr 44px;border:1px solid #d7d9e0}.lw-formula-bar b{display:grid;place-items:center;background:#f0f1f4;color:#6c4cf1}.lw-formula-bar select{border:0;border-inline:1px solid #d7d9e0;background:#fff;padding:8px;font:inherit}.lw-formula-bar button{border:0;background:#6c4cf1;color:#fff}
        table{width:100%;border-collapse:collapse;margin-top:8px}th,td{border:1px solid #d7d9e0;padding:6px;font-size:10px;text-align:left}thead th{background:#f0f1f4;text-align:center}tbody th{width:30px;background:#f0f1f4;text-align:center}tbody td:nth-child(2){width:120px}tbody td:nth-child(3){width:72px;color:#666a73}
        input,select,textarea{width:100%;min-height:34px;border:0;background:#fff;padding:5px;font:inherit}textarea{min-height:58px}
        .lw-cell-output{position:relative;display:grid;grid-template-columns:38px 24px 1fr;gap:7px;align-items:start;min-height:55px;border:1px solid #d7d9e0;border-top:0;padding:7px;background:#f7f7fb;font-size:10px}.lw-cell-output>span{color:#6c4cf1}.lw-cell-output button{position:absolute;right:6px;border:0;background:transparent}pre{grid-column:1/-1;white-space:pre-wrap;overflow-wrap:anywhere}
        @media(max-width:620px){tbody td:nth-child(2),tbody td:nth-child(3){width:auto}.lw-formula-bar{grid-template-columns:34px 1fr 40px}}
      `}</style>
    </section>
  );
}
