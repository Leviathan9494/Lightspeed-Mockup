"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Plus, 
  Upload, 
  Printer, 
  Grid3X3, 
  Hash,
  Package,
  BarChart3,
  Filter
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  subcategory?: string;
}

interface CategoryNode {
  id: string;
  name: string;
  subcategories?: { id: string; name: string }[];
}

interface InventoryTab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}

const inventoryTabs: InventoryTab[] = [
  { id: 'item-search', label: 'Item Search', icon: Search, description: 'Search and filter inventory items' },
  { id: 'new-item', label: 'New Item', icon: Plus, description: 'Add new products to inventory' },
  { id: 'import-item', label: 'Import Item', icon: Upload, description: 'Bulk import items from file' },
  { id: 'print-labels', label: 'Print Labels', icon: Printer, description: 'Generate product labels' },
  { id: 'matrix', label: 'Matrix', icon: Grid3X3, description: 'Matrix view of products' },
  { id: 'serial-number', label: 'Serial Number', icon: Hash, description: 'Manage serial numbers' },
];

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<{ total: number; page: number; pageSize: number; returned: number } | null>(null);
  const [activeTab, setActiveTab] = useState('item-search');
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
  const [totalAll, setTotalAll] = useState<number | null>(null); // dataset total
  const [totalFiltered, setTotalFiltered] = useState<number | null>(null); // filtered total

  // Fallback static categories in case backend categories endpoint is unreachable
  const fallbackCategories: CategoryNode[] = [
    { id: 'cannabis', name: 'Cannabis', subcategories: [
      { id: 'pre-rolled', name: 'Pre-Rolled' },
      { id: 'flower', name: 'Flower' },
      { id: 'edibles', name: 'Edibles' },
      { id: 'concentrates', name: 'Concentrates' },
    ] },
    { id: 'accessories', name: 'Accessories', subcategories: [
      { id: 'pipes', name: 'Pipes' },
      { id: 'papers', name: 'Papers' },
      { id: 'grinders', name: 'Grinders' },
    ] },
    { id: 'apparel', name: 'Apparel', subcategories: [
      { id: 'shirts', name: 'Shirts' },
      { id: 'hats', name: 'Hats' },
    ] },
  ];

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchInventory();
    fetchCounts();
  }, [debouncedQuery, selectedCategory?.id, selectedSubcategory?.id, page, pageSize]);

  // Reset to first page when filters/search change (but not when only page changes)
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, selectedCategory?.id, selectedSubcategory?.id]);

  const buildParams = () => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('search', debouncedQuery);
    if (selectedCategory) params.set('category', selectedCategory.name); // backend expects full name
    if (selectedSubcategory) params.set('subcategory', selectedSubcategory.name);
    return params;
  };

  const fetchInventory = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = buildParams();
      params.set('page', String(page));
      params.set('pageSize', String(pageSize));
      const response = await fetch(`http://localhost:3001/api/inventory?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
        setMeta(data.meta || null);
        setError('');
      } else {
        setError(data.message || 'Failed to load inventory');
      }
    } catch {
      setError('Connection error. Please ensure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery, selectedCategory, selectedSubcategory, page, pageSize]);

  const fetchCounts = useCallback(async () => {
    try {
      setCountLoading(true);
      const params = buildParams();
      const res = await fetch(`http://localhost:3001/api/inventory/count?${params.toString()}`);
      if (!res.ok) throw new Error('bad status');
      const data = await res.json();
      if (data.success) {
        setTotalAll(data.total);
        setTotalFiltered(data.filtered);
      }
    } catch (e) {
      console.warn('[inventory] count fetch failed', e);
    } finally {
      setCountLoading(false);
    }
  }, [debouncedQuery, selectedCategory, selectedSubcategory]);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    setCategoriesError('');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const res = await fetch('http://localhost:3001/api/categories', { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error('Bad status');
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length) {
        setCategories(data.data);
      } else {
        setCategories(fallbackCategories);
        setCategoriesError('Using fallback categories');
      }
    } catch (err) {
      setCategories(fallbackCategories);
      setCategoriesError('Could not load live categories. Showing fallback list.');
      console.warn('[CategoryPicker] Falling back to static categories', err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (stock < 50) return { label: 'Low Stock', variant: 'secondary' as const };
    return { label: 'In Stock', variant: 'default' as const };
  };

  // Server now handles filtering; we keep products as-is (optional client fallback could be reintroduced if needed)

  const categoryPathLabel = selectedCategory
    ? selectedSubcategory
      ? `${selectedCategory.name}/${selectedSubcategory.name}`
      : selectedCategory.name
    : '+All';

  const clearCategory = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const handleSelectCategory = (cat: CategoryNode) => {
    setSelectedCategory(cat);
    setSelectedSubcategory(null);
  };

  const handleSelectSubcategory = (sub: { id: string; name: string }) => {
    setSelectedSubcategory(sub);
    setCategoryModalOpen(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'item-search':
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, SKU, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2" onClick={() => setCategoryModalOpen(true)}>
                  <Filter className="h-4 w-4" />
                  <span>{categoryPathLabel}</span>
                </Button>
                {(selectedCategory || selectedSubcategory) && (
                  <Button variant="ghost" onClick={clearCategory}>Reset</Button>
                )}
              </div>
            </div>

            {error ? (
              <div className="text-red-500 text-center py-4">{error}</div>
            ) : (
              <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => {
                      const stockStatus = getStockStatus(product.stock);
                      return (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                          <TableCell>{product.category}{product.subcategory ? `/${product.subcategory}` : ''}</TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <Badge variant={stockStatus.variant}>
                              {stockStatus.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm">View</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4">
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    {countLoading ? 'Counting items…' : (
                      totalAll !== null && totalFiltered !== null ? (
                        selectedCategory || selectedSubcategory || debouncedQuery ? `Filtered: ${totalFiltered} / ${totalAll} items` : `Total: ${totalAll} items`
                      ) : ' '
                    )}
                  </div>
                  {meta && (
                    <div className="text-xs text-gray-500">Page {meta.page} · Showing {meta.returned} of {meta.total} filtered</div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <div className="flex items-center gap-2 text-sm">
                    <label htmlFor="pageSize" className="text-gray-500">Rows:</label>
                    <select
                      id="pageSize"
                      className="border rounded px-2 py-1 text-sm"
                      value={pageSize}
                      onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1 || isLoading}
                    >Prev</Button>
                    <span className="text-xs text-gray-500 w-16 text-center">{page}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (meta) {
                          const maxPage = Math.ceil(meta.total / meta.pageSize);
                          if (page < maxPage) setPage(p => p + 1);
                        } else {
                          setPage(p => p + 1); // fallback
                        }
                      }}
                      disabled={isLoading || (meta ? page >= Math.ceil(meta.total / meta.pageSize) : false)}
                    >Next</Button>
                  </div>
                </div>
              </div>
              </>
            )}
          </div>
        );

      case 'new-item':
        return (
          <div className="max-w-2xl">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input id="product-name" placeholder="Enter product name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" placeholder="Enter SKU" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" type="number" step="0.01" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input id="stock" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" placeholder="Enter category" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea 
                  id="description"
                  className="w-full p-3 border border-gray-300 rounded-md resize-none"
                  rows={4}
                  placeholder="Enter product description..."
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Add Product
                </Button>
                <Button type="button" variant="outline">
                  Save as Draft
                </Button>
              </div>
            </form>
          </div>
        );

      case 'import-item':
        return (
          <div className="max-w-2xl space-y-6">
            <div className="text-center border-2 border-dashed border-gray-300 rounded-lg p-8">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Upload CSV File</h3>
              <p className="mt-2 text-gray-500">
                Drag and drop your CSV file here, or click to select
              </p>
              <Button className="mt-4">Choose File</Button>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900">CSV Format Requirements:</h4>
              <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
                <li>Columns: Name, SKU, Price, Stock, Category</li>
                <li>Header row required</li>
                <li>UTF-8 encoding</li>
                <li>Maximum 1000 items per upload</li>
              </ul>
            </div>
          </div>
        );

      case 'print-labels':
        return (
          <div className="max-w-2xl space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Label Type</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <h3 className="font-medium">Price Labels</h3>
                    <p className="text-sm text-gray-500">Standard price tags</p>
                  </div>
                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <h3 className="font-medium">Barcode Labels</h3>
                    <p className="text-sm text-gray-500">With barcode and price</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="product-select">Select Products</Label>
                <Input 
                  id="product-select"
                  placeholder="Search products to print labels..."
                />
              </div>
              
              <div className="flex gap-4">
                <Button className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  Print Labels
                </Button>
                <Button variant="outline">Preview</Button>
              </div>
            </div>
          </div>
        );

      case 'matrix':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.slice(0, 8).map((product) => (
                <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="font-medium text-sm truncate">{product.name}</h3>
                    <p className="text-xs text-gray-500">{product.sku}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-sm">${product.price}</span>
                      <Badge variant={getStockStatus(product.stock).variant} className="text-xs">
                        {product.stock}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'serial-number':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Serial Number Management</h3>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Serial Number
              </Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Product A</TableCell>
                    <TableCell className="font-mono">SN001234567</TableCell>
                    <TableCell>
                      <Badge variant="default">Available</Badge>
                    </TableCell>
                    <TableCell>2025-10-01</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        );

      default:
        return <div>Select a tab to view content</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full grid md:grid-cols-2 gap-6 p-6 relative">
            <button
              onClick={() => setCategoryModalOpen(false)}
              className="absolute top-2 right-2 text-sm text-gray-500 hover:text-gray-700"
              aria-label="Close category selector"
            >✕</button>
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
                {!categoriesLoading && categories.length === 0 && (
                  <li className="text-xs text-gray-500 px-2">No categories available</li>
                )}
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
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {inventoryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors
                  ${isActive
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(inventoryTabs.find(tab => tab.id === activeTab)?.icon || Package, { className: "h-5 w-5" })}
            {inventoryTabs.find(tab => tab.id === activeTab)?.label}
          </CardTitle>
          <CardDescription>
            {inventoryTabs.find(tab => tab.id === activeTab)?.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderTabContent()}
        </CardContent>
      </Card>
    </div>
  );
}