
import { loadRoadmapData, saveDemoData, clearStoredRoadmapData } from "./roadmapData.js";
import {
  currency,
  signedCurrency,
  percent,
  shortCurrency,
  firstName,
  getDerived,
  scenarioForGrowth
} from "./calculations.js";

const PAGE_COUNT = 14;

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[char]));
}

function pageHeader(page, title, progress = page / PAGE_COUNT) {
  return `
    <header class="page-header">
      <div>
        <div class="brand-wordmark">BuySooner</div>
        <div class="brand-tagline">Buy sooner. Buy smarter.</div>
      </div>
      <div class="page-label">
        Page ${page} — ${esc(title)}
        <div class="page-progress"><span style="width:${Math.round(progress * 100)}%"></span></div>
      </div>
    </header>
  `;
}

function page1(data, d) {
  const name = firstName(data);
  const buyerLine = data.buyerType === "upgrader"
    ? "You are looking to upgrade. That means the key question is whether BuySooner can help you move into the next property sooner while keeping a clear refinance pathway."
    : "You are currently renting and looking to buy. That means every month spent waiting may mean more rent paid while the deposit target keeps moving.";

  return `
  <section class="report-page report-page--cover">
    ${pageHeader(1, "Personalised Path")}
    <div class="grid-2" style="align-items:start;">
      <div>
        <h1 class="hero-title">Your Personalised Path to Ownership</h1>
        <p class="hero-subtitle">Bridge the deposit gap. Get into the market earlier. Own from day one.</p>
      </div>
      <aside class="meta-card">
        <div class="meta-row"><span>Prepared for</span><strong>${esc(data.customerName)}</strong></div>
        <div class="meta-row"><span>Strategy</span><strong>${esc(data.propertyStrategy)}</strong></div>
        <div class="meta-row"><span>Prepared with</span><strong>${esc(data.brokerName)}, ${esc(data.brokerFirm)}</strong></div>
        <div class="meta-row"><span>Date</span><strong>${esc(data.preparedDate)}</strong></div>
      </aside>
    </div>

    <div class="card" style="margin-top:30px; max-width:920px;">
      <p><strong>Hi ${esc(name)},</strong></p>
      <p>Thank you for sharing your goals with BuySooner.</p>
      <p>We know that in a market like <strong>${esc(data.targetArea)}</strong>, timing is everything. This Roadmap has been designed to show you exactly how we can help you bridge the deposit gap, bypass the <strong>“Waiting Tax”</strong>, and secure your home today rather than years from now.</p>
      <p>At BuySooner, we believe in <strong>Total Transparency</strong>. This is not just a financial arrangement; it is a partnership. On the following pages, we have broken down the numbers, the growth projections, and the exit strategy in plain English so you can make an informed decision about your future.</p>
      <p>Based on what you have shared, your main barrier appears to be closing the deposit gap — not necessarily finding the right property or wanting to buy.</p>
      <p>${esc(buyerLine)}</p>
    </div>

    <div class="grid-2" style="margin-top:26px;">
      <section class="card">
        <h2 style="margin-bottom:4px;">1. Your Property Snapshot</h2>
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
        <div class="result-box" style="margin-top:18px;">
          <p><strong>The Result:</strong> By partnering with BuySooner, you are entering the market with a full <strong>${percent(d.depositPercent, 0)} deposit</strong> — <strong>${currency(d.totalDeposit)} total</strong> — significantly increasing your buying power and eliminating the need for Lenders Mortgage Insurance (LMI).</p>
          <span class="highlight-number">Estimated LMI avoided: ${currency(d.lmiAvoided)}*</span>
        </div>
      </section>

      <section class="card">
        <h2 style="margin-bottom:4px;">2. The Strategy & Assumptions</h2>
        <p class="small-note">The Roadmap to full independence.</p>
        <table class="table">
          <tr><td>Projected market growth</td><td>${percent(d.growthRate)} p.a.</td></tr>
          <tr><td>Target refinance window</td><td>Year ${data.refinanceStartYear} to Year ${data.refinanceEndYear}</td></tr>
          <tr><td>The BuySooner Commitment</td><td>$0 monthly repayments</td></tr>
          <tr><td>Indicative refinance target</td><td>Around ${percent(data.refinanceTargetLvr, 0)} LVR or lower</td></tr>
          <tr><td>Current rent</td><td>${currency(d.rentMonthly)} per month</td></tr>
        </table>
        <div class="notice" style="margin-top:16px;"><strong>The BuySooner Commitment:</strong> While you own the home, 100% of your monthly cash flow remains focused on paying down your primary mortgage.</div>
        <div class="card" style="margin-top:18px; background:linear-gradient(135deg, rgba(9,132,124,.10), rgba(255,255,255,.76));">
          <h3>Why this matters</h3>
          <p>In a market growing at <strong>${percent(d.growthRate)} p.a.</strong>, waiting just one more year to save that extra <strong>${currency(d.boost)}</strong> could see the price of a <strong>${esc(data.targetArea)}</strong> property rise by approximately <strong>${currency(d.oneYearGrowth)}</strong>.</p>
          <p><strong>BuySooner lets you capture that growth instead of paying for it later.</strong></p>
        </div>
      </section>
    </div>

    <footer class="footer-note">
      <span>This Roadmap is an indicative illustration designed to provide a conceptual overview of the BuySooner model. It does not constitute a formal loan approval, property valuation, or financial, legal or tax advice.</span>
      <span>*Estimated LMI avoided is a rough calculation only and is not a lender quote.</span>
    </footer>
  </section>`;
}

