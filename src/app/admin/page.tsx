"use client";

import { useEffect, useState } from 'react';

const TABS = [
  { key: 'drink', label: 'Drinks' },
  { key: 'shisha', label: 'Shisha' },
];

const DRINK_SECTIONS = [
  { key: 'lemonades', label: 'Lemonades & Iced Tea' },
  { key: 'alcohol', label: 'Alcohol' },
  { key: 'smoothies', label: 'Smoothies & Milkshakes' },
  { key: 'softdrinks', label: 'Soft Drinks' },
  { key: 'nuts', label: 'Nuts' },
  { key: 'hotdrinks', label: 'Hot Drinks' },
];

const SHISHA_BRANDS = [
  { key: 'musthave', label: 'Must Have' },
  { key: 'darkside', label: 'Darkside' },
  { key: 'blackburn', label: 'Blackburn' },
  { key: 'deus', label: 'Deus' },
];

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
  section?: string;
  brand?: string;
  type?: string;
}

export default function AdminPage() {
  const [selectedTab, setSelectedTab] = useState('drink');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'drink', isActive: true, section: '', brand: '', type: '' });
  const [submitting, setSubmitting] = useState(false);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState<string>('');
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const [editingBrandValue, setEditingBrandValue] = useState<string>('');
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null);
  const [editingTypeValue, setEditingTypeValue] = useState<string>('');

  // Fetch items for the selected tab
  useEffect(() => {
    setLoading(true);
    const endpoint = selectedTab === 'drink' ? '/api/drinks' : '/api/shisha-flavors';
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      });
  }, [selectedTab]);

  // Handle form input
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Add new item
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const endpoint = selectedTab === 'drink' ? '/api/drinks' : '/api/shisha-flavors';
    const payload = selectedTab === 'drink'
      ? {
          ...form,
          price: parseFloat(form.price),
          section: form.section,
          category: 'drink',
          isActive: true,
        }
      : {
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          brand: form.brand,
          type: form.type,
          isActive: true,
        };
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setForm({ name: '', description: '', price: '', category: selectedTab, isActive: true, section: '', brand: '', type: '' });
    setSubmitting(false);
    // Refresh list
    setLoading(true);
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      });
  }

  // Delete item
  async function handleDelete(id: string) {
    const endpoint = selectedTab === 'drink' ? '/api/drinks' : '/api/shisha-flavors';
    await fetch(endpoint, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setItems(items.filter(item => item.id !== id));
  }

  // Toggle availability
  async function handleToggleActive(id: string, isActive: boolean) {
    const endpoint = selectedTab === 'drink' ? '/api/drinks' : '/api/shisha-flavors';
    await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isActive: !isActive }),
    });
    setItems(items.map(item => item.id === id ? { ...item, isActive: !isActive } : item));
  }

  // Save price change
  async function handleSavePrice(id: string) {
    const endpoint = selectedTab === 'drink' ? '/api/drinks' : '/api/shisha-flavors';
    await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, price: parseFloat(editingPriceValue) }),
    });
    setItems(items.map(item => item.id === id ? { ...item, price: parseFloat(editingPriceValue) } : item));
    setEditingPriceId(null);
    setEditingPriceValue('');
  }

  // Save brand change
  async function handleSaveBrand(id: string) {
    const endpoint = selectedTab === 'drink' ? '/api/drinks' : '/api/shisha-flavors';
    await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, brand: editingBrandValue }),
    });
    setItems(items.map(item => item.id === id ? { ...item, brand: editingBrandValue } : item));
    setEditingBrandId(null);
    setEditingBrandValue('');
  }

  // Save type change
  async function handleSaveType(id: string) {
    const endpoint = selectedTab === 'drink' ? '/api/drinks' : '/api/shisha-flavors';
    await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type: editingTypeValue }),
    });
    setItems(items.map(item => item.id === id ? { ...item, type: editingTypeValue } : item));
    setEditingTypeId(null);
    setEditingTypeValue('');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <header className="bg-gray-950 shadow-md py-6 mb-8">
        <h1 className="text-4xl font-extrabold text-center text-purple-300 tracking-tight">Admin Menu Management</h1>
      </header>
      <main className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-2xl shadow-xl">
        <div className="flex justify-center space-x-4 mb-8">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 border-2 focus:outline-none focus:ring-2 focus:ring-purple-400 ${selectedTab === tab.key ? 'bg-purple-700 text-white border-purple-700 shadow' : 'bg-gray-800 text-purple-200 border-purple-900 hover:bg-purple-900'}`}
              onClick={() => setSelectedTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="mb-8 space-y-2 bg-gray-800 p-4 rounded">
          <div>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="border border-gray-700 bg-gray-900 text-white p-2 rounded w-full placeholder-gray-400"
              required
            />
          </div>
          <div>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="border border-gray-700 bg-gray-900 text-white p-2 rounded w-full placeholder-gray-400"
            />
          </div>
          <div>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              type="number"
              step="0.01"
              className="border border-gray-700 bg-gray-900 text-white p-2 rounded w-full placeholder-gray-400"
              required
            />
          </div>
          {selectedTab === 'drink' && (
            <div>
              <select
                name="section"
                value={form.section}
                onChange={handleChange}
                className="border border-gray-700 bg-gray-900 text-white p-2 rounded w-full"
                required
              >
                <option value="" disabled>Select section</option>
                {DRINK_SECTIONS.map(sec => (
                  <option key={sec.key} value={sec.key}>{sec.label}</option>
                ))}
              </select>
            </div>
          )}
          {selectedTab === 'shisha' && (
            <div>
              <input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Brand"
                className="border border-gray-700 bg-gray-900 text-white p-2 rounded w-full placeholder-gray-400"
                required
              />
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="border border-gray-700 bg-gray-900 text-white p-2 rounded w-full mt-2"
                required
              >
                <option value="" disabled>Select type</option>
                <option value="blond">Blond</option>
                <option value="black">Black</option>
              </select>
            </div>
          )}
          <button
            type="submit"
            className="bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-purple-800"
            disabled={submitting}
          >
            {submitting ? 'Adding...' : `Add ${selectedTab === 'drink' ? 'Drink' : 'Shisha'}`}
          </button>
        </form>
        <h2 className="text-2xl font-semibold mb-4 text-purple-200">{selectedTab === 'drink' ? 'Drinks' : 'Shisha'} List</h2>
        {loading ? (
          <div className="text-center text-gray-400 py-10">Loading...</div>
        ) : (
          <ul className="space-y-6">
            {items.map(item => (
              <li
                key={item.id}
                className={`p-6 bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-900 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 group flex justify-between items-center ${!item.isActive ? 'opacity-50 grayscale' : ''}`}
              >
                <div>
                  <div className="text-xl font-bold text-purple-100 group-hover:text-purple-300 transition-colors duration-200 flex items-center gap-2">
                    {item.name}
                    <span className="text-sm text-purple-400">
                      {editingPriceId === item.id ? (
                        <>
                          <input
                            type="number"
                            step="0.01"
                            value={editingPriceValue}
                            onChange={e => setEditingPriceValue(e.target.value)}
                            className="w-20 px-2 py-1 rounded bg-gray-800 border border-purple-400 text-white text-sm"
                          />
                          <button
                            className="ml-2 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                            onClick={() => handleSavePrice(item.id)}
                            type="button"
                          >Save</button>
                          <button
                            className="ml-1 px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                            onClick={() => { setEditingPriceId(null); setEditingPriceValue(''); }}
                            type="button"
                          >Cancel</button>
                        </>
                      ) : (
                        <>
                          ${item.price.toFixed(2)}
                          <button
                            className="ml-2 px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700"
                            onClick={() => { setEditingPriceId(item.id); setEditingPriceValue(item.price.toString()); }}
                            type="button"
                          >Edit</button>
                        </>
                      )}
                    </span>
                  </div>
                  {item.section && (
                    <div className="text-xs text-purple-400 mb-1">Section: {DRINK_SECTIONS.find(sec => sec.key === item.section)?.label || item.section}</div>
                  )}
                  {item.brand && (
                    <div className="text-xs text-purple-400 mb-1 flex items-center gap-2">
                      Brand: {editingBrandId === item.id ? (
                        <>
                          <input
                            type="text"
                            value={editingBrandValue}
                            onChange={e => setEditingBrandValue(e.target.value)}
                            className="border border-purple-400 bg-gray-800 text-white p-1 rounded text-xs"
                            placeholder="Brand"
                          />
                          <button
                            className="ml-2 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                            onClick={() => handleSaveBrand(item.id)}
                            type="button"
                          >Save</button>
                          <button
                            className="ml-1 px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                            onClick={() => { setEditingBrandId(null); setEditingBrandValue(''); }}
                            type="button"
                          >Cancel</button>
                        </>
                      ) : (
                        <>
                          {item.brand}
                          {selectedTab === 'shisha' && (
                            <button
                              className="ml-2 px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700"
                              onClick={() => { setEditingBrandId(item.id); setEditingBrandValue(item.brand || ''); }}
                              type="button"
                            >Edit</button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                  {item.type && (
                    <div className="text-xs text-purple-400 mb-1 flex items-center gap-2">
                      Type: {editingTypeId === item.id ? (
                        <>
                          <select
                            value={editingTypeValue}
                            onChange={e => setEditingTypeValue(e.target.value)}
                            className="border border-purple-400 bg-gray-800 text-white p-1 rounded text-xs"
                          >
                            <option value="blond">Blond</option>
                            <option value="black">Black</option>
                          </select>
                          <button
                            className="ml-2 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                            onClick={() => handleSaveType(item.id)}
                            type="button"
                          >Save</button>
                          <button
                            className="ml-1 px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                            onClick={() => { setEditingTypeId(null); setEditingTypeValue(''); }}
                            type="button"
                          >Cancel</button>
                        </>
                      ) : (
                        <>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                          {selectedTab === 'shisha' && (
                            <button
                              className="ml-2 px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700"
                              onClick={() => { setEditingTypeId(item.id); setEditingTypeValue(item.type || ''); }}
                              type="button"
                            >Edit</button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                  {item.description && (
                    <div className="text-gray-400 text-sm">{item.description}</div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <label className="flex items-center cursor-pointer select-none">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={!!item.isActive}
                        onChange={() => handleToggleActive(item.id, item.isActive)}
                        className="sr-only"
                      />
                      <div className={`block w-12 h-7 rounded-full transition-colors duration-200 ${item.isActive ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-200 ${item.isActive ? 'translate-x-5' : ''}`}></div>
                    </div>
                    <span className={`ml-3 text-sm font-medium ${item.isActive ? 'text-green-400' : 'text-gray-400'}`}>{item.isActive ? 'Available' : 'Unavailable'}</span>
                  </label>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="ml-0 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    disabled={!item.isActive}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
} 