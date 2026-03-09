export type PropertyStatus = "Lead / Prospect" | "Under Analysis" | "Offer Submitted" | "Under Contract" | "Incoming Asset" | "Secured Asset" | "Active" | "Renovation" | "Incoming" | "On Market" | "Sold";

export interface PropertyEvent {
    id: string;
    date: string;
    type: "note" | "call" | "email" | "meeting" | "status_change" | "task";
    title: string;
    content: string;
}

export interface Property {
    id: string;
    name: string;
    address: string;
    status: PropertyStatus;
    type: string;
    image: string;
    units?: number;
    lat?: number;
    lng?: number;
    financials: {
        purchasePrice: number;
        currentValue: number;
        renovationCost: number;
        debt: number;
        monthlyRent: number;
        monthlyExpenses: number;
        monthlyDebtService: number; // Total P+I payment
        principalPayment: number; // Amount of principal paid per month
        // Advanced Debt Parameters
        debtType?: string; // e.g., "Fixed", "Variable", "Interest Only"
        interestRate?: number; // e.g., 5.5 (%)
        loanDurationMonths?: number; // e.g., 360 (30 years)
        fixedTermRemainingMonths?: number; // e.g., 60 (for 5/1 ARM or balloon)
        reserviceDate?: string; // Date when the loan needs to be refinanced/reserviced
    };
    acquisitionDate?: string;
    events?: PropertyEvent[];
    isDemo?: boolean;
    bedrooms?: number;
    bathrooms?: number;
    yearBuilt?: number;
    lotSize?: string;
    description?: string;
}

export const MOCK_PROPERTIES: Property[] = [
    {
        id: "prop-1",
        isDemo: true,
        name: "The Highland Complex",
        address: "142 Highland Ave, Seattle, WA",
        status: "Active",
        type: "Multi-family",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
        lat: 47.6062,
        lng: -122.3321,
        financials: {
            purchasePrice: 1200000,
            currentValue: 1450000,
            renovationCost: 85000,
            debt: 800000,
            monthlyRent: 12500,
            monthlyExpenses: 4200,
            monthlyDebtService: 3800,
            principalPayment: 1200,
        },
        acquisitionDate: "2023-01-15",
        events: [
            { id: "ev-1", date: "2024-03-01T10:00:00Z", type: "note", title: "Quarterly Review", content: "Met with manager. Occupancy remains at 100%. Next painting scheduled for summer." },
            { id: "ev-2", date: "2024-01-15T15:30:00Z", type: "call", title: "Plumbing Issue", content: "Resolved leaking faucet in unit 4. Bill paid: $250." }
        ]
    },
    {
        id: "prop-2",
        isDemo: true,
        name: "Ocean View Residences",
        address: "550 Ocean Blvd, Santa Monica, CA",
        status: "Active",
        type: "Condo",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
        lat: 34.0195,
        lng: -118.4912,
        financials: {
            purchasePrice: 850000,
            currentValue: 1250000,
            renovationCost: 45000,
            debt: 600000,
            monthlyRent: 5800,
            monthlyExpenses: 1800,
            monthlyDebtService: 2200,
            principalPayment: 850,
        },
        acquisitionDate: "2021-03-15",
    },
    {
        id: "prop-3",
        isDemo: true,
        name: "Summit View Estates",
        address: "782 Summit Drive, Aspen, CO",
        status: "Active",
        type: "Single-family",
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80",
        lat: 39.1911,
        lng: -106.8175,
        financials: {
            purchasePrice: 2100000,
            currentValue: 2850000,
            renovationCost: 150000,
            debt: 1400000,
            monthlyRent: 12000,
            monthlyExpenses: 4500,
            monthlyDebtService: 6500,
            principalPayment: 1800,
        },
        acquisitionDate: "2020-08-22",
    },
    {
        id: "prop-4",
        isDemo: true,
        name: "Midtown Commerce Center",
        address: "1122 Broadway, New York, NY",
        status: "Active",
        type: "Commercial",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
        lat: 40.7128,
        lng: -74.0060,
        financials: {
            purchasePrice: 4500000,
            currentValue: 6200000,
            renovationCost: 300000,
            debt: 3200000,
            monthlyRent: 45000,
            monthlyExpenses: 12000,
            monthlyDebtService: 15000,
            principalPayment: 4200,
        },
        acquisitionDate: "2019-11-10",
    },
    {
        id: "prop-5",
        isDemo: true,
        name: "Maple Street Fourplex",
        address: "34 Maple St, Portland, OR",
        status: "Renovation",
        type: "Multi-family",
        image: "https://images.unsplash.com/photo-1600585154340-be6099aae359?w=800&q=80",
        lat: 45.5152,
        lng: -122.6784,
        financials: {
            purchasePrice: 650000,
            currentValue: 820000,
            renovationCost: 85000,
            debt: 480000,
            monthlyRent: 0,
            monthlyExpenses: 1200,
            monthlyDebtService: 2800,
            principalPayment: 950,
        },
        acquisitionDate: "2023-01-05",
    },
    {
        id: "prop-6",
        isDemo: true,
        name: "The Waterfront Lofts",
        address: "20 Waterfront Way, Miami, FL",
        status: "Under Analysis",
        type: "Condo",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
        lat: 25.7617,
        lng: -80.1918,
        financials: {
            purchasePrice: 0,
            currentValue: 550000,
            renovationCost: 0,
            debt: 0,
            monthlyRent: 3200,
            monthlyExpenses: 800,
            monthlyDebtService: 0,
            principalPayment: 0,
        },
    },
    {
        id: "prop-7",
        isDemo: true,
        name: "Pinecrest Duplex",
        address: "95 Pinecrest Rd, Austin, TX",
        status: "Under Analysis",
        type: "Duplex",
        image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
        lat: 30.2672,
        lng: -97.7431,
        financials: {
            purchasePrice: 0,
            currentValue: 420000,
            renovationCost: 0,
            debt: 0,
            monthlyRent: 2800,
            monthlyExpenses: 600,
            monthlyDebtService: 0,
            principalPayment: 0,
        },
    },
    {
        id: "prop-8",
        isDemo: true,
        name: "Garden Terrace Units",
        address: "700 Garden Lane, Phoenix, AZ",
        status: "Lead / Prospect",
        type: "Multi-unit",
        image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
        lat: 33.4484,
        lng: -112.0740,
        financials: {
            purchasePrice: 3200000,
            currentValue: 3200000,
            renovationCost: 0,
            debt: 2200000,
            monthlyRent: 28000,
            monthlyExpenses: 9500,
            monthlyDebtService: 11000,
            principalPayment: 3200,
        },
    },
];

