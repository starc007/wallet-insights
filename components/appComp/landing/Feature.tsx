"use client";
import React from "react";
import { motion } from "framer-motion";
import { BrainIcon, Wallet01Icon, ChartIcon } from "hugeicons-react";

const features = [
  {
    title: "AI Analysis",
    description:
      "Get intelligent insights about wallet activity, trading patterns, and portfolio composition powered by advanced AI.",
    icon: <BrainIcon size={24} />,
  },
  {
    title: "Multi-Wallet Tracking",
    description:
      "Track and monitor multiple wallets in one place. Keep an eye on portfolios, NFTs, and transactions across different addresses.",
    icon: <Wallet01Icon size={24} />,
  },
  {
    title: "Portfolio Analytics",
    description:
      "Comprehensive portfolio analysis with real-time token prices, NFT valuations, and historical performance tracking.",
    icon: <ChartIcon size={24} />,
  },
];

const Feature = () => {
  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-4"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Powerful Features
          </h2>
          <p className="text-gray-500">
            Everything you need to track and analyze wallets intelligently
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-4">
                <span className="text-primary">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Feature;
