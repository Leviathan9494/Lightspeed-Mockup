"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InventoryRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new dashboard inventory page
    router.replace('/dashboard/inventory');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>Redirecting to dashboard...</div>
    </div>
  );
}