import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Management</CardTitle>
        <CardDescription>
          Manage customer information, loyalty programs, and customer history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">Customer management functionality will be implemented here.</p>
      </CardContent>
    </Card>
  );
}