import React, { useState } from "react";
import { Button } from "@/components/UI";
import { useDataContext } from "@/context/DataContext";
import {
  BrainIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  InformationCircleIcon,
} from "hugeicons-react";
import { Shimmer } from "@/components/UI/Shimmer";
import { getAllTransactions } from "@/apiRoutes/api";
import toast from "react-hot-toast";

interface AnalysisProps {
  address: string;
}

interface Section {
  title: string;
  content: string;
}

const Analysis = ({ address }: AnalysisProps) => {
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const { nftData, tokensInfo, tokensPrices } = useDataContext();

  const parseAnalysis = (text: string) => {
    const sections = text.split(/\d+\.\s/).filter(Boolean);
    const titles = [
      "Summary",
      "Portfolio Analysis",
      "Trading Patterns",
      "Risk Assessment",
      "Recommendations",
    ];

    return sections.map((content, i) => ({
      title: titles[i],
      content: content.trim(),
    }));
  };

  const analyzeWallet = async () => {
    setLoading(true);
    try {
      // Fetch transactions
      const transactions = await getAllTransactions(address);

      // Calculate total portfolio value
      const portfolio = tokensInfo.reduce((acc, token) => {
        const price = tokensPrices[token.address]?.price || 0;
        const value = (token.amount / 10 ** token.decimals) * price;
        return acc + value;
      }, 0);

      // Get analysis from Gemini
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactions: transactions.slice(0, 2),
          tokens: tokensInfo.slice(0, 2),
          portfolio,
          nfts: nftData.items.slice(0, 2),
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setSections(parseAnalysis(data.analysis));
    } catch (error: any) {
      console.error("Analysis error:", error);
      if (error.message?.includes("429")) {
        toast.error("API rate limit reached. Please try again later.");
      } else {
        toast.error("Failed to analyze wallet. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-medium text-primary/50">AI Analysis</h2>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
            <InformationCircleIcon size={14} />
            <p>
              Analysis is based on limited data (2 transactions, tokens, and
              NFTs) due to API constraints
            </p>
          </div>
        </div>
        <Button
          variant="special"
          onClick={analyzeWallet}
          disabled={loading}
          lefticon={<BrainIcon size={20} />}
        >
          {loading ? "Analyzing..." : "Analyze Wallet"}
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-3/4" />
          <Shimmer className="h-4 w-5/6" />
        </div>
      ) : sections.length > 0 ? (
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={section.title}
              className="border border-gray-100 rounded-lg overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedSection(expandedSection === index ? null : index)
                }
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <h3 className="font-medium text-lg">{section.title}</h3>
                {expandedSection === index ? (
                  <ArrowUp01Icon size={20} />
                ) : (
                  <ArrowDown01Icon size={20} />
                )}
              </button>
              {expandedSection === index && (
                <div className="p-4 pt-0 prose max-w-none">
                  <p className="whitespace-pre-wrap">{section.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Analysis;
