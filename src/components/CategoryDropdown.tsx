import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface CategoryDropdownProps {
  category: { key: string; label: string };
  items: any[];
  openCategories: string[];
  setOpenCategories: (categories: string[]) => void;
  openSubCategories: string[];
  setOpenSubCategories: (subCategories: string[]) => void;
  subCategoryField?: string;
  itemNameField?: string;
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
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File, itemId: string) => {
    try {
      setUploading(true);
      
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${itemId}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('shisha-flavors')
        .upload(`brands/${fileName}`, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('shisha-flavors')
        .getPublicUrl(`brands/${fileName}`);

      // Update database with image URL
      const response = await fetch(`/api/shisha-flavors/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: publicUrl })
      });

      if (!response.ok) throw new Error('Failed to update image URL');

    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

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
                        <div className="flex items-center space-x-3">
                          {item.imageUrl ? (
                            <img 
                              src={item.imageUrl} 
                              alt={item[itemNameField]}
                              className="w-12 h-12 object-cover rounded-lg border border-accent/30"
                              onError={(e) => {
                                e.currentTarget.src = '/images/default-tobacco-box.png';
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-forest rounded-lg border border-accent/30 flex items-center justify-center">
                              <span className="text-accent text-xs">📦</span>
                            </div>
                          )}
                          <span className="text-accent font-normal">{item[itemNameField]}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) uploadImage(file, item.id);
                            }}
                            className="hidden"
                            id={`upload-${item.id}`}
                            disabled={uploading}
                          />
                          <label 
                            htmlFor={`upload-${item.id}`}
                            className="text-xs text-leaf cursor-pointer hover:text-accent transition-colors"
                          >
                            📸
                          </label>
                          <span className="text-leaf font-semibold">${item.price.toFixed(2)}</span>
                        </div>
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