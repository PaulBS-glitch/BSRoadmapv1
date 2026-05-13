# BuySooner Customer Roadmap Prototype

Standalone GitHub Pages-ready prototype for the personalised BuySooner Customer Roadmap.

## Files

- `index.html` — app shell
- `styles.css` — shared report styling
- `roadmapData.js` — fallback demo data and data-loading layer
- `calculations.js` — shared calculation engine
- `roadmapPages.js` — all report pages rendered in order

## Pages included

1. Personalised Path / Scenario Snapshot
2. The Cost of Waiting
3. A Practical Way Forward
4. What Changes When You Stop Waiting
5. Can BuySooner Be the Solution?
6. Your Path to 100% Ownership
7. How the Numbers Work
8. Worked Example
9. Three Years Later: The Exit
10. Path to Full Independence
11. Customer FAQ
12. Refinance Roadmap
13. Help & Contact
14. Assumptions, Disclosures & Next Steps

## Data model

All personalisation comes from a central `roadmapData` object. Pages should not hard-code customer-specific values.

The app loads data in this order:

1. `?data=<base64url encoded JSON>` in the URL
2. `?applicationId=<id>` via a future API endpoint if `window.ROADMAP_API_BASE` is configured
3. `localStorage.buysoonerRoadmapData`
4. `sessionStorage.buysoonerRoadmapData`
5. fallback demo data for Sarah / St Leonards

## Prototype handoff from the existing app

In the existing customer/broker prototype, after the customer completes the apply step, save the captured data and open the roadmap:

```js
const roadmapData = {
  customerName: "Sarah",
  buyerType: "renter",
  targetArea: "St Leonards",
  propertyStrategy: "St Leonards Entry",
  targetPurchasePrice: 1000000,
  customerContribution: 100000,
  buySoonerBoost: 100000,
  estimatedMortgage: 800000,
  currentRentMonthly: 3500,
  brokerName: "Alex B Broker",
  brokerFirstName: "Alex",
  brokerFirm: "AB Broker and Associated",
  brokerPhone: "0400 000 000",
  brokerEmail: "alex@abbrokerassociated.com.au",
  brokerAddress: "24 Broker Street, Brokervale NSW 2022"
};

localStorage.setItem("buysoonerRoadmapData", JSON.stringify(roadmapData));
window.location.href = "https://YOUR-GITHUB-USERNAME.github.io/YOUR-ROADMAP-REPO/";
```

This works for a prototype when both projects are hosted on the same GitHub Pages origin, for example:

- `https://paulbs-glitch.github.io/BuyS-prototype-clean/`
- `https://paulbs-glitch.github.io/BuySooner-roadmap/`

## Future production integration

For production, replace local storage with a backend:

1. Prototype saves the customer scenario to a database.
2. Backend returns an `applicationId`.
3. Prototype opens the roadmap with `?applicationId=<id>`.
4. Roadmap fetches the customer scenario from the backend.

The roadmap code is already structured so this can be added by updating only the data-loading layer in `roadmapData.js`.

## Running locally

Because the app uses ES modules, run it from a local server rather than opening `index.html` directly.

Example:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Printing / PDF

Use the **Print / Save PDF** button in the toolbar, or your browser's print function.