function page2(data, d) {
  return `
  <section class="report-page">
    ${pageHeader(2, "Cost of Waiting")}
    <div class="grid-2" style="align-items:center;">
      <div>
        <h1 class="hero-title">The Cost of Waiting</h1>
        <p class="hero-subtitle">The great Australian dream has become a maths problem. Property values may grow faster than you can save.</p>
        <p class="hero-copy">For <strong>${esc(firstName(data))}</strong>, waiting to buy in <strong>${esc(data.targetArea)}</strong> could mean chasing a moving target while continuing to pay rent.</p>
      </div>
      <div class="card" style="min-height:190px; background:linear-gradient(135deg, var(--teal-soft), #fff); display:grid; place-items:center; text-align:center;">
        <div style="font-size:68px;">⏳</div>
        <strong style="font-size:24px; color:var(--navy);">Time can be expensive.</strong>
      </div>
    </div>

    <section class="card" style="margin-top:24px;">
      <h2 class="section-title">The facts behind the challenge</h2>
      <div class="grid-3">
        <div class="fact-card" style="text-align:center; padding:22px;"><h3>Home values surged</h3><div style="font:900 48px Georgia; color:var(--teal);">560%</div><p><strong>$210k → $1.18m</strong><br>Average capital-city house value since 2000.</p></div>
        <div class="fact-card" style="text-align:center; padding:22px;"><h3>Homes are less affordable</h3><div style="font:900 48px Georgia; color:var(--teal);">15%</div><p>Share of homes a typical household can afford.</p></div>
        <div class="fact-card" style="text-align:center; padding:22px;"><h3>Deposits still take years</h3><div style="font:900 48px Georgia; color:var(--teal);">5+ years</div><p>Average time to save a 20% deposit.</p></div>
      </div>
      <p class="small-note" style="text-align:center; margin-top:14px;">Sources: Propertyology 25-year study, PropTrack Housing Affordability Report 2025, REIA affordability reporting, ABC coverage of Domain’s First Home Buyer Report, Domain’s December 2025 House Price Report.</p>
    </section>

    <div class="grid-2" style="margin-top:22px; align-items:start;">
      <section class="card" style="text-align:center;">
        <h2>Your home today and tomorrow</h2>
        <p><strong>${esc(data.targetArea)}</strong></p>
        <div class="grid-3" style="grid-template-columns: 1fr 60px 1fr; align-items:center;">
          <div class="card"><span class="small-note">Today</span><strong style="display:block; font:900 38px Georgia; color:var(--navy);">${shortCurrency(d.price)}</strong></div>
          <div style="font-size:36px; color:var(--teal); font-weight:900;">→</div>
          <div class="card"><span class="small-note">Future</span><strong style="display:block; font:900 38px Georgia; color:var(--navy);">${shortCurrency(d.futureAfterWait)}</strong></div>
        </div>
        <p style="margin-top:12px;">The goalposts move by <strong>${currency(d.priceMovement)}</strong>.</p>
      </section>

      <section class="card" style="text-align:center;">
        <h2>The Waiting Tax is</h2>
        <div style="font:900 86px Georgia; color:var(--navy); letter-spacing:-.06em;">${currency(d.waitingTax)}</div>
        <p>The goalposts move while you wait. The same home gets more expensive, while rent keeps draining cash that could be building your own equity.</p>
        <div class="notice"><strong>The Rent Drain:</strong> At ${currency(d.rentMonthly)}/month, ${d.waitingYears} years of renting costs ${currency(d.rentDrain)}.</div>
      </section>
    </div>

    <section class="card" style="margin-top:22px;">
      <h2 style="text-align:center;">The choice is yours</h2>
      <div class="grid-2">
        <div class="card" style="background:var(--red-soft);"><h3>Wait ${d.waitingYears} years</h3><strong>${currency(d.waitingTax)} growth and rent drain</strong><p>While waiting means staying on the treadmill, stuck in the rent trap, and compromising on where you live, you remain stuck in a constant “what if”.</p></div>
        <div class="card" style="background:var(--teal-soft);"><h3>Buy now</h3><strong>Start building equity</strong><p>Use BuySooner to bridge the deposit gap and move towards ownership instead of chasing the market.</p></div>
      </div>
      <p style="text-align:center; font-weight:900;">The balance is simple: keep chasing the market, or use BuySooner to bridge the gap.</p>
    </section>

    <footer class="footer-note">
      <span>This is a what-if scenario only. It is not a property valuation or market forecast.</span>
      <span>Assumptions: ${percent(d.growthRate)} p.a. growth, ${currency(d.price)} target property, ${currency(d.rentMonthly)}/month rent, ${d.waitingYears}-year waiting period.</span>
    </footer>
  </section>`;
}

function page3(data, d) {
  return `
  <section class="report-page">
    ${pageHeader(3, "Practical Way Forward")}
    <div class="grid-2" style="align-items:center;">
      <div>
        <h1 class="hero-title">A Practical Way Forward</h1>
        <p class="hero-subtitle">A practical bridge, not a forever arrangement.</p>
        <p class="hero-copy"><strong>${esc(firstName(data))}</strong>, BuySooner is designed for people who can afford a home loan, but cannot save a full deposit fast enough to buy now.</p>
      </div>
      <div class="result-box"><p>We are not a traditional lender, and we are not replacing your bank. We simply provide the <strong>one-off capital contribution</strong> you need to bridge the gap and buy today.</p></div>
    </div>

    <section class="card" style="margin-top:26px;">
      <h2 class="section-title">How BuySooner Works</h2>
      <div class="grid-4">
        ${[
          ["1", "⌂", "You own the home", "Your home is bought in your name. You are the legal owner from day one.", `For your ${esc(data.targetArea)} scenario: you own the home from day one.`],
          ["2", "▥", "Your bank loan stays standard", "You still use a normal home loan. BuySooner helps cover the deposit gap.", `For your scenario: estimated bank loan of ${currency(d.estimatedMortgage)}.`],
          ["3", "$", "No monthly payments to BuySooner", "You keep paying your main mortgage. BuySooner is repaid later at exit.", "For your scenario: $0 monthly payments to BuySooner."],
          ["4", "↗", "Clear exit path", `The intended path is refinance within ${data.refinanceStartYear} to ${data.refinanceEndYear} years. Sale remains a backup option.`, `For your scenario: target refinance window is Year ${data.refinanceStartYear} to Year ${data.refinanceEndYear}.`]
        ].map(([num, icon, title, body, note]) => `
          <article class="card" style="text-align:center;">
            <div class="icon-box" style="width:74px;height:74px;margin:0 auto 14px;font-size:38px;">${icon}</div>
            <h3>${title}</h3>
            <p>${body}</p>
            <p class="notice" style="margin-top:12px;">${note}</p>
          </article>`).join("")}
      </div>
    </section>

    <section class="grid-2" style="margin-top:24px;">
      <div class="card">
        <h2>The Practical Reality</h2>
        <div class="notice"><strong>The problem:</strong> You are mortgage-ready but deposit constrained. Your cash contribution is ${currency(d.contribution)}, but the target 20% deposit position is ${currency(d.targetDeposit)}.</div>
        <div class="notice" style="margin-top:12px;"><strong>The reality:</strong> You can afford the repayments, but cannot save the lump sum fast enough. While you wait, the property price may keep moving.</div>
        <div class="notice" style="margin-top:12px;"><strong>The solution:</strong> BuySooner bridges that final gap so you can buy sooner. In this scenario, the BuySooner Boost is ${currency(d.boost)}.</div>
      </div>
      <div class="result-box" style="display:grid;align-content:center;">
        <p><strong>For ${esc(firstName(data))}:</strong> BuySooner is designed to turn a deposit shortfall into a clear ownership pathway — buy now, build equity, and refinance when the numbers work.</p>
      </div>
    </section>
  </section>`;
}

