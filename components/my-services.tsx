"use client"

import { useState, ChangeEvent, useEffect} from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Eye, MessageCircle } from "lucide-react"

interface ServiceProps {
  // customerId: Number
  // customerName: string
  customerEmail: string
  onBack: () => void
}

interface Services{
    serviceId: Number,
    customerId: Number,
    progress: Number,
    name: string,
    price: Number,
    status: string,
    startDate: Date,
    completedDate: Date,
    description: string,
    requiredDocuments: string[],
    certificates: string[],
    uploadedDocuments: Document[]
} 

export function MyServices({ customerEmail, onBack }: ServiceProps) {
  const [services, setServices] = useState<Services[]>([]);
  const [loading, setLoading] = useState(true)
  // const services = [
  //   {
  //     id: "CUST001",
  //     name: "Company Registration",
  //     status: "In Progress",
  //     progress: 75,
  //     priority: "High",
  //     startDate: "2024-12-15",
  //     expectedCompletion: "2024-12-30",
  //     assignedTo: "Legal Team",
  //   },
  //   {
  //     id: "CUST002",
  //     name: "GST Registration",
  //     status: "Completed",
  //     progress: 100,
  //     priority: "Medium",
  //     startDate: "2024-12-10",
  //     expectedCompletion: "2024-12-25",
  //     assignedTo: "Tax Team",
  //   },
  //   {
  //     id: "CUST003",
  //     name: "Trademark Registration",
  //     status: "Pending Documents",
  //     progress: 30,
  //     priority: "High",
  //     startDate: "2024-12-20",
  //     expectedCompletion: "2025-01-15",
  //     assignedTo: "IP Team",
  //   },
  // ]

  useEffect(() => {
      fetchServices()
    }, [])

    const fetchServices = async () => {
      try {
        setLoading(true);
        //window.alert("Fetching services for Email: " + customerEmail)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/get/${encodeURIComponent(customerEmail)}`);

        if (!response.ok) {
          //window.alert("Kuch ni mila")
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      
        const result = await response.json();
      
        // Match the structure from your backend response
        if (result.success) {
          //window.alert("RESULTS customerEmail: " + customerEmail+ " result: " + JSON.stringify(result.data))
          setServices(result.data); // Assuming result.data contains the array of services
          console.log("Fetched services:", result.data);
        } else {
          console.error("Backend returned success:false", result.message);
          setServices([]); // Set empty array on backend failure
        }    
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]); // Ensure services is always an array
      } finally {
        setLoading(false);
      }
    };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Pending Documents":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-orange-100 text-orange-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">My Services</h2>
        <Button>Request New Service</Button>
      </div> */}

      <div className="grid gap-6">
        {services.map((service) => (
          <Card key={service.serviceId.toLocaleString()} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Service ID: {service.serviceId.toLocaleString()}</p>
                </div>
                <div className="flex space-x-2">
                  <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                  {/* <Badge className={getPriorityColor(service.priority)}>{service.priority}</Badge> */}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{service.progress.toLocaleString()}%</span>
                  </div>
                  <Progress value={Number(service.progress)} className="h-2" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Start Date</p>
                    <p className="font-medium">{new Date(service.startDate).toISOString().split('T')[0]}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Expected Completion</p>
                    <p className="font-medium">{service.completedDate 
                      ? new Date(service.completedDate).toISOString().split('T')[0] 
                      : "00-00-0000"}
                    </p>
                  </div>
                  {/* <div>
                    <p className="text-gray-500">Assigned To</p>
                    <p className="font-medium">{service.assignedTo}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
                  </div> */}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
