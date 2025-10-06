"use client";

import React, { useState, useEffect } from 'react';
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
  const [activeTab, setActiveTab] = useState('item-search');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/inventory');
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
      } else {
        setError(data.message || 'Failed to load inventory');
      }
    } catch {
      setError('Connection error. Please ensure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (stock < 50) return { label: 'Low Stock', variant: 'secondary' as const };
    return { label: 'In Stock', variant: 'default' as const };
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>

            {error ? (
              <div className="text-red-500 text-center py-4">{error}</div>
            ) : (
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
                    {filteredProducts.map((product) => {
                      const stockStatus = getStockStatus(product.stock);
                      return (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                          <TableCell>{product.category}</TableCell>
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