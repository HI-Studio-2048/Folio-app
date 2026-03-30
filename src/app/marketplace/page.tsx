import { Metadata } from 'next';
import MarketplaceClient from './MarketplaceClient';

export const metadata: Metadata = {
  title: "Follio Marketplace | Discover & Trade Premium Portfolios",
  description: "Join the Follio Marketplace to connect with verified global investors. Discover, evaluate, and acquire high-performing portfolios across real estate, tech, and beyond.",
  keywords: ["portfolio marketplace", "buy portfolios", "sell asset portfolio", "investment discovery", "Follio network", "acquire assets"],
  openGraph: {
    title: "Follio Marketplace | Discover & Trade Premium Portfolios",
    description: "Join the Follio Marketplace to connect with verified global investors. Discover, evaluate, and acquire high-performing portfolios.",
    url: "https://follio.app/marketplace",
    type: "website",
  },
};

export default function MarketplacePage() {
  return <MarketplaceClient />;
}
