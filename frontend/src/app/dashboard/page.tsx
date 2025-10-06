import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,439.00</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">
              +5 new this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium">New Sale</h3>
                <p className="text-sm text-gray-500">Start a transaction</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium">Add Item</h3>
                <p className="text-sm text-gray-500">Add to inventory</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium">View Reports</h3>
                <p className="text-sm text-gray-500">Sales analytics</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium">Customer Lookup</h3>
                <p className="text-sm text-gray-500">Find customer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest transactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sale #1234</p>
                  <p className="text-sm text-gray-500">2 minutes ago</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$89.99</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Inventory Update</p>
                  <p className="text-sm text-gray-500">5 minutes ago</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-600">+15 items</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Customer Added</p>
                  <p className="text-sm text-gray-500">12 minutes ago</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">New customer</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}