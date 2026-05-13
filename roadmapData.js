
export const fallbackDemoData = {
  customerName: "Sarah",
  buyerType: "renter",
  targetArea: "St Leonards",
  propertyStrategy: "St Leonards Entry",
  preparedDate: "13 May 2026",

  targetPurchasePrice: 1000000,
  customerContribution: 100000,
  buySoonerBoost: 100000,
  estimatedMortgage: 800000,
  currentRentMonthly: 3500,

  growthRate: 0.05,
  waitingYears: 3,
  exitYear: 3,
  refinanceStartYear: 3,
  refinanceEndYear: 5,

  mortgageInterestRate: 0.065,
  mortgageTermYears: 30,
  refinanceTargetLvr: 0.80,
  participationDivisor: 5,

  brokerName: "Alex B Broker",
  brokerFirstName: "Alex",
  brokerFirm: "AB Broker and Associated",
  brokerPhone: "0400 000 000",
  brokerEmail: "alex@abbrokerassociated.com.au",
  brokerAddress: "24 Broker Street, Brokervale NSW 2022",

  buySoonerWebsite: "buysooner.com/contact-us",
  buySoonerPhone: "1300 000 000",
  buySoonerEmail: "hello@buysooner.com",
  buySoonerAddress: "Level 1, 100 Example Street, Sydney NSW 2000"
};

const STORAGE_KEYS = [
  "buysoonerRoadmapData",
  "roadmapData",
  "bsRoadmapData"
];

function decodeBase64Json(value) {
  try {
    const normalised = value.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = decodeURIComponent(escape(atob(normalised)));
    return JSON.parse(decoded);
  } catch (error) {
    console.warn("Could not parse roadmap data query parameter.", error);
    return null;
  }
}

function readStoredData() {
  for (const key of STORAGE_KEYS) {
    const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (!raw) continue;
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.warn(`Could not parse ${key}.`, error);
    }
  }
  return null;
}

async function fetchApplicationData(applicationId) {
  // Future integration point.
  // In production, replace ROADMAP_API_BASE with your backend endpoint.
  const apiBase = window.ROADMAP_API_BASE;
  if (!apiBase || !applicationId) return null;

  const response = await fetch(`${apiBase.replace(/\/$/, "")}/roadmap/${encodeURIComponent(applicationId)}`);
  if (!response.ok) throw new Error(`Could not fetch application data: ${response.status}`);
  return response.json();
}

export async function loadRoadmapData() {
  const params = new URLSearchParams(window.location.search);

  const dataParam = params.get("data");
  if (dataParam) {
    const parsed = decodeBase64Json(dataParam);
    if (parsed) return { ...fallbackDemoData, ...parsed, source: "url-data" };
  }

  const applicationId = params.get("applicationId") || params.get("id");
  if (applicationId) {
    try {
      const fetched = await fetchApplicationData(applicationId);
      if (fetched) return { ...fallbackDemoData, ...fetched, source: "api" };
    } catch (error) {
      console.warn("Falling back because application fetch failed.", error);
    }
  }

  const stored = readStoredData();
  if (stored) return { ...fallbackDemoData, ...stored, source: "storage" };

  return { ...fallbackDemoData, source: "fallback-demo" };
}

export function saveDemoData() {
  localStorage.setItem("buysoonerRoadmapData", JSON.stringify(fallbackDemoData));
}

export function clearStoredRoadmapData() {
  for (const key of STORAGE_KEYS) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
}