function page4(data, d) {
  const renter = data.buyerType !== "upgrader";
  return `
  <section class="report-page">
    ${pageHeader(4, "Stop Waiting")}
    <div style="text-align:center;">
      <h1 class="hero-title">What changes when <span>you stop waiting?</span></h1>
      <p class="hero-copy" style="max-width:820px;margin:20px auto;"><strong>${esc(firstName(data))}</strong>, this is what the Roadmap is really about: moving from uncertainty to ownership. For someone trying to buy in <strong>${esc(data.targetArea)}</strong>, BuySooner is designed to change the experience from waiting, renting and compromising into owning, settling in and building equity.</p>
    </div>
    <section class="grid-2" style="margin-top:26px;">
      <div class="card">
        <h2>How it feels now</h2>
        <div class="notice"><strong>The Treadmill:</strong> Saving every month but feeling like you are standing still as prices rise. The target keeps moving while you save.</div>
        <div class="notice" style="margin-top:12px;"><strong>${renter ? "The Rent Trap" : "The Equity Trap"}:</strong> ${renter ? `Paying “dead money” every week that builds someone else’s equity. For ${esc(firstName(data))}: current rent of ${currency(d.rentMonthly)} per month may continue while you wait.` : "Your current home may be building equity, but the next property may also be moving further away."}</div>
        <div class="notice" style="margin-top:12px;"><strong>The Compromise:</strong> Looking at suburbs you do not like because the ones you love are moving out of reach. For ${esc(firstName(data))}: the goal is to buy in ${esc(data.targetArea)}, not keep compromising.</div>
        <div class="notice" style="margin-top:12px;"><strong>The Uncertainty:</strong> The constant “what if?” — what if prices jump another 10% while I wait?</div>
      </div>
      <div class="card">
        <h2>How it feels with BuySooner</h2>
        <div class="notice"><strong>Market Certainty:</strong> You have stopped chasing the market because you are finally in it.</div>
        <div class="notice" style="margin-top:12px;"><strong>Building Wealth:</strong> Your mortgage payments now build your equity, while rent no longer builds someone else’s.</div>
        <div class="notice" style="margin-top:12px;"><strong>No More Settling:</strong> Buy the home you actually want, in the area you actually want to live. For ${esc(firstName(data))}: that means pursuing the ${esc(data.propertyStrategy)} strategy sooner.</div>
        <div class="notice" style="margin-top:12px;"><strong>Permanent Belonging:</strong> The security and pride of owning a home that is truly yours.</div>
      </div>
    </section>
    <section class="dark-strip" style="margin-top:24px; display:grid; grid-template-columns:120px 1fr; gap:24px; align-items:center;">
      <div style="font-size:74px;">⚿</div>
      <div>
        <h2 style="color:#fff;">With BuySooner, you get the keys today.</h2>
        <p>You capture today’s price, lock in your location, and turn your rent into equity. We provide the capital boost so you can stop watching the market and start owning it.</p>
        <p><strong>For ${esc(firstName(data))}, the shift is simple: stop chasing ${esc(data.targetArea)} from the outside and start building ownership from within the market.</strong></p>
      </div>
    </section>
  </section>`;
}

function page5(data, d) {
  return `
  <section class="report-page">
    ${pageHeader(5, "Solution Bridge")}
    <div class="grid-2" style="align-items:center;">
      <div>
        <h1 class="hero-title">Can BuySooner be the solution?</h1>
        <p class="hero-subtitle">We’ve crunched the numbers. Here is your bridge.</p>
        <p class="hero-copy"><strong>${esc(firstName(data))}</strong>, based on your <strong>${esc(data.targetArea)}</strong> scenario, the challenge is clear. You are not starting from zero. You already have a meaningful contribution. The issue is the missing piece between your current deposit and the deposit position usually needed to buy now. BuySooner is designed to bridge that missing piece.</p>
      </div>
      <div class="card" style="display:grid;place-items:center;text-align:center;min-height:230px;background:linear-gradient(135deg,var(--teal-soft),#fff);">
        <div style="font-size:76px;">🌉</div>
        <strong style="font-size:26px;color:var(--navy);">The deposit bridge, shown in plain English.</strong>
      </div>
    </div>

    <section class="card" style="margin-top:24px;">
      <h2 class="section-title">The Reality Check</h2>
      <div class="grid-3">
        <div class="card" style="text-align:center;"><span class="small-note">The Target</span><strong style="display:block;font:900 38px Georgia;color:var(--blue);">${currency(d.price)}</strong><p>The price of the home you want to buy today.</p></div>
        <div class="card" style="text-align:center;"><span class="small-note">The Hurdle</span><strong style="display:block;font:900 38px Georgia;color:var(--blue);">${currency(d.targetDeposit)}</strong><p>The 20% deposit usually required to unlock the door.</p></div>
        <div class="card" style="text-align:center;background:var(--teal-soft);"><span class="small-note">The Missing Piece</span><strong style="display:block;font:900 38px Georgia;color:var(--teal);">${currency(d.depositGap)}</strong><p>The shortfall preventing your purchase now.</p></div>
      </div>

      <h2 style="text-align:center;margin-top:26px;">The Logic of the Solution</h2>
      <div class="grid-5" style="align-items:center;text-align:center;">
        <div class="card"><strong style="font:900 36px Georgia;color:var(--teal);">${currency(d.contribution)}</strong><span class="small-note">Your contribution</span></div>
        <div style="font-size:36px;color:var(--teal);font-weight:900;">+</div>
        <div class="card"><strong style="font:900 36px Georgia;color:var(--purple);">${currency(d.boost)}</strong><span class="small-note">BuySooner bridge</span></div>
        <div style="font-size:36px;color:var(--teal);font-weight:900;">=</div>
        <div class="card" style="background:var(--teal-soft);"><strong style="font:900 36px Georgia;color:var(--blue);">${currency(d.totalDeposit)}</strong><span class="small-note">${percent(d.depositPercent, 0)} milestone achieved</span></div>
      </div>
      <div class="dark-strip" style="text-align:center;margin-top:20px;">The Result: BuySooner bridges the missing piece so you can move from planning to buying.</div>
    </section>

    <section style="margin-top:24px;">
      <h2 class="section-title">The Transfer of Value</h2>
      <div class="grid-3">
        <div class="card"><h3>From Saving to Owning</h3><p>You stop “chasing” the full deposit and start building equity in your own home from Day 1.</p></div>
        <div class="card"><h3>From Waiting to Locking-In</h3><p>You secure the ${currency(d.price)} price today, and future growth in the ${esc(data.targetArea)} market works for you, not against you.</p></div>
        <div class="card"><h3>From Renting to Investing</h3><p>Your ${currency(d.rentMonthly)} monthly rent drain starts supporting your own future, not your landlord’s.</p></div>
      </div>
      <div class="dark-strip" style="text-align:center;margin-top:20px;font-size:24px;font-weight:900;">You bring the contribution. We bring the bridge.</div>
      <p class="small-note" style="text-align:center;">For ${esc(firstName(data))}, the BuySooner bridge is the ${currency(d.boost)} missing piece between saving and owning.</p>
    </section>
  </section>`;
}

