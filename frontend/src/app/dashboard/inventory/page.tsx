"use client";

import Link from 'next/link';
import { Search, Plus, Upload, Printer, Grid3X3, Hash, Package, Truck, ArrowRight, Star, Repeat, RefreshCw } from 'lucide-react';

const tiles = [
  { href: '/dashboard/inventory/item-search', label: 'Item Search', icon: Search, shortcut: 'ALT+3' },
  { href: '/dashboard/inventory/new-item', label: 'New Item', icon: Plus, shortcut: 'ALT+4' },
  { href: '/dashboard/inventory/import', label: 'Import Items', icon: Upload, shortcut: 'ALT+9' },
  { href: '/dashboard/inventory/print-labels', label: 'Print Labels', icon: Printer, shortcut: 'ALT+9' },
  { href: '/dashboard/inventory/matrix', label: 'Matrix', icon: Grid3X3, shortcut: 'ALT+M' },
  { href: '/dashboard/inventory/serial-numbers', label: 'Serial Numbers', icon: Hash, shortcut: 'ALT+S' },
];

const orderTiles = [
  { href: '/dashboard/inventory/master-order', label: 'Master Order', icon: Package, shortcut: 'ALT+O' },
  { href: '/dashboard/inventory/purchase-orders', label: 'Purchase Orders', icon: Truck, shortcut: 'ALT+7' },
  { href: '/dashboard/inventory/new-order', label: 'New Order', icon: Plus, shortcut: 'ALT+N' },
  { href: '/dashboard/inventory/vendor-return', label: 'Vendor Return', icon: ArrowRight, shortcut: 'ALT+R' },
  { href: '/dashboard/inventory/special-orders', label: 'Special Orders', icon: Star, shortcut: 'ALT+8' },
  { href: '/dashboard/inventory/shipping', label: 'Shipping', icon: Truck, shortcut: 'ALT+G' },
  { href: '/dashboard/inventory/transfers', label: 'Transfers', icon: RefreshCw, shortcut: 'ALT+T' },
];

export default function InventoryLandingPage() {
  return (
    <div className="p-6 space-y-10">
      <section>
        <h2 className="text-xs font-semibold tracking-wide text-gray-600 mb-3">ITEMS & INVENTORY</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {tiles.map(t => {
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                className="group relative border rounded-md bg-white shadow-sm hover:shadow transition flex flex-col items-center justify-center p-6 text-center gap-3"
              >
                <Icon className="h-8 w-8 text-gray-700 group-hover:text-blue-600 transition" />
                <div className="text-sm font-medium text-gray-800">{t.label}</div>
                <div className="absolute top-1 right-1 text-[10px] text-gray-400">{t.shortcut}</div>
              </Link>
            );
          })}
        </div>
      </section>
      <section>
        <h2 className="text-xs font-semibold tracking-wide text-gray-600 mb-3">ORDERS, TRANSFERS, AND SHIPPING</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
          {orderTiles.map(t => {
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                className="group relative border rounded-md bg-white shadow-sm hover:shadow transition flex flex-col items-center justify-center p-6 text-center gap-3"
              >
                <Icon className="h-8 w-8 text-gray-700 group-hover:text-blue-600 transition" />
                <div className="text-sm font-medium text-gray-800">{t.label}</div>
                <div className="absolute top-1 right-1 text-[10px] text-gray-400">{t.shortcut}</div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}