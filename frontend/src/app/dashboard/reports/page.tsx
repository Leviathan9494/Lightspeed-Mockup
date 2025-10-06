import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports & Analytics</CardTitle>
        <CardDescription>
          Sales reports, inventory analytics, and business insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">Reporting functionality will be implemented here.</p>
      </CardContent>
    </Card>
  );
}