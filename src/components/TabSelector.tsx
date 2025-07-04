interface Tab {
  key: string;
  label: string;
}

interface TabSelectorProps {
  tabs: Tab[];
  selectedTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabSelector({ tabs, selectedTab, onTabChange }: TabSelectorProps) {
  return (
    <div className="flex justify-center space-x-4 mb-8">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 border-2 focus:outline-none focus:ring-2 focus:ring-purple-400 ${selectedTab === tab.key ? 'bg-purple-700 text-white border-purple-700 shadow' : 'bg-gray-800 text-purple-200 border-purple-900 hover:bg-purple-900'}`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
} 