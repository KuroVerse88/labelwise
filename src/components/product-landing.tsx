"use client";

import Link from "next/link";
import { ArrowRight, Check, ExternalLink, Plus } from "lucide-react";
import { contractAddress, contractExplorerUrl } from "@/lib/deployment";

const columns = ["Item", "Source", "Claim", "Status"];
const rows = [
  ["A-001", "Public label", "Composition", "Ready"],
  ["A-002", "Specification", "Threshold", "Review"],
  ["A-003", "Registry", "Identity", "Open"],
];

export function ProductLanding() {
  return (
    <main className="label-entry" data-landing="ingredient-spreadsheet">
      <header><Link href="./" className="logo"><span>LW</span> Labelwise</Link><div className="tabs"><Link href="./ledger/">Ingredients</Link><Link href="./incidents/">Incidents</Link></div><Link href="./ledger/">Open base</Link></header>
      <section className="workspace">
        <aside>
          <span className="base-title">BASE 05</span>
          <nav>
            <b><i className="mint"/>Verification queue</b>
            <span><i className="yellow"/>Claim sources</span>
            <span><i className="violet"/>Decision log</span>
          </nav>
          <div className="contract"><small>CONNECTED TABLE</small><code>{contractAddress ? `${contractAddress.slice(0,7)}...${contractAddress.slice(-5)}` : "Pending"}</code><a href={contractExplorerUrl} target="_blank" rel="noreferrer">StudioNet <ExternalLink size={12}/></a></div>
        </aside>
        <div className="main">
          <div className="toolbar"><button><Plus size={15}/> Add record</button><span>Verified ingredient claims / GenLayer</span></div>
          <div className="hero-copy">
            <p>STRUCTURED CLAIM REVIEW</p>
            <h1>Turn every label into a row you can prove.</h1>
            <p>Collect product claims, attach attributable evidence and publish decisions from one structured verification base.</p>
            <Link href="./ledger/">Open verification queue <ArrowRight size={18}/></Link>
          </div>
          <div className="grid" role="table" aria-label="Example verification ledger">
            {columns.map((col,i)=><b key={col}><span>{String.fromCharCode(65+i)}</span>{col}</b>)}
            {rows.flatMap((row,r)=>row.map((cell,c)=><div key={`${r}-${c}`} className={c===3 ? cell.toLowerCase() : ""}>{c===0?<span className="rownum">{r+1}</span>:null}{c===3&&cell==="Ready"?<Check size={14}/>:null}{cell}</div>))}
          </div>
        </div>
      </section>
      <style jsx global>{`
        .label-entry{min-height:100vh;background:#f7f7fb;color:#202124;font-family:"Nunito Sans",sans-serif}
        header{height:64px;background:#fff;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 24px;border-bottom:1px solid #d7d9e0}header a{color:inherit;text-decoration:none}.logo{display:flex;align-items:center;gap:10px;font-size:18px;font-weight:800}.logo span{background:#6c4cf1;color:#fff;padding:6px}.tabs{display:flex;align-self:stretch}.tabs a{display:flex;align-items:center;padding:0 20px;border-left:1px solid #e2e3e8}.tabs a:last-child{border-right:1px solid #e2e3e8}header>a:last-child{text-align:right;font-size:13px}
        .workspace{display:grid;grid-template-columns:230px 1fr;min-height:calc(100vh - 64px)}aside{background:#202124;color:#fff;padding:24px 18px;display:flex;flex-direction:column}.base-title{font-size:11px;color:#bfc1c7;margin-bottom:30px}aside nav{display:flex;flex-direction:column;gap:8px}aside nav span,aside nav b{font-size:13px;padding:11px 9px;display:flex;align-items:center;gap:10px}aside nav b{background:#34363a}aside nav i{width:9px;height:9px}.mint{background:#65e6ba}.yellow{background:#ffda5a}.violet{background:#a891ff}.contract{margin-top:auto;border-top:1px solid #4a4c50;padding-top:18px;display:flex;flex-direction:column;gap:8px}.contract small{color:#bfc1c7}.contract code{font-size:11px}.contract a{color:#65e6ba;font-size:12px;display:flex;gap:6px;align-items:center}
        .main{min-width:0}.toolbar{height:52px;background:#fff;border-bottom:1px solid #d7d9e0;padding:0 18px;display:flex;align-items:center;gap:18px}.toolbar button{border:0;background:#6c4cf1;color:#fff;padding:9px 12px;font:700 12px inherit;display:flex;align-items:center;gap:7px}.toolbar span{font-size:12px;color:#666a73}
        .hero-copy{padding:clamp(42px,7vw,88px) clamp(24px,6vw,80px) 52px;background:#e8fff7;border-bottom:1px solid #abdaca}.hero-copy>p:first-child{font-size:11px;font-weight:800;color:#4f35c7}h1{font-size:clamp(46px,6vw,78px);line-height:1;margin:16px 0 24px;max-width:900px}.hero-copy>p:nth-of-type(2){font-size:18px;line-height:1.55;max-width:690px}.hero-copy a{display:inline-flex;align-items:center;gap:10px;background:#202124;color:#fff;text-decoration:none;padding:14px 17px;margin-top:15px;font-weight:800}
        .grid{display:grid;grid-template-columns:.7fr 1.2fr 1.5fr .7fr;background:#fff;overflow:auto}.grid>b,.grid>div{min-height:48px;border-right:1px solid #d7d9e0;border-bottom:1px solid #d7d9e0;padding:12px;font-size:13px;display:flex;align-items:center;gap:7px;white-space:nowrap}.grid>b{background:#f0f1f4}.grid>b span{color:#8b8e95;font-size:10px;margin-right:auto}.rownum{width:20px;color:#8b8e95}.ready{background:#d9f8e8;color:#12683d}.review{background:#fff1b8}.open{background:#eee9ff;color:#4f35c7}
        @media(max-width:760px){header{grid-template-columns:1fr auto}.tabs{display:none}.workspace{grid-template-columns:1fr}aside{min-height:92px;padding:14px 18px;display:grid;grid-template-columns:1fr auto}.base-title{margin:0}aside nav{display:none}.contract{margin:0;border:0;padding:0;text-align:right}.contract small,.contract a{display:none}.hero-copy{padding:46px 22px}h1{font-size:44px}.grid{grid-template-columns:110px 150px 190px 105px}.toolbar span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}}
      `}</style>
    </main>
  );
}
