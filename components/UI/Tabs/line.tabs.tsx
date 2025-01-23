import React, { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface TabItemProps {
  title: string;
  isActive: boolean;
  setActiveTab: () => void;
}

const TabItem = ({ title, isActive, setActiveTab }: TabItemProps) => {
  return (
    <button
      className={clsx(
        "px-4 py-2 text-sm font-medium transition-all relative",
        isActive ? "text-primary" : "text-zinc-500 hover:text-gray-800"
      )}
      onClick={setActiveTab}
    >
      {title}
      {isActive && (
        <motion.div
          layoutId="line-tab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </button>
  );
};

const LineTabs = ({
  tabList,
  onTabChange,
}: {
  tabList: {
    title: string;
    content: React.ReactNode;
  }[];
  onTabChange?: (index: number) => void;
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    onTabChange?.(index);
  };

  return (
    <div className="flex flex-col">
      <div className="flex border-b border-gray-200">
        {tabList.map((tab, index) => (
          <TabItem
            key={index}
            title={tab.title}
            isActive={activeTab === index}
            setActiveTab={() => handleTabChange(index)}
          />
        ))}
      </div>
      <div className="mt-4">{tabList[activeTab].content}</div>
    </div>
  );
};

export default LineTabs;
