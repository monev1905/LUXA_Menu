// ADMIN PANEL - DISABLED FOR NOW
// Will be implemented in the next months

"use client";

import PageHeader from "@/components/PageHeader";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-jungle flex flex-col">
      <PageHeader title="Admin Panel" />
      <main className="max-w-2xl mx-auto p-6 bg-jungle-light rounded-2xl shadow-xl">
        <div className="text-center py-20">
          <div className="mb-8">
            <div className="mt-8">
              <a
                href="/menu"
                className="bg-accent text-jungle-dark px-6 py-3 rounded-lg font-semibold hover:bg-leaf transition-colors"
              >
                Back to Menu
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