function page6(data, d) {
  return `
  <section class="report-page">
    ${pageHeader(6, "Path to Ownership")}
    <div class="grid-2" style="align-items:center;">
      <div>
        <h1 class="hero-title">Your Path to <span>100% Ownership</span></h1>
        <p class="hero-subtitle">BuySooner is your head start — designed to help you step in today and step up tomorrow.</p>
        <p class="hero-copy"><strong>${esc(firstName(data))}</strong>, this pathway is designed to help you enter the ${esc(data.targetArea)} market now, then review the refinance position from Year ${data.refinanceStartYear}.</p>
      </div>
      <div class="card" style="display:grid;place-items:center;text-align:center;min-height:240px;background:linear-gradient(135deg,var(--teal-soft),#fff);">
        <div style="font-size:76px;">🗝</div><strong style="font-size:24px;color:var(--navy);">Step in today. Step up tomorrow.</strong>
      </div>
    </div>

    <section class="card" style="margin-top:24px;">
      <div style="display:grid;grid-template-columns:230px 1fr;background:var(--navy);color:white;border-radius:18px 18px 0 0;overflow:hidden;font-weight:900;">
        <div style="padding:16px;">Milestone</div><div style="padding:16px;">Your Journey to Independence</div>
      </div>
      ${[
        ["Day 1: Move In", "You provide your deposit; we bridge the gap. You unlock the keys and start building equity in your own four walls from the very first day.", `In your scenario: the BuySooner bridge helps close the ${currency(d.boost)} missing piece.`],
        ["Years 1–2: Momentum", "As you pay down your mortgage and the market moves, your ownership stake grows. You are no longer paying a landlord — you are investing in yourself.", "In your scenario: your housing payments start supporting your own future."],
        ["Year 3: The Checkpoint", "We sit down together to review your progress. If your equity has grown and the numbers align, we begin the transition to your long-term bank.", "The Year 3 checkpoint is the first major review point in this Roadmap."],
        ["Years 3–5: The Exit Window", "This is the “Refinance Sweet Spot”. When the time is right, you switch to a standard bank mortgage and BuySooner steps out of the picture entirely.", `The target refinance window is Year ${data.refinanceStartYear} to Year ${data.refinanceEndYear}.`],
        ["The Result: Total Freedom", "BuySooner is repaid in full. You are left with a standard mortgage, a wealth of equity, and a home that is 100% yours.", `For ${esc(firstName(data))}: the goal is full ownership in the ${esc(data.targetArea)} property sooner.`]
      ].map(([title, body, note]) => `
        <div style="display:grid;grid-template-columns:230px 1fr;border-bottom:1px solid var(--line);">
          <div style="padding:18px;background:var(--teal-soft);font-weight:900;color:var(--teal-dark);">${title}</div>
          <div style="padding:18px;"><p>${body}</p><span class="notice">${note}</span></div>
        </div>`).join("")}
    </section>

    <section class="dark-strip" style="margin-top:24px;">
      <h2 style="color:white;">The Bottom Line</h2>
      <p>Stop waiting for the “perfect” market. Build equity while others save for a deposit.</p>
      <p><strong>Our goal is not to stay in your home — it is to get you into it sooner, so you can own it sooner.</strong></p>
    </section>
  </section>`;
}

function page7(data, d) {
  return `
  <section class="report-page">
    ${pageHeader(7, "How Numbers Work")}
    <div class="grid-2" style="align-items:center;">
      <div>
        <h1 class="hero-title">How the Numbers Work</h1>
        <p class="hero-subtitle">A typical ${d.exitYear}-year journey with BuySooner.</p>
        <p class="hero-copy"><strong>${esc(firstName(data))}</strong>, this page explains the investment partnership in plain English: what you may gain by starting today, and what BuySooner receives when it steps out.</p>
      </div>
      <div class="result-box"><p>You have the income. We bridge the gap. You own the future.</p></div>
    </div>

    <section class="grid-2" style="margin-top:24px;">
      <div class="card"><h2>The Setup</h2><table class="table">
        <tr><td>The Goal</td><td>${currency(d.price)} ${esc(data.targetArea)} home</td></tr>
        <tr><td>Your Start</td><td>${currency(d.contribution)} deposit + ${currency(d.estimatedMortgage)} mortgage</td></tr>
        <tr><td>The Catalyst</td><td>BuySooner adds ${currency(d.boost)}</td></tr>
        <tr><td>The Forecast</td><td>${percent(d.growthRate)} annual property growth</td></tr>
      </table></div>
      <div class="card"><h2>${d.exitYear} Years Later: How BuySooner Steps Out</h2><table class="table">
        <tr><td>New property value</td><td>${currency(d.exitValue)}</td></tr>
        <tr><td>BuySooner Boost repaid</td><td>${currency(d.boost)}</td></tr>
        <tr><td>BuySooner agreed share</td><td>${currency(d.exitShare)}</td></tr>
        <tr><td>Total BuySooner payout</td><td>${currency(d.totalBuySoonerPayout)}</td></tr>
      </table></div>
    </section>

    <div class="dark-strip" style="text-align:center;margin-top:22px;font-size:22px;font-weight:900;">You have the income. We bridge the gap. You own the future.</div>

    <section class="grid-2" style="margin-top:22px;">
      <div class="card"><h2>Value of Ownership</h2><table class="table">
        <tr><td>Property growth captured</td><td>${signedCurrency(d.growthCaptured)}</td></tr>
        <tr><td>Rent redirected</td><td>${signedCurrency(d.rentDrain)}</td></tr>
      </table></div>
      <div class="card"><h2>The Investment Partnership</h2><table class="table">
        <tr><td>Return of original BuySooner Boost</td><td>${currency(d.boost)}</td></tr>
        <tr><td>BuySooner agreed exit share</td><td>${currency(d.exitShare)}</td></tr>
        <tr><td>Total BuySooner payout</td><td>${currency(d.totalBuySoonerPayout)}</td></tr>
      </table></div>
    </section>

    <section style="margin-top:22px;">
      <h2 class="section-title">The Honest Trade-Off</h2>
      <div class="grid-4">
        <div class="result-box"><h3>The Reality</h3><p>BuySooner risks its capital to bridge your deposit gap today.</p></div>
        <div class="result-box"><h3>The Trade</h3><p>When you refinance, BuySooner is repaid its original contribution plus an agreed share of the value created.</p></div>
        <div class="result-box"><h3>The Outcome</h3><p>You move into the home you love years earlier, stop losing money to rent and start capturing your share of market growth.</p></div>
        <div class="result-box"><h3>The Point</h3><p>You own the home from Day 1. BuySooner provides the capital to start sooner.</p></div>
      </div>
    </section>

    <footer class="footer-note">
      <span><strong>Indicative example only.</strong> Final BuySooner payout depends on the agreed product terms, property value at exit, timing, refinance outcome, sale outcome if applicable, and final legal documentation.</span>
      <span>Property growth and refinance availability are not guaranteed.</span>
    </footer>
  </section>`;
}

