import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ShishaBrandDropdownProps {
  brand: string;
  items: any[];
  isOpen: boolean;
  onToggle: () => void;
}

export default function ShishaBrandDropdown({ 
  brand, 
  items, 
  isOpen, 
  onToggle 
}: ShishaBrandDropdownProps) {
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

  return (
    <div className="mb-6 w-[95vw] sm:w-[22rem] md:w-[25rem]">
      <button
        className={`w-full text-left px-4 py-3 rounded-lg border-2 ${isOpen ? 'border-accent' : 'border-gray-600'} text-xl font-semibold text-accent flex justify-between items-center focus:outline-none transition-all duration-200 hover:border-leaf`}
        style={{ fontFamily: 'CardFont, sans-serif' }}
        onClick={onToggle}
      >
        {brand} 
        <span className="ml-2 transition-transform duration-200">
          {isOpen ? (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </span>
      </button>
      
      {isOpen && (
        <ul className="mt-2 space-y-2 w-full">
          {items.map(item => (
            <li 
              key={item.id} 
              className={`relative w-[90%] mx-auto rounded-lg border-2 border-gray-600 overflow-hidden ${!item.isActive ? 'opacity-50 grayscale pointer-events-none' : ''}`}
              style={{
                backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '120px'
              }}
            >
              {/* Upload button - positioned in top right */}
              <div className="absolute top-2 right-2 z-20">
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
              </div>

              {/* Price - positioned at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <div className="text-right">
                  <span className="text-leaf font-roboto text-lg font-semibold">${item.price.toFixed(2)}</span>
                </div>
              </div>

              {/* Fallback content if no image */}
              {!item.imageUrl && (
                <div className="flex items-center justify-center h-32 bg-gradient-to-b from-[#233524] via-[#1a241b] to-[#2d4a3e]">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📦</div>
                    <div className="text-accent font-roboto text-sm">{item.name}</div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
