"use client";

import { useEffect, useState } from 'react';

const TABS = [
  { key: 'drink', label: 'Drinks' },
  { key: 'shisha', label: 'Shisha' },
];

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
}

export default function AdminPage() {
  const [selectedTab, setSelectedTab] = useState('drink');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'drink', isActive: true });
  const [submitting, setSubmitting] = useState(false);
  const [venueId, setVenueId] = useState<string | null>(null);

  // Fetch items for the selected tab
  useEffect(() => {
    setLoading(true);
    fetch(`/api/menu-items?category=${selectedTab}`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      });
  }, [selectedTab]);

  // Fetch venueId on mount
  useEffect(() => {
    fetch('/api/venues')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setVenueId(data[0].id);
      });
  }, []);

  // Handle form input
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Add new item
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!venueId) return;
    setSubmitting(true);
    await fetch('/api/menu-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        category: selectedTab,
        isActive: true,
        venueId,
      }),
    });
    setForm({ name: '', description: '', price: '', category: selectedTab, isActive: true });
    setSubmitting(false);
    // Refresh list
    setLoading(true);
    fetch(`/api/menu-items?category=${selectedTab}`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      });
  }

  // Delete item
  async function handleDelete(id: string) {
    await fetch(`/api/menu-items/${id}`, { method: 'DELETE' });
    setItems(items.filter(item => item.id !== id));
  }

  // Toggle availability
  async function handleToggleActive(id: string, isActive: boolean) {
    await fetch(`/api/menu-items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    });
    setItems(items.map(item => item.id === id ? { ...item, isActive: !isActive } : item));
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
        {venueId && (
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
          <button
            type="submit"
            className="bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-purple-800"
            disabled={submitting}
          >
            {submitting ? 'Adding...' : `Add ${selectedTab === 'drink' ? 'Drink' : 'Shisha'}`}
          </button>
        </form>
        )}
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
                  <div className="text-xl font-bold text-purple-100 group-hover:text-purple-300 transition-colors duration-200">{item.name} <span className="text-sm text-purple-400">${item.price.toFixed(2)}</span></div>
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