function page8(data, d) {
  return `
  <section class="report-page">
    ${pageHeader(8, "Worked Example")}
    <div class="grid-2" style="align-items:center;">
      <div>
        <h1 class="hero-title">${esc(firstName(data))}, this is your worked example</h1>
        <p class="hero-subtitle">The Economics of Action</p>
        <p class="hero-copy">${esc(firstName(data))}, now let’s take a look at the numbers in action. We’ve put together this worked example so you can see exactly how the BuySooner model bridges the gap between your current savings and your <strong>${esc(data.targetArea)}</strong> goal. It’s the simplest way to see how we turn years of waiting into years of owning.</p>
      </div>
      <div class="result-box"><p>BuySooner helps turn years of waiting into years of owning.</p></div>
    </div>

    <h2 class="section-title" style="margin-top:24px;">The Situation</h2>
    <div class="grid-4">
      <div class="card" style="text-align:center;"><div style="font-size:50px;">⌂</div><h3>The Goal</h3><p>A ${currency(d.price)} ${esc(data.targetArea)} home.</p><strong style="font:900 34px Georgia;color:var(--teal);">${currency(d.price)}</strong></div>
      <div class="card" style="text-align:center;"><div style="font-size:50px;">$</div><h3>The Gap</h3><p>You have ${currency(d.contribution)} saved, but need 20% to buy safely.</p><strong style="font:900 34px Georgia;color:var(--teal);">${currency(d.targetDeposit)}</strong><span class="small-note">deposit needed</span></div>
      <div class="card" style="text-align:center;"><div style="font-size:50px;">↗</div><h3>The Drift</h3><p>Prices may rise by around ${percent(d.growthRate)} per year.</p><strong style="font:900 34px Georgia;color:var(--teal);">${currency(d.oneYearGrowth)}</strong><span class="small-note">per year</span></div>
      <div class="card" style="text-align:center;"><div style="font-size:50px;">▣</div><h3>The Drain</h3><p>You are paying rent while waiting.</p><strong style="font:900 34px Georgia;color:var(--teal);">${currency(d.rentMonthly)}</strong><span class="small-note">per month</span></div>
    </div>

    <h2 class="section-title" style="margin-top:28px;">The BuySooner Solution</h2>
    <p style="text-align:center;font-size:20px;font-weight:800;">Instead of waiting another 3+ years, ${esc(firstName(data))} uses BuySooner to bridge the gap immediately.</p>
    <div class="grid-5" style="align-items:center;text-align:center;">
      <div class="card"><h3>${esc(firstName(data))}</h3><p>Contributes your savings.</p><strong style="font:900 34px Georgia;color:var(--teal);">${currency(d.contribution)}</strong></div>
      <div style="font-size:36px;color:var(--teal);font-weight:900;">+</div>
      <div class="card"><h3>BuySooner</h3><p>Contributes to complete the deposit.</p><strong style="font:900 34px Georgia;color:var(--purple);">${currency(d.boost)}</strong></div>
      <div style="font-size:36px;color:var(--teal);font-weight:900;">=</div>
      <div class="card"><h3>The Outcome</h3><p>You enter the market immediately, securing the price at ${currency(d.price)}.</p><strong style="font:900 34px Georgia;color:var(--blue);">${currency(d.price)}</strong></div>
    </div>

    <section class="dark-strip" style="margin-top:24px;display:grid;grid-template-columns:90px 1fr 1px .8fr;gap:24px;align-items:center;">
      <div style="font-size:58px;">✓</div>
      <div><p style="font-size:28px;font-weight:900;">You bought <span>sooner.</span><br>You stopped <span>paying rent.</span><br>You started <span>building equity.</span></p></div>
      <div style="width:1px;height:90px;background:rgba(255,255,255,.35);"></div>
      <p style="font-size:24px;font-weight:900;">Years of waiting turned into years of <span>owning.</span></p>
    </section>

    <footer class="footer-note"><span><strong>Worked example only.</strong> This page shows how BuySooner may bridge the entry gap using the Roadmap assumptions.</span><span>Exit economics and repayment are explained on the next page.</span></footer>
  </section>`;
}

function page9(data, d) {
  const totalGains = d.growthCaptured + d.rentDrain + d.capitalCostSaved;
  const net = totalGains - d.exitShare;
  return `
  <section class="report-page">
    ${pageHeader(9, "Three Year Exit")}
    <div class="grid-2" style="align-items:center;">
      <div>
        <h1 class="hero-title"><span>${esc(firstName(data))}</span>, ${d.exitYear} Years Later</h1>
        <p class="hero-subtitle">The Exit</p>
        <p class="hero-copy">After ${d.exitYear} years, property values may have risen and the loan principal may have reduced. The Roadmap models how you could refinance with your bank, repay BuySooner and move towards full ownership.</p>
      </div>
      <div class="card" style="display:grid;place-items:center;text-align:center;min-height:240px;background:var(--teal-soft);"><div style="font-size:64px;">✓</div><strong style="font-size:24px;color:var(--navy);">You refinance, repay BuySooner, and move towards 100% ownership.</strong></div>
    </div>

    <h2 class="section-title" style="margin-top:24px;">The Financial Breakdown</h2>
    <p style="text-align:center;color:var(--teal-dark);font-size:22px;">Was it worth giving up a share of the profits?</p>

    <section class="grid-2">
      <div class="card"><h2>The Gains by acting now</h2><table class="table">
        <tr><td>Property Growth Captured<br><span class="small-note">Your ${shortCurrency(d.price)} home grows to ${shortCurrency(d.exitValue)} instead of chasing it.</span></td><td>${signedCurrency(d.growthCaptured)}</td></tr>
        <tr><td>Rent Redirected<br><span class="small-note">${d.exitYear} years of rent avoided.</span></td><td>${signedCurrency(d.rentDrain)}</td></tr>
        <tr><td>Capital Cost Saved<br><span class="small-note">0% monthly interest paid on the BuySooner contribution.</span></td><td>${signedCurrency(d.capitalCostSaved)}</td></tr>
        <tr><td><strong>Total Gains</strong></td><td><strong>${signedCurrency(totalGains)}</strong></td></tr>
      </table></div>
      <div class="card"><h2>The Cost: BuySooner Exit</h2><table class="table">
        <tr><td>The Participation Share<br><span class="small-note">Paid to BuySooner at exit as the agreed share for bridging the deposit gap.</span></td><td>-${currency(d.exitShare)}</td></tr>
        <tr><td><strong>Total Cost</strong></td><td><strong>-${currency(d.exitShare)}</strong></td></tr>
      </table></div>
    </section>

    <section class="card" style="margin-top:22px;display:grid;grid-template-columns:120px 1fr;gap:24px;align-items:center;background:var(--teal-soft);">
      <div style="font-size:72px;text-align:center;">🏆</div>
      <div><h2>The Bottom Line: <span style="color:var(--teal);">${signedCurrency(net)}</span> Net Position</h2><p>Even after paying BuySooner the agreed share of the uplift, ${esc(firstName(data))} may be <strong>${currency(net)} better off</strong> than if they had stayed on the sidelines renting and saving.</p></div>
    </section>

    <section class="card" style="margin-top:22px;background:var(--gold-soft);">
      <h2>Why this works:</h2>
      <p>You trade a portion of future growth to secure the present asset. By <strong>stopping the rent drain and locking in the price</strong>, the model may favour action over waiting.</p>
    </section>

    <footer class="footer-note"><span><strong>Indicative worked example only.</strong> Final payout depends on product terms, exit value, timing, refinance outcome, sale outcome if applicable and final legal documentation.</span><span>Property growth, rent savings and refinance availability are not guaranteed.</span></footer>
  </section>`;
}

