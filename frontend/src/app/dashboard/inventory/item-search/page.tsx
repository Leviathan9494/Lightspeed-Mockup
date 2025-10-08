"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Printer, Upload, Tag } from "lucide-react";

interface Product { id: number; name: string; sku: string; price: number; stock: number; category: string; subcategory?: string; }
interface CategoryNode { id: string; name: string; subcategories?: { id: string; name: string }[]; }

export default function InventoryItemSearchPage() {
  const API_BASE = (typeof window !== 'undefined' && (window as any).__API_BASE__) || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<{ total: number; page: number; pageSize: number; returned: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryNode | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<{ id: string; name: string } | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [countLoading, setCountLoading] = useState(false);
  const [totalAll, setTotalAll] = useState<number | null>(null);
  const [totalFiltered, setTotalFiltered] = useState<number | null>(null);

  const fallbackCategories: CategoryNode[] = [
    { id: 'cannabis', name: 'Cannabis', subcategories: [ { id: 'pre-rolled', name: 'Pre-Rolled' }, { id: 'flower', name: 'Flower' }, { id: 'edibles', name: 'Edibles' }, { id: 'concentrates', name: 'Concentrates' } ] },
    { id: 'accessories', name: 'Accessories', subcategories: [ { id: 'pipes', name: 'Pipes' }, { id: 'papers', name: 'Papers' }, { id: 'grinders', name: 'Grinders' } ] },
    { id: 'apparel', name: 'Apparel', subcategories: [ { id: 'shirts', name: 'Shirts' }, { id: 'hats', name: 'Hats' } ] },
  ];

  useEffect(() => { const t = setTimeout(() => setDebouncedQuery(searchQuery), 300); return () => clearTimeout(t); }, [searchQuery]);
  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchInventory(); fetchCounts(); }, [debouncedQuery, selectedCategory?.id, selectedSubcategory?.id, page, pageSize]);
  useEffect(() => { setPage(1); }, [debouncedQuery, selectedCategory?.id, selectedSubcategory?.id]);

  const buildParams = () => { const params = new URLSearchParams(); if (searchQuery.trim()) params.set('search', searchQuery.trim()); if (selectedCategory) params.set('category', selectedCategory.name); if (selectedSubcategory) params.set('subcategory', selectedSubcategory.name); return params; };

  const rows = products.map(p => ({ id: p.id, item: p.name, qty: p.stock, price: p.price, tax: p.stock > 0, category: p.subcategory ? `${p.category} / ${p.subcategory}` : p.category, customSku: p.sku, mfrSku: p.sku, publish: p.stock > 0 ? 'Yes' : 'No' }));

  const fetchInventory = useCallback(async () => { try { setIsLoading(true); setError(''); const params = buildParams(); params.set('page', String(page)); params.set('pageSize', String(pageSize)); const res = await fetch(`${API_BASE}/api/inventory?${params.toString()}`); if (!res.ok) throw new Error('Failed to fetch inventory'); const data = await res.json(); setProducts(data.data || []); setMeta(data.meta || null); } catch (e:any) { setError(e.message || 'Error loading inventory'); } finally { setIsLoading(false); } }, [page, pageSize, debouncedQuery, selectedCategory?.id, selectedSubcategory?.id]);

  const fetchCounts = useCallback(async () => { try { setCountLoading(true); const params = buildParams(); const res = await fetch(`${API_BASE}/api/inventory/count?${params.toString()}`); if (!res.ok) throw new Error('Failed to fetch counts'); const data = await res.json(); setTotalAll(typeof data.total === 'number' ? data.total : null); setTotalFiltered(typeof data.filtered === 'number' ? data.filtered : null); } catch { } finally { setCountLoading(false); } }, [debouncedQuery, selectedCategory?.id, selectedSubcategory?.id]);

  const fetchCategories = useCallback(async () => { try { setCategoriesLoading(true); setCategoriesError(''); const res = await fetch(`${API_BASE}/api/categories`); if (!res.ok) throw new Error('Failed'); const data = await res.json(); setCategories(Array.isArray(data.data) ? data.data : fallbackCategories); } catch { setCategories(fallbackCategories); setCategoriesError('Using fallback categories'); } finally { setCategoriesLoading(false); } }, []);

  const handleSelectCategory = (cat: CategoryNode) => { setSelectedCategory(cat); setSelectedSubcategory(null); };
  const handleSelectSubcategory = (sub: { id: string; name: string }) => setSelectedSubcategory(sub);
  const clearCategory = () => { setSelectedCategory(null); setSelectedSubcategory(null); };
  const categoryPathLabel = selectedCategory ? (selectedSubcategory ? `${selectedCategory.name} / ${selectedSubcategory.name}` : selectedCategory.name) : 'All Categories';

  const pageRangeStart = meta ? (meta.page - 1) * meta.pageSize + 1 : 1;
  const pageRangeEnd = meta ? pageRangeStart + meta.returned - 1 : rows.length;
  const total = meta?.total ?? rows.length;
  const effectivePageSize = meta?.pageSize ?? pageSize;
  const maxPage = Math.max(1, Math.ceil(total / effectivePageSize));
  const compactInputClass = "h-8 px-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white";
  const compactSelectClass = compactInputClass + " pr-6";
  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => (p < maxPage ? p + 1 : p));

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-600 flex items-center gap-1" aria-label="Breadcrumb">
        <Link href="/dashboard/inventory" className="hover:underline">Inventory</Link>
        <span className="text-gray-400">›</span>
        <span className="font-medium text-gray-800">Items</span>
      </nav>
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full grid md:grid-cols-2 gap-6 p-6 relative">
            <button onClick={() => setCategoryModalOpen(false)} className="absolute top-2 right-2 text-sm text-gray-500 hover:text-gray-700" aria-label="Close category selector">✕</button>
            <div className="space-y-3 overflow-y-auto max-h-[60vh]">
              <h3 className="font-semibold text-sm tracking-wide">Categories</h3>
              {categoriesLoading && <div className="text-xs text-gray-500">Loading categories...</div>}
              {categoriesError && <div className="text-xs text-amber-600">{categoriesError}</div>}
              <ul className="space-y-1 text-sm">
                {categories.map(cat => (
                  <li key={cat.id} className="flex items-center justify-between gap-2 border rounded-md px-3 py-2">
                    <span>{cat.name}</span>
                    <Button size="sm" variant={selectedCategory?.id === cat.id ? 'default' : 'secondary'} onClick={() => handleSelectCategory(cat)}>Select</Button>
                  </li>
                ))}
                {!categoriesLoading && categories.length === 0 && <li className="text-xs text-gray-500 px-2">No categories available</li>}
              </ul>
            </div>
            <div className="space-y-3 overflow-y-auto max-h-[60vh]">
              <h3 className="font-semibold text-sm tracking-wide">Subcategories</h3>
              {selectedCategory ? (
                <ul className="space-y-1 text-sm">
                  {selectedCategory.subcategories && selectedCategory.subcategories.length > 0 ? (
                    selectedCategory.subcategories.map(sub => (
                      <li key={sub.id} className="flex items-center justify-between gap-2 border rounded-md px-3 py-2">
                        <span>{sub.name}</span>
                        <Button size="sm" variant={selectedSubcategory?.id === sub.id ? 'default' : 'secondary'} onClick={() => handleSelectSubcategory(sub)}>Select</Button>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-gray-500 px-2">No subcategories</li>
                  )}
                </ul>
              ) : (
                <div className="text-xs text-gray-500">Select a category to view subcategories</div>
              )}
            </div>
            <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); }}>Clear</Button>
              <Button onClick={() => setCategoryModalOpen(false)}>Done</Button>
            </div>
          </div>
        </div>
      )}

      {/* Top filters */}
      <div className="border border-gray-300 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2 p-2 border-b border-gray-200 text-xs">
          <div className="flex flex-wrap items-center gap-2 min-w-[60%]">
            <input className={compactInputClass + " w-56"} placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            <input className={compactInputClass + " w-40"} placeholder="Tag(s)" />
            <input className={compactInputClass + " w-44"} placeholder="Exclude Tag(s)" />
            <Button className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs" onClick={() => { setPage(1); fetchInventory(); }}>Search</Button>
            <button className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1" type="button"><span>▾</span> Advanced</button>
          </div>
          <div className="ml-auto">
            <Button className="h-8 bg-green-600 hover:bg-green-700 text-white text-xs flex items-center gap-1"><Plus className="h-3 w-3" /> New Item</Button>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2 p-2 text-xs">
          {/* Left checklist column */}
          <div className="col-span-2 space-y-1 pt-1">
            <div className="flex items-center gap-2"><input type="checkbox" className="h-3 w-3" /> <span>Show All Locations</span></div>
            <div className="flex items-center gap-2"><input type="checkbox" className="h-3 w-3" /> <span>Items w/ Inventory</span></div>
            <div className="flex items-center gap-2"><input type="checkbox" className="h-3 w-3" /> <span>Items w/o Inventory</span></div>
            <div className="flex items-center gap-2"><input type="checkbox" className="h-3 w-3" /> <span>Published to eCom</span></div>
            <div className="flex items-center gap-2"><input type="checkbox" className="h-3 w-3" /> <span>Archived</span></div>
          </div>
          {/* Middle Category + Tax Class column */}
          <div className="col-span-2 pt-1 border-l pl-4 space-y-4">
            <div>
              <label className="block mb-0.5">Category</label>
              <button type="button" onClick={() => setCategoryModalOpen(true)} className="text-blue-600 text-sm hover:underline">{categoryPathLabel}</button>
              {(selectedCategory || selectedSubcategory) && <button className="ml-2 text-[11px] text-gray-500 hover:underline" onClick={clearCategory}>reset</button>}
            </div>
            <div>
              <label className="block mb-0.5">Tax Class</label>
              <select className={compactSelectClass} defaultValue="all"><option value="all">All Tax Classes</option></select>
            </div>
          </div>
          {/* Right group of selects tightened */}
          <div className="col-span-8 grid grid-cols-6 gap-3 items-start">
            <div>
              <label className="block mb-0.5">Brand</label>
              <select className={compactSelectClass} defaultValue="all"><option value="all">All Brands</option></select>
            </div>
            <div>
              <label className="block mb-0.5">Vendor</label>
              <select className={compactSelectClass} defaultValue="all"><option value="all">All Vendors</option></select>
            </div>
            <div>
              <label className="block mb-0.5">Shop</label>
              <select className={compactSelectClass} defaultValue="warehouse"><option value="warehouse">Warehouse</option></select>
            </div>
            <div>
              <label className="block mb-0.5">Item Type</label>
              <select className={compactSelectClass} defaultValue="all"><option value="all">All Item Types</option></select>
            </div>
            <div>
              <label className="block mb-0.5">Serialized</label>
              <select className={compactSelectClass} defaultValue="include"><option value="include">Include Serialized</option></select>
            </div>
            <div>
              <label className="block mb-0.5">Matrix</label>
              <select className={compactSelectClass} defaultValue="all"><option value="all">All Matrices</option></select>
            </div>
          </div>
        </div>
      </div>

      {/* Result summary bar */}
      <div className="flex items-center gap-3 text-xs bg-white border border-gray-300 shadow-sm px-3 py-2">
        <span className="font-medium">{totalFiltered ?? totalAll ?? total} Local Items Found</span>
        <span className="text-gray-400">|</span>
        <span className="text-gray-500">NuORDER Catalog Matches</span>
        <span className="text-gray-400">(0)</span>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" className="h-7 px-3 text-[11px] flex items-center gap-1"><Printer className="h-3 w-3" /> Print</Button>
          <Button variant="outline" className="h-7 px-3 text-[11px] flex items-center gap-1"><Upload className="h-3 w-3" /> Export</Button>
        </div>
      </div>

      {/* Pagination / per-page bar directly above table */}
      <div className="flex flex-wrap items-center gap-4 text-[11px] bg-white border border-t-0 border-gray-300 shadow-sm px-3 py-1.5">
        <div className="flex items-stretch rounded-sm overflow-hidden border border-gray-300 h-7">
          <button onClick={handlePrev} disabled={page === 1 || isLoading} className="px-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">◀</button>
          <span className="px-3 flex items-center bg-blue-600 text-white font-medium tracking-wide">{pageRangeStart}-{pageRangeEnd}</span>
          <button onClick={handleNext} disabled={page >= maxPage || isLoading} className="px-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">▶</button>
          {maxPage > 2 && <span className="px-2 flex items-center text-gray-500">…</span>}
          {total > effectivePageSize && (
            <span className="px-3 flex items-center bg-gray-50 border-l border-gray-300">{Math.max(1, (Math.floor((total - 1) / effectivePageSize) * effectivePageSize) + 1)}-{total}</span>
          )}
        </div>
        <div className="flex items-center gap-1 h-7 pl-2 pr-1 border border-gray-300 rounded-sm bg-gray-50">
          <label className="text-gray-600">PER PAGE</label>
          <select className="bg-transparent h-full outline-none" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
            {[25,50,100].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="text-gray-500">Page {page} of {maxPage}</div>
        <div className="text-gray-500">{countLoading ? 'Counting…' : (totalFiltered !== null && totalAll !== null ? `${totalFiltered}/${totalAll}` : '')}</div>
      </div>

      <div className="border border-gray-300 bg-white overflow-x-auto">
        <Table className="text-sm">
          <TableHeader>
            <TableRow className="bg-gray-50 text-[11px] uppercase tracking-wide">
              <TableHead className="w-[20rem]">Item</TableHead>
              <TableHead className="w-12">Qty.</TableHead>
              <TableHead className="w-20">Price</TableHead>
              <TableHead className="w-10">Tax</TableHead>
              <TableHead className="w-56">Category</TableHead>
              <TableHead className="w-40">Custom SKU</TableHead>
              <TableHead className="w-40">MFR SKU</TableHead>
              <TableHead className="w-28">Publish</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={8} className="text-center py-6 text-xs text-gray-500">Loading…</TableCell></TableRow>}
            {!isLoading && error && <TableRow><TableCell colSpan={8} className="text-center py-6 text-xs text-red-600">{error}</TableCell></TableRow>}
            {!isLoading && rows.length === 0 && !error && <TableRow><TableCell colSpan={8} className="text-center py-8 text-xs text-gray-500">No items match your search/filters.</TableCell></TableRow>}
            {!isLoading && rows.map(r => (
              <TableRow key={r.id} className="hover:bg-blue-50/40">
                <TableCell className="font-medium text-blue-600 underline-offset-2 hover:underline flex items-center gap-1">
                  <Tag className="h-3 w-3 text-gray-400" />
                  <Link href={`/dashboard/inventory/item/${r.id}`}>{r.item}</Link>
                </TableCell>
                <TableCell className="tabular-nums text-center">{r.qty}</TableCell>
                <TableCell className="tabular-nums">
                  <span className="inline-block px-2 py-0.5 border border-gray-300 rounded-sm bg-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4)]">${r.price.toFixed(2)}</span>
                </TableCell>
                <TableCell className="text-center">{r.tax && <input type="checkbox" checked readOnly className="h-3 w-3" />}</TableCell>
                <TableCell>{r.category}</TableCell>
                <TableCell className="font-mono text-xs">{r.customSku}</TableCell>
                <TableCell className="font-mono text-xs">{r.mfrSku}</TableCell>
                <TableCell>{r.publish}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Bottom pagination bar removed (now above table) */}
    </div>
  );
}