export function getPortfolioStats(properties: Property[]) {
    let totalValue = 0;
    let totalDebt = 0;
    let monthlyIncome = 0;
    let monthlyExpenses = 0;

    let projectedTotalValue = 0;
    let projectedTotalDebt = 0;
    let projectedMonthlyIncome = 0;
    let projectedMonthlyExpenses = 0;

    for (const prop of properties) {
        // Exclude properties that are just in the pipeline/not actually owned yet, or already sold
        const excludedStatuses = ["Lead / Prospect", "Under Analysis", "Offer Submitted", "On Market", "Sold"];

        // Projected includes everything except Sold and On Market (if it's on market to be sold, maybe maintain it or exclude. Let's include everything that could enter or is in portfolio)
        const excludedFromProjected = ["Sold"];

        if (!excludedStatuses.includes(prop.status)) {
            totalValue += Number(prop.financials?.currentValue) || Number(prop.financials?.purchasePrice) || 0;
            totalDebt += Number(prop.financials?.debt) || 0;
            monthlyIncome += Number(prop.financials?.monthlyRent) || 0;
            monthlyExpenses += Number(prop.financials?.monthlyExpenses) || 0;
        }

        if (!excludedFromProjected.includes(prop.status)) {
            projectedTotalValue += Number(prop.financials?.currentValue) || Number(prop.financials?.purchasePrice) || 0;
            projectedTotalDebt += Number(prop.financials?.debt) || 0;
            projectedMonthlyIncome += Number(prop.financials?.monthlyRent) || 0;
            projectedMonthlyExpenses += Number(prop.financials?.monthlyExpenses) || 0;
        }
    }

    const equity = totalValue - totalDebt;
    const monthlyCashflow = monthlyIncome - monthlyExpenses - (properties.reduce((acc, p) => acc + (Number(p.financials?.monthlyDebtService) || 0), 0));

    const projectedEquity = projectedTotalValue - projectedTotalDebt;
    const projectedMonthlyCashflow = projectedMonthlyIncome - projectedMonthlyExpenses - (properties.reduce((acc, p) => acc + (Number(p.financials?.monthlyDebtService) || 0), 0));

    return {
        totalValue,
        totalDebt,
        equity,
        monthlyIncome,
        monthlyExpenses,
        monthlyCashflow,
        totalMonthlyDebtService: properties.reduce((acc, p) => acc + (Number(p.financials?.monthlyDebtService) || 0), 0),
        totalMonthlyPrincipal: properties.reduce((acc, p) => acc + (Number(p.financials?.principalPayment) || 0), 0),
        projectedTotalValue,
        projectedTotalDebt,
        projectedEquity,
        projectedMonthlyCashflow,
    };
}