function page10(data) {
  const cautious = scenarioForGrowth(data, 0.04);
  const base = scenarioForGrowth(data, 0.05);
  const strong = scenarioForGrowth(data, 0.07);

  return `
  <section class="report-page">
    ${pageHeader(10, "Full Independence")}
    <div class="grid-2" style="align-items:center;">
      <div>
        <h1 class="hero-title">Your Path to <span>Full Independence</span></h1>
        <p class="hero-subtitle">Moving from the “Bridge” to 100% Ownership.</p>
        <p class="hero-copy">BuySooner is designed to be your head start, not a forever arrangement. Our goal is to see you transition into a standard bank mortgage as soon as the numbers align. When that happens, BuySooner steps out, and you move forward with <strong>100% of the future growth</strong> in your <strong>${esc(data.targetArea)}</strong> home.</p>
      </div>
      <div class="result-box"><p>The exit is not about guessing a date. It is about the strength of your position.</p></div>
    </div>

    <section style="margin-top:24px;">
      <h2 class="section-title">What Drives Your Timeline?</h2>
      <div class="grid-3">
        <div class="card"><h3>Property Growth</h3><p>As your home in ${esc(data.targetArea)} increases in value, your equity grows.</p></div>
        <div class="card"><h3>Mortgage Progress</h3><p>Every repayment you make reduces your balance and strengthens your position.</p></div>
        <div class="card"><h3>The Review</h3><p>Starting from Year 3, we’ll look at the numbers together to see if the bridge has done its job.</p></div>
      </div>
    </section>

    <section class="card" style="margin-top:24px;">
      <h2 style="text-align:center;">Three Scenarios for Your Exit</h2>
      <div class="grid-3">
        ${[
          ["The Cautious Market", "4.0% p.a. growth", cautious.likelyYear, "If the market takes a steadier breath, we simply stay on the bridge a little longer to help ensure your refinance position is secure.", "A slower market may need more time before BuySooner can step out."],
          ["The Roadmap Base Case", "5.0% p.a. growth", base.likelyYear, "Year 3 will be close, but Year 4 likely provides the cleanest pathway to transition to a standard bank loan.", "This is the central Roadmap case used for the personalised illustration."],
          ["The Stronger Market", "7.0% p.a. growth", strong.likelyYear, "A stronger market accelerates your equity, potentially allowing BuySooner to step out as early as Year 3.", "Faster growth may bring the refinance pathway forward."]
        ].map(([title, growth, year, body, note]) => `
          <article class="card" style="text-align:center;">
            <h3>${title}</h3>
            <div class="notice">${growth}</div>
            <div class="result-box" style="margin:16px 0;"><span class="small-note" style="color:white;">Likely refinance</span><strong style="display:block;font:900 42px Georgia;color:white;">Year ${year}</strong></div>
            <p>${body}</p>
            <p class="small-note">${note}</p>
          </article>`).join("")}
      </div>
    </section>

    <section class="dark-strip" style="margin-top:24px;display:grid;grid-template-columns:1fr 280px;gap:24px;align-items:center;">
      <div>
        <h2 style="color:white;">The Bottom Line</h2>
        <p>The faster your equity grows and the more you pay down your mortgage, the sooner you reach full independence. We are here to help you monitor the market so you can make the move at the right time for you.</p>
      </div>
      <div style="border:2px solid rgba(255,255,255,.3);border-radius:24px;padding:20px;text-align:center;"><span>From partnership to</span><strong style="display:block;font:900 34px Georgia;color:white;">100% Independence</strong></div>
    </section>
    <div class="dark-strip" style="margin-top:16px;text-align:center;font-size:28px;font-weight:900;">From partnership to <span>100% independence.</span> That is the goal.</div>

    <footer class="footer-note"><span><strong>Indicative pathway only.</strong> Behind the scenes, the Roadmap tests estimated property value, mortgage balance, BuySooner payout and refinance readiness.</span><span>Final refinance depends on lender approval, valuation, income, debts, expenses and credit assessment.</span></footer>
  </section>`;
}

function page11(data, d) {
  return `
  <section class="report-page">
    ${pageHeader(11, "Customer FAQ")}
    <div class="grid-2" style="align-items:start;">
      <div>
        <h1 class="hero-title">BuySooner —<br><span>Customer FAQ</span></h1>
        <p class="hero-subtitle">Clear answers before you start.</p>
        <p class="hero-copy"><strong>${esc(firstName(data))}</strong>, these questions are tailored to your <strong>${esc(data.targetArea)}</strong> Roadmap and explain the practical points before you move forward.</p>
      </div>
      <div class="card">
        <h2>Our promise</h2>
        <ul>
          <li><strong>$0</strong> monthly repayments to BuySooner.</li>
          <li>No interest or compounding BuySooner balance.</li>
          <li>Clear terms from Day 1.</li>
          <li>BuySooner is paid at exit.</li>
        </ul>
      </div>
    </div>

    <section class="grid-2" style="margin-top:24px;">
      <div class="card"><h2>Money & Costs</h2>
        <div class="notice"><strong>Do I pay BuySooner each month?</strong><br>No. You keep paying your normal mortgage repayments to the bank. In your Roadmap: $0/month to BuySooner.</div>
        <div class="notice" style="margin-top:10px;"><strong>Does BuySooner charge interest?</strong><br>No. There is no interest and no compounding BuySooner balance.</div>
        <div class="notice" style="margin-top:10px;"><strong>How much can BuySooner contribute?</strong><br>Usually around 10% of the purchase price, subject to assessment and approval. For you: ${currency(d.boost)}.</div>
        <div class="notice" style="margin-top:10px;"><strong>How much do I need to contribute?</strong><br>The standard position is 10% from verified savings or other approved sources. For you: ${currency(d.contribution)}.</div>
        <div class="notice" style="margin-top:10px;"><strong>Could BuySooner help me avoid LMI?</strong><br>Potentially, depending on lender approval, valuation, loan structure and mortgage insurer assessment.</div>
        <div class="notice" style="margin-top:10px;"><strong>What costs do I still pay?</strong><br>Normal buyer costs: stamp duty, conveyancing, inspections, lender costs, rates, strata and insurance.</div>
      </div>

      <div class="card"><h2>Exit & Life Changes</h2>
        <div class="notice"><strong>How does BuySooner get paid?</strong><br>At refinance, sale or buyout. BuySooner receives the original bridge plus the agreed exit amount.</div>
        <div class="notice" style="margin-top:10px;"><strong>Who sets the property value?</strong><br>The value is set through the agreed valuation or sale process under the BuySooner terms.</div>
        <div class="notice" style="margin-top:10px;"><strong>What if I am not ready after 3 to 5 years?</strong><br>The pathway is reviewed. BuySooner is designed to be temporary, but Year 3 is a checkpoint, not a hard deadline.</div>
        <div class="notice" style="margin-top:10px;"><strong>Can I buy BuySooner out?</strong><br>Yes. You can buy out BuySooner through refinance, sale or another agreed pathway.</div>
        <div class="notice" style="margin-top:10px;"><strong>What if the property value goes down?</strong><br>The Roadmap is reviewed against the BuySooner terms. Property growth, refinance and exit outcomes are not guaranteed.</div>
        <div class="notice" style="margin-top:10px;"><strong>What does ${esc(data.brokerFirstName)} do?</strong><br>${esc(data.brokerFirstName)} can help review lender options, serviceability, valuation outcomes and refinance readiness.</div>
        <div class="notice" style="margin-top:10px;"><strong>Is this Roadmap an approval?</strong><br>No. It is an indicative illustration only. Final approval depends on BuySooner assessment, lender approval, valuation, legal documents and your circumstances.</div>
      </div>
    </section>

    <section class="dark-strip" style="margin-top:24px;">
      <h2 style="color:white;">${esc(firstName(data))}, you own the home from Day 1.</h2>
      <p>BuySooner helps bridge the gap and is paid out at exit.</p>
    </section>

    <footer class="footer-note"><span><strong>FAQ summary only.</strong> Final rights, obligations, eligibility and exit mechanics are governed by the BuySooner terms and legal documentation.</span><span>This Roadmap is indicative and is not an approval, valuation or financial advice.</span></footer>
  </section>`;
}

