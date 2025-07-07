import { useState } from 'react';

interface CategoryDropdownProps {
  category: { key: string; label: string };
  items: any[];
  openCategories: string[];
  setOpenCategories: (categories: string[]) => void;
  openSubCategories: string[];
  setOpenSubCategories: (subCategories: string[]) => void;
  subCategoryField?: string; // e.g., 'brand' for shisha, 'type' for drinks
  itemNameField?: string; // e.g., 'name' for items
}

export default function CategoryDropdown({ 
  category, 
  items, 
  openCategories, 
  setOpenCategories, 
  openSubCategories, 
  setOpenSubCategories,
  subCategoryField = 'brand',
  itemNameField = 'name'
}: CategoryDropdownProps) {
  const subCategoriesWithItems = Array.from(
    new Set(
      items
        .filter(item => item.type === category.key && typeof item[subCategoryField] === 'string' && item[subCategoryField].trim() !== '')
        .map(item => item[subCategoryField] as string)
    )
  );

  return (
    <div className="mb-6">
      <button
        className={`w-full text-left px-4 py-3 rounded-lg border-2 ${openCategories.includes(category.key) ? 'border-accent' : 'border-forest'} bg-gradient-to-b from-[#233524] via-[#1a241b] to-[#2d4a3e] text-xl font-semibold text-accent flex justify-between items-center mb-2 focus:outline-none transition-all duration-200 hover:border-leaf`}
        onClick={() => setOpenCategories(openCategories.includes(category.key)
          ? openCategories.filter(t => t !== category.key)
          : [...openCategories, category.key])}
      >
        {category.label} <span>{openCategories.includes(category.key) ? '▲' : '▼'}</span>
      </button>
      
      {openCategories.includes(category.key) && (
        <div className="pl-2 mt-2">
          {subCategoriesWithItems.length === 0 && (
            <div className="text-leaf text-sm pl-4">No items available.</div>
          )}
          {subCategoriesWithItems.map(subCategory => {
            const categoryItems = items.filter(item => item.type === category.key && item[subCategoryField] === subCategory);
            if (!subCategory) return null;
            return (
              <div key={subCategory} className="mb-4">
                <button
                  className={`w-full text-left px-4 py-2 rounded-lg border-2 ${openSubCategories.includes(subCategory) ? 'border-accent' : 'border-forest'} bg-gradient-to-b from-[#233524] via-[#1a241b] to-[#2d4a3e] text-base font-medium text-accent flex justify-between items-center focus:outline-none transition-all duration-200 hover:border-leaf`}
                  onClick={() => setOpenSubCategories(openSubCategories.includes(subCategory)
                    ? openSubCategories.filter((b: string) => b !== subCategory)
                    : [...openSubCategories, subCategory])}
                >
                  {subCategory} <span>{openSubCategories.includes(subCategory) ? '▲' : '▼'}</span>
                </button>
                {openSubCategories.includes(subCategory) && (
                  <ul className="pl-4 mt-2 space-y-2">
                    {categoryItems.map(item => (
                      <li key={item.id} className={`p-3 rounded-lg flex justify-between items-center border-2 border-forest bg-gradient-to-b from-[#233524] via-[#1a241b] to-[#2d4a3e] ${!item.isActive ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                        <span className="text-accent font-normal">{item[itemNameField]}</span>
                        <span className="text-leaf font-semibold">${item.price.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 