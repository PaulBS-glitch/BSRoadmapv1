import { loadRoadmapData } from "./roadmapData.js";
import { currency, percent, firstName, getDerived } from "./calculations.js";

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[char]));
}

function injectPageOneStyles() {
  if (document.getElementById("page1PatchStyles")) return;
  const style = document.createElement("style");
  style.id = "page1PatchStyles";
  style.textContent = `
    .page-one-revised .page-header { margin-bottom: 22px; }
    .page-one-hero {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 300px;
      gap: 28px;
      align-items: center;
      margin: 8px 0 24px;
    }
    .page-one-hero__copy {
      display: grid;
      align-content: center;
      min-height: 250px;
    }
    .page-one-title {
      margin: 0;
      color: var(--navy);
      font-family: Georgia, "Times New Roman", serif;
      font-size: clamp(64px, 7vw, 104px);
      line-height: .92;
      letter-spacing: -.065em;
      font-weight: 900;
    }
    .page-one-title span { color: var(--teal); }
    .page-one-image {
      min-height: 250px;
      border-radius: 30px;
      border: 1px solid rgba(6, 28, 61, .10);
      background:
        linear-gradient(135deg, rgba(255,255,255,.04), rgba(6,28,61,.08)),
        url('assets/p1.jpg');
      background-size: cover;
      background-position: center;
      box-shadow: 0 18px 46px rgba(6,28,61,.12);
      overflow: hidden;
    }
    .page-one-intro { margin-bottom: 24px; }
    .page-one-intro h2 {
      margin: 0 0 14px;
      color: var(--navy);
      font-family: Georgia, "Times New Roman", serif;
      font-size: 38px;
      line-height: 1.02;
      letter-spacing: -.04em;
      font-weight: 900;
    }
    .page-one-intro p {
      margin: 0 0 14px;
      color: var(--navy);
      font-size: 16.5px;
      line-height: 1.48;
      font-weight: 600;
    }
    .page-one-intro p:last-child { margin-bottom: 0; }
    .page-one-intro strong { color: var(--teal-dark); font-weight: 900; }
    .page-one-modules { margin-top: 0; }
    .page-one-module h2 { margin-bottom: 4px; }
    .page-one-commitment { margin-top: 16px; }
    .page-one-footer { align-items: flex-start; }
    @media (max-width: 1020px) {
      .page-one-hero { grid-template-columns: 1fr; }
      .page-one-hero__copy { min-height: 0; }
      .page-one-image { min-height: 300px; }
      .page-one-title { font-size: 58px; }
    }
  `;
  document.head.appendChild(style);
}

function pageHeader() {
  return `
    <header class="page-header">
      <div>
        <div class="brand-wordmark">BuySooner</div>
        <div class="brand-tagline">Buy sooner. Buy smarter.</div>
      </div>
      <div class="page-label">
        Page 1 — Personalised Roadmap
        <div class="page-progress"><span style="width:7%"></span></div>
      </div>
    </header>
  `;
}

function renderPageOne(data, d) {
  const name = firstName(data);
  return `
    ${pageHeader()}

    <section class="page-one-hero">
      <div class="page-one-hero__copy">
        <h1 class="page-one-title">Welcome home, <span>${esc(name)}</span>.</h1>
      </div>
      <aside class="page-one-image" aria-label="Personalised Roadmap image"></aside>
    </section>

    <section class="page-one-intro card">
      <h2>Your personalised Roadmap</h2>
      <p>We know that in a market like <strong>${esc(data.targetArea)}</strong>, timing is everything. This Roadmap has been prepared to show how BuySooner may help you bridge the deposit gap, understand the cost of waiting, and move towards buying sooner rather than years from now.</p>
      <p>It brings together the key inputs from your scenario — your target property price, your contribution, the BuySooner Boost, your estimated bank loan, rent position, growth assumptions and indicative refinance pathway — so you can see the full picture in one place.</p>
      <p>At BuySooner, we believe in a partnership built on <strong>Total Transparency</strong>. On the following pages, we have broken down the numbers, growth projections, worked examples, exit pathway and key assumptions in plain English so you can make an informed decision about your future.</p>
    </section>

    <div class="grid-2 page-one-modules">
      <section class="card page-one-module">
        <h2>1. Your Property Snapshot</h2>
        <p class="small-note">Strategic overview of your current buying power.</p>
        <table class="table">
          <tr><td>Target purchase price</td><td>${currency(d.price)}</td></tr>
          <tr><td>Target area</td><td>${esc(data.targetArea)}</td></tr>
          <tr><td>Your cash contribution</td><td>${currency(d.contribution)}</td></tr>
          <tr><td>Estimated bank loan</td><td>${currency(d.estimatedMortgage)}</td></tr>
          <tr><td>The BuySooner “Boost”</td><td>${currency(d.boost)}</td></tr>
          <tr><td>Estimated deposit gap bridged</td><td>${currency(d.boost)}</td></tr>
          <tr><td>Total deposit position</td><td>${currency(d.totalDeposit)}</td></tr>
          <tr><td>Starting deposit position</td><td>${percent(d.depositPercent)}</td></tr>
        </table>
      </section>

      <section class="card page-one-module">
        <h2>2. The Strategy & Assumptions</h2>
        <p class="small-note">The Roadmap to full independence.</p>
        <table class="table">
          <tr><td>Projected market growth</td><td>${percent(d.growthRate)} p.a.</td></tr>
          <tr><td>Target refinance window</td><td>Year ${data.refinanceStartYear} to Year ${data.refinanceEndYear}</td></tr>
          <tr><td>The BuySooner Commitment</td><td>$0 monthly repayments</td></tr>
          <tr><td>Indicative refinance target</td><td>Around ${percent(data.refinanceTargetLvr, 0)} LVR or lower</td></tr>
          <tr><td>Current rent</td><td>${currency(d.rentMonthly)} per month</td></tr>
        </table>
        <div class="notice page-one-commitment"><strong>The BuySooner Commitment:</strong> While you own the home, your monthly cash flow remains focused on paying down your primary mortgage. You make no monthly repayments to BuySooner.</div>
      </section>
    </div>

    <footer class="footer-note page-one-footer">
      <span><strong>Plan details:</strong> Strategy: ${esc(data.propertyStrategy)} · Broker: ${esc(data.brokerName)}, ${esc(data.brokerFirm)} · Date: ${esc(data.preparedDate)}</span>
      <span>This Roadmap is an indicative illustration designed to provide a conceptual overview of the BuySooner model. It does not constitute a formal loan approval, property valuation, or financial, legal or tax advice.</span>
    </footer>
  `;
}

async function patchPageOne() {
  injectPageOneStyles();
  const data = await loadRoadmapData();
  const d = getDerived(data);

  const apply = () => {
    const firstPage = document.querySelector(".report-page--cover");
    if (!firstPage) return false;
    firstPage.classList.add("page-one-revised");
    firstPage.innerHTML = renderPageOne(data, d);
    return true;
  };

  if (apply()) return;

  const root = document.getElementById("roadmapRoot");
  if (!root) return;
  const observer = new MutationObserver(() => {
    if (apply()) observer.disconnect();
  });
  observer.observe(root, { childList: true, subtree: true });
}

patchPageOne().catch(error => console.error("Page 1 patch failed", error));