function page12(data, d) {
  return `
  <section class="report-page report-page--narrow">
    ${pageHeader(12, "Refinance Roadmap")}
    <h1 class="hero-title">The Refinance Roadmap</h1>
    <div class="accent"></div>
    <p class="hero-subtitle">A launchpad, not a forever arrangement.</p>
    <p class="hero-copy"><strong>${esc(firstName(data))}</strong>, BuySooner bridges the deposit gap today so you can buy sooner and start building your future in <strong>${esc(data.targetArea)}</strong>.</p>
    <p class="hero-copy">Once you have built enough equity, the goal is to refinance into a standard home loan, pay out BuySooner, and continue owning the home on your own.</p>

    <h2 class="section-title" style="margin-top:30px;">The Typical Pathway</h2>
    ${[
      ["1", "The Entry", "BuySooner helps bridge the deposit gap so you can buy today.", `Your Roadmap: you contribute ${currency(d.contribution)}, BuySooner bridges ${currency(d.boost)}`],
      ["2", "The Growth", "You move in and live your life. You pay $0 to BuySooner while you focus on your own mortgage.", `Your Roadmap: standard mortgage starts at approximately ${currency(d.estimatedMortgage)}`],
      ["3", "The Pivot", "As your home value grows and your mortgage reduces, your equity builds.", "Your Roadmap: the first checkpoint begins from Year 3"],
      ["4", "The Exit", "You refinance your loan, buy out BuySooner, and continue owning the home on your own.", `Your Roadmap: target refinance window is Year ${data.refinanceStartYear} to Year ${data.refinanceEndYear}`]
    ].map(([num, title, body, note]) => `
      <div class="card" style="display:grid;grid-template-columns:70px 1fr;gap:18px;align-items:center;margin-bottom:13px;background:var(--teal-soft);">
        <div class="icon-circle" style="width:50px;height:50px;background:var(--teal);color:white;">${num}</div>
        <div><h3>${title}</h3><p>${body}</p><span class="notice">${note}</span></div>
      </div>`).join("")}

    <section class="card" style="margin-top:24px;background:var(--gold-soft);display:grid;grid-template-columns:120px 1fr;gap:22px;align-items:center;">
      <div style="font-size:70px;text-align:center;">◎</div>
      <div><h2>The Goal</h2><p><strong>100% ownership in 3 to 5 years.</strong><br>Timing depends on market growth, your mortgage balance and your refinance position.</p></div>
    </section>

    <section class="card" style="margin-top:22px;">
      <h2>What affects the timing?</h2>
      <div class="grid-3">
        <div class="notice"><strong>Property growth</strong><br>Higher property value can improve your refinance position.</div>
        <div class="notice"><strong>Mortgage balance</strong><br>Each principal repayment can strengthen the pathway.</div>
        <div class="notice"><strong>Lender approval</strong><br>Final refinance depends on valuation, income, expenses, debts and credit assessment.</div>
      </div>
    </section>

    <div class="dark-strip" style="margin-top:24px;text-align:center;font:900 26px Arial;">BuySooner gets you in. Your equity helps us step out.</div>
  </section>`;
}

