import React from 'react';

interface Product {
  id: number; name: string; sku: string; price: number; stock: number; category: string; subcategory?: string;
}

async function fetchItem(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001'}/api/inventory/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}

// Next.js 15 dynamic route params must be awaited.
export default async function ItemDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const product = await fetchItem(id);
  if (!product) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Item Not Found</h1>
        <p className="text-sm text-gray-500">No product exists with ID {id}.</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="text-xs text-gray-600 flex items-center gap-1">
        <a href="/dashboard/inventory" className="hover:underline">Inventory</a>
        <span>›</span>
        <a href="/dashboard/inventory/item-search" className="hover:underline">Items</a>
        <span>›</span>
        <span className="font-medium text-gray-800">{product.name}</span>
      </div>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b pb-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
          <p className="text-sm text-gray-500">SKU: <span className="font-mono">{product.sku}</span></p>
        </div>
        <div className="flex gap-3 text-sm">
          <div className="px-3 py-1 rounded border bg-white shadow-sm">Stock: <span className="font-semibold">{product.stock}</span></div>
          <div className="px-3 py-1 rounded border bg-white shadow-sm">Price: ${product.price.toFixed(2)}</div>
          <div className="px-3 py-1 rounded border bg-white shadow-sm">Category: {product.category}{product.subcategory ? ` / ${product.subcategory}` : ''}</div>
        </div>
      </header>
      <section className="grid md:grid-cols-3 gap-6 text-sm">
        <div className="space-y-2">
          <h2 className="font-medium text-gray-700">Overview</h2>
          <ul className="space-y-1">
            <li><span className="text-gray-500">Product ID:</span> {product.id}</li>
            <li><span className="text-gray-500">SKU:</span> {product.sku}</li>
            <li><span className="text-gray-500">Category:</span> {product.category}</li>
            {product.subcategory && <li><span className="text-gray-500">Subcategory:</span> {product.subcategory}</li>}
            <li><span className="text-gray-500">Price:</span> ${product.price.toFixed(2)}</li>
            <li><span className="text-gray-500">Current Stock:</span> {product.stock}</li>
          </ul>
        </div>
        <div className="space-y-2">
          <h2 className="font-medium text-gray-700">Inventory Actions</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Adjust stock (coming soon)</li>
            <li>Print barcode label</li>
            <li>Archive / Publish toggle</li>
          </ul>
        </div>
        <div className="space-y-2">
          <h2 className="font-medium text-gray-700">Sales Insights</h2>
          <p className="text-gray-500">Analytics & movement data placeholder.</p>
        </div>
      </section>
    </div>
  );
}
