import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Download, AlertTriangle, CheckCircle, Clock } from "lucide-react"

export function PaymentCompliance() {
  const payments = [
    {
      id: "PAY001",
      service: "Company Registration",
      amount: 15000,
      status: "Paid",
      date: "2024-12-15",
      method: "UPI",
      invoiceId: "INV-2024-001",
    },
    {
      id: "PAY002",
      service: "GST Registration",
      amount: 8000,
      status: "Pending",
      date: "2024-12-20",
      method: "Bank Transfer",
      invoiceId: "INV-2024-002",
    },
    {
      id: "PAY003",
      service: "Trademark Registration",
      amount: 25000,
      status: "Overdue",
      date: "2024-12-10",
      method: "Credit Card",
      invoiceId: "INV-2024-003",
    },
  ]

  const complianceItems = [
    {
      id: 1,
      title: "Annual GST Return Filing",
      dueDate: "2025-01-31",
      status: "Upcoming",
      priority: "High",
      description: "Annual GST return for FY 2023-24 needs to be filed",
    },
    {
      id: 2,
      title: "Company Annual Filing",
      dueDate: "2025-02-15",
      status: "In Progress",
      priority: "Medium",
      description: "Annual filing with ROC for company compliance",
    },
    {
      id: 3,
      title: "TDS Return Filing",
      dueDate: "2024-12-31",
      status: "Overdue",
      priority: "High",
      description: "Quarterly TDS return filing is overdue",
    },
  ]

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Upcoming":
        return "bg-yellow-100 text-yellow-800"
      case "Overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "In Progress":
        return <Clock className="h-5 w-5 text-blue-600" />
      case "Upcoming":
        return <Clock className="h-5 w-5 text-yellow-600" />
      case "Overdue":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return null
    }
  }

  const totalPaid = payments.filter((p) => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0)
  const totalPending = payments.filter((p) => p.status !== "Paid").reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Payment & Compliance</h2>
        <h3 className="text-lg font-normal text-gray-500 mt-2">(This is sample/demo content)</h3>
      </div>

      {/* Payment Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-yellow-600">₹{totalPending.toLocaleString()}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Items</p>
                <p className="text-2xl font-bold text-red-600">2</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{payment.service}</h4>
                    <p className="text-sm text-gray-500">
                      {payment.date} • {payment.method} • {payment.invoiceId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{payment.amount.toLocaleString()}</p>
                    <Badge className={getPaymentStatusColor(payment.status)}>{payment.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Download All Invoices
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Compliance Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceItems.map((item) => (
                <div key={item.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getComplianceIcon(item.status)}
                      <h4 className="font-medium">{item.title}</h4>
                    </div>
                    <Badge className={getComplianceStatusColor(item.status)}>{item.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Due: {item.dueDate}</span>
                    <Badge
                      variant="outline"
                      className={
                        item.priority === "High" ? "border-red-200 text-red-700" : "border-yellow-200 text-yellow-700"
                      }
                    >
                      {item.priority} Priority
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button className="w-full">View All Compliance Items</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