function page13(data) {
  return `
  <section class="report-page">
    ${pageHeader(13, "Help & Contact")}
    <div class="grid-2" style="align-items:center;">
      <div>
        <h1 class="hero-title">We’re here to <span>help.</span></h1>
        <p class="hero-subtitle">You do not need to work this out alone.</p>
        <p class="hero-copy"><strong>${esc(firstName(data))}</strong>, your Roadmap is designed to make the pathway clear. If you want to talk through the numbers, the BuySooner bridge, the lending pathway or what happens next, support is available from both BuySooner and <strong>${esc(data.brokerFirstName)}</strong>.</p>
      </div>
      <div class="card" style="background:var(--teal-soft);"><h3>Start with the question you have.</h3><p>BuySooner can explain the bridge. Your broker can review the lending pathway.</p></div>
    </div>

    <section class="grid-2" style="margin-top:24px;">
      <div class="card">
        <h2>Speak with BuySooner</h2>
        <p><strong>Our specialists are ready to help with your Roadmap and BuySooner questions.</strong></p>
        <div class="grid-2">
          <div class="notice"><strong>Click to chat</strong><br>Quick Roadmap or product questions.</div>
          <div class="notice"><strong>Book a Roadmap review</strong><br>Walk through your scenario in detail.</div>
          <div class="notice"><strong>Request a callback</strong><br>Ask a specialist to contact you.</div>
          <div class="notice"><strong>Email BuySooner</strong><br>Written questions or document-heavy queries.</div>
        </div>
        <table class="table" style="margin-top:14px;">
          <tr><td>Website</td><td>${esc(data.buySoonerWebsite)}</td></tr>
          <tr><td>Phone</td><td>${esc(data.buySoonerPhone)}</td></tr>
          <tr><td>Email</td><td>${esc(data.buySoonerEmail)}</td></tr>
          <tr><td>Address</td><td>${esc(data.buySoonerAddress)}</td></tr>
        </table>
      </div>
      <div class="card">
        <h2>Speak with ${esc(data.brokerFirstName)}</h2>
        <p><strong>Your broker can help with the lending pathway.</strong></p>
        <table class="table">
          <tr><td>Broker</td><td>${esc(data.brokerName)}</td></tr>
          <tr><td>Firm</td><td>${esc(data.brokerFirm)}</td></tr>
          <tr><td>Phone</td><td>${esc(data.brokerPhone)}</td></tr>
          <tr><td>Email</td><td>${esc(data.brokerEmail)}</td></tr>
          <tr><td>Address</td><td>${esc(data.brokerAddress)}</td></tr>
        </table>
      </div>
    </section>

    <section class="card" style="margin-top:24px;">
      <h2 style="text-align:center;">Who should I contact?</h2>
      <div class="grid-3">
        <div class="notice"><strong>BuySooner</strong><br>How BuySooner works, what your Roadmap means, and what happens after you apply.</div>
        <div class="notice"><strong>${esc(data.brokerFirstName)}</strong><br>Borrowing capacity, lender options, documents needed, serviceability and valuation questions.</div>
        <div class="notice" style="background:var(--gold-soft);"><strong>BuySooner + ${esc(data.brokerFirstName)}</strong><br>Refinance readiness, Year 3 to Year 5 pathway, and how the bridge steps out.</div>
      </div>
    </section>

    <section class="dark-strip" style="margin-top:24px;text-align:center;">
      <p style="font-size:24px;font-weight:900;">Why customers trust us <span>| Australian-based. Licensed. Structured. Governed.</span></p>
    </section>

    <section style="margin-top:24px;">
      <h2 class="section-title">The Simple Version</h2>
      <div class="grid-5">
        <div class="card" style="text-align:center;"><div style="font-size:42px;">⌂</div><p><strong>You own the home.</strong></p></div>
        <div class="card" style="text-align:center;"><div style="font-size:42px;">▥</div><p><strong>Your bank loan stays normal.</strong></p></div>
        <div class="card" style="text-align:center;"><div style="font-size:42px;">$</div><p><strong>You make no monthly payments to BuySooner.</strong></p></div>
        <div class="card" style="text-align:center;"><div style="font-size:42px;">⇄</div><p><strong>BuySooner is repaid at exit.</strong></p></div>
        <div class="card" style="text-align:center;"><div style="font-size:42px;">↗</div><p><strong>You keep building your future.</strong></p></div>
      </div>
    </section>

    <div class="dark-strip" style="margin-top:24px;text-align:center;">BuySooner helps explain the bridge. <span>${esc(data.brokerFirstName)} helps review the lending pathway.</span> Together, we help you understand the next step before you move forward.</div>

    <footer class="footer-note"><span><strong>Contact page summary only.</strong> Final eligibility, approval and transaction terms remain subject to assessment and documentation.</span><span>This Roadmap is indicative and is not financial, legal or tax advice.</span></footer>
  </section>`;
}

function page14(data, d) {
  return `
  <section class="report-page">
    ${pageHeader(14, "Disclosures & Next Steps", 1)}
    <h1 class="hero-title">Assumptions, Disclosures & <span>Next Steps</span></h1>
    <p class="hero-subtitle">Clear boundaries before you move forward.</p>

    <section class="grid-2" style="margin-top:26px;">
      <div class="card">
        <h2>Assumptions used</h2>
        <table class="table">
          <tr><td>Target property price</td><td>${currency(d.price)}</td></tr>
          <tr><td>Target area</td><td>${esc(data.targetArea)}</td></tr>
          <tr><td>Your contribution</td><td>${currency(d.contribution)}</td></tr>
          <tr><td>BuySooner Boost</td><td>${currency(d.boost)}</td></tr>
          <tr><td>Estimated mortgage</td><td>${currency(d.estimatedMortgage)}</td></tr>
          <tr><td>Base growth assumption</td><td>${percent(d.growthRate)} p.a.</td></tr>
          <tr><td>Review window</td><td>Year ${data.refinanceStartYear} to Year ${data.refinanceEndYear}</td></tr>
        </table>
      </div>
      <div class="card">
        <h2>Key conditions</h2>
        <ul>
          <li>BuySooner approval.</li>
          <li>Lender approval.</li>
          <li>Satisfactory valuation.</li>
          <li>Legal documentation.</li>
          <li>Customer verification and affordability assessment.</li>
          <li>Acceptable property, title and transaction structure.</li>
        </ul>
      </div>
    </section>

    <section class="card" style="margin-top:24px;">
      <h2>Important disclosures</h2>
      <p>This Roadmap is an indicative illustration only. It is not an approval, recommendation, valuation, legal advice, tax advice or financial advice.</p>
      <p>Property growth, refinance availability, lender approval, interest rates, valuation outcomes and BuySooner payout amounts are not guaranteed.</p>
      <p>The final transaction, rights, obligations, fees, payout mechanics and exit conditions are governed by the agreed BuySooner terms and legal documentation.</p>
      <p>The figures shown are estimates based on the data provided and the Roadmap assumptions. Actual results may be materially different.</p>
    </section>

    <section class="grid-3" style="margin-top:24px;">
      <div class="card"><h3>Apply now</h3><p>Proceed to the next application step when you are ready.</p><a class="cta" href="#" aria-label="Apply now">Apply now</a></div>
      <div class="card"><h3>Save or review later</h3><p>Keep the Roadmap for review with your broker or adviser.</p><a class="cta secondary" href="#" aria-label="Review later">Review later</a></div>
      <div class="card"><h3>Speak with support</h3><p>Talk to BuySooner or ${esc(data.brokerFirstName)} before you move forward.</p><a class="cta" href="https://${esc(data.buySoonerWebsite)}" target="_blank" rel="noopener">Contact BuySooner</a></div>
    </section>

    <section class="dark-strip" style="margin-top:26px;text-align:center;">
      <h2 style="color:white;">Next step: review, ask questions, then decide.</h2>
      <p>This Roadmap is designed to help you understand the pathway before you move forward.</p>
    </section>
  </section>`;
}

const pages = [
  page1, page2, page3, page4, page5, page6, page7, page8, page9, page10, page11, page12, page13, page14
];

async function render() {
  const data = await loadRoadmapData();
  const d = getDerived(data);
  const root = document.getElementById("roadmapRoot");
  root.innerHTML = pages.map(fn => fn(data, d)).join("");

  document.getElementById("printBtn")?.addEventListener("click", () => window.print());
  document.getElementById("loadDemoBtn")?.addEventListener("click", () => {
    saveDemoData();
    window.location.reload();
  });
  document.getElementById("clearStoredDataBtn")?.addEventListener("click", () => {
    clearStoredRoadmapData();
    window.location.reload();
  });

  console.log("BuySooner Roadmap data source:", data.source || "unknown", data);
}

render().catch(error => {
  console.error(error);
  document.getElementById("roadmapRoot").innerHTML = `
    <section class="report-page">
      <h1 class="hero-title">Roadmap could not load</h1>
      <p class="hero-copy">There was a problem loading the Roadmap data. Check the browser console for details.</p>
    </section>
  `;
});
