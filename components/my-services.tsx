"use client"

import { useState, ChangeEvent, useEffect} from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Eye, MessageCircle, Loader2, Send, Package, Upload } from "lucide-react"
import { UploadDocuments } from "@/components/upload-documents"

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUploadDocuments, setShowUploadDocuments] = useState(false);
  const [newService, setNewService] = useState({
      name: "",
      phone: "",
      email: "",
      requirements: ""
  })
  const [errors, setErrors] = useState({
      name: "",
      email: "",
      phone: "",
      requirements: ""
  })
    

  useEffect(() => {
      fetchServices()
    }, [])

    const fetchServices = async () => {
      try {
        setLoading(true);
        //window.alert("Fetching services for Email: " + customerEmail)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/email/${customerEmail}`);


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

  const validateForm = () => {
      let isValid = true;
      const newErrors = { ...errors };
  
      // Name validation
      if (!newService.name.trim()) {
        newErrors.name = 'Name is required';
        isValid = false;
      } else {
        newErrors.name = '';
      }
  
      // Phone validation
      const phoneRegex = /^[\d\s\-()+]{10,20}$/;
      if (!newService.phone) {
        newErrors.phone = 'Phone number is required';
        isValid = false;
      } else if (!phoneRegex.test(newService.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
        isValid = false;
      } else {
        newErrors.phone = '';
      }
  
      // Email validation
      const emailRegex = /\S+@\S+\.\S+/;
      if (!newService.email) {
        newErrors.email = 'Email is required';
        isValid = false;
      } else if (!emailRegex.test(newService.email)) {
        newErrors.email = 'Please enter a valid email';
        isValid = false;
      } else {
        newErrors.email = '';
      }
  
      // Message validation
      if (!newService.requirements.trim()) {
        newErrors.requirements = 'Please describe your requirements';
        isValid = false;
      } else {
        newErrors.requirements = '';
      }
  
      setErrors(newErrors);
      return isValid;
    };
  
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewService(prev => ({
          ...prev,
          [name]: value
        }));
    
        // Clear error when user types
        if (errors[name as keyof typeof errors]) {
          setErrors(prev => ({
            ...prev,
            [name]: ''
          }));
        }
    }; 
  
    const handleServiceSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
  
      if (validateForm()) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/lead`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newService),
          });
  
          if (response.ok) {
            //router.push('/thank-you');
            window.alert("Your service request has been submitted successfully. We will get back to you soon.");
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Submission failed');
          }
        } catch (error: unknown) {
          let errorMessage = 'Failed to submit inquiry';
    
          if (error instanceof Error) {
            errorMessage = error.message;
          } else if (typeof error === 'string') {
            errorMessage = error;
          }
          console.error('Submission error:', error);
          setErrors(prev => ({ ...prev, form: errorMessage }));
        } finally {
          setIsSubmitting(false);
          setIsModalOpen(false);
          setNewService({
            name: "",
            phone: "",
            email: "",
            requirements: ""
          });     
        }
      } else {
        setIsSubmitting(false);
      }
    };

  // If showUploadDocuments is true, render the UploadDocuments component
  if (showUploadDocuments) {
    return <UploadDocuments customerEmail={customerEmail} onBack={() => setShowUploadDocuments(false)} />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">My Services</h2>
        <Button onClick={() => setIsModalOpen(true)}>Request New Service</Button>
      </div>

      {isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 w-full max-w-md relative">
          <h3 className="text-xl font-semibold mb-4">Request New Service</h3>
      
          {/* Example form */}
          <form onSubmit={handleServiceSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">Your Name</label>
              <input
                id="name"
                name="name"
                value={newService.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={isSubmitting}
                required 
                type="text" 
                className="mt-1 w-full border border-gray-300 rounded p-2" 
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
              <input
                id="phone"
                name="phone"
                value={newService.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                disabled={isSubmitting}
                required
                type="tel"
                className="mt-1 w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={newService.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={isSubmitting}
                className="mt-1 w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="requirements" className="block text-sm font-bold text-gray-700 mb-1">
                Requirements
              </label>
              <Textarea
                id="requirements"
                name="requirements"
                value={newService.requirements}
                onChange={handleChange}
                placeholder="Tell us about your requirements"
                rows={4}
                required
                disabled={isSubmitting}
              />
            </div> 

            <div className="flex justify-end gap-2">
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" /> Submit Request
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
            </div>                     
          </form>

          {/* Close button (X) */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>
      )}


      <div className="grid gap-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading services...</span>
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-32 h-32 mb-6 flex items-center justify-center">
              <Package className="w-full h-full text-gray-300 opacity-50" />
            </div>
            <h3 className="text-xl font-medium text-gray-500 mb-2">No Services Yet</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              You haven't requested any services yet. Click the button above to get started with your first service request.
            </p>
            <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              Request Your First Service
            </Button>
          </div>
        ) : (
          services.map((service) => (
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
                    {service.completedDate && (
                      <div>
                        <p className="text-gray-500">Completion Date</p>
                        <p className="font-medium">{new Date(service.completedDate).toISOString().split('T')[0]}</p>
                      </div>
                    )}
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
                  
                                     {/* Upload Docs Button */}
                   <div className="flex justify-end pt-2"> 
                       <Button 
                         size="sm" 
                         variant="outline"
                         onClick={() => setShowUploadDocuments(true)}
                         className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 border-blue-200"
                       >
                       <Upload className="h-4 w-4" />
                         <span>Upload Documents</span>
                       </Button>

                   </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
