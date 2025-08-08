"use client"

import { useState,  ChangeEvent, useEffect  } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Upload, File, Trash2, Eye, CheckCircle, Clock, AlertCircle, Loader2, FileText} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ServiceProps { 
  customerEmail: string
  onBack: () => void
}

interface Documents { 
  documentId: Number;  
  name: String;
  customerEmail: String;
  data: ArrayBuffer;
  contentType: string;
  size: Number; 
  status: String;
  date: Date;
}

interface Docs {  
  serviceName: string;
  mergedArray: string[];
}

export function UploadDocuments({ customerEmail, onBack }: ServiceProps) {
  const [selectedService, setSelectedService] = useState("")
  const [documents, setDocuments] = useState<Documents[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [docs, setDocs] = useState<Docs[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploadName, setUploadName] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true)

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
      fetchDocs();
      fetchUploads();
      fetchDocuments();
    }, [])

    const fetchDocs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/docs/${customerEmail}`);

        const result = await response.json();

        if (!response.ok) {
          //window.alert("customer ke side panel documents mil gaye")
          throw new Error(`HTTP error! status: ${result.message}`);
        }else{
          //window.alert("customer ke side panel documents mil gaye naaaaaaaaaaahi mil gaye"+result.data[1])
        }
      
        //const result = await response.json();
      
        // Match the structure from your backend response
        if (result.success) {
          setDocs(result.data); // Assuming result.data contains the array of docs
          console.log("Fetched Docs:", result.data);
        } else {
          console.error("Backend returned success:false", result.message);
          setDocs([]); // Set empty array on backend failure
        }    
      } catch (error) {
        console.error('Error fetching docs:', error);
        setDocs([]); // Ensure docs is always an array
      } finally {
        setLoading(false);
      }
    };

    const fetchUploads = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${customerEmail}`);

         const result = await response.json()
      
        if (!response.ok) {
          //window.alert("customer ke purane uploaded & approved documents mil gaye")
          throw new Error(`HTTP error! status: ${result.message}`);
        }else{
          //window.alert("customer ke purane uploaded & approved documents naaaaaaaaaahi mil gaye"+result.data)
        }
      
        
      
        // Match the structure from your backend response
        if (result.success) {
          setUploadedDocs(result.data); // Assuming result.data contains the array of uploadedDocs
          console.log("Fetched uploadedDocs:", result.data);
        } else {
          console.error("Backend returned success:false", result.message);
          setUploadedDocs([]); // Set empty array on backend failure
        }    
      } catch (error) {
        console.error('Error fetching uploadedDocs:', error);
        setUploadedDocs([]); // Ensure uploadedDocs is always an array
      } finally {
        setLoading(false);
      }
    };

    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/${customerEmail}`);

        if (!response.ok) {
          //window.alert("customer ke documents below panel ke liye mil gaye")
          throw new Error(`HTTP error! status: ${response.status}`);
        }else{
          //window.alert("customer ke documents below panel ke liye naaaaaaaaaaahi mil gaye")
        }
      
        const result = await response.json();
      
        // Match the structure from your backend response
        if (result.success) {
          setDocuments(result.data); // Assuming result.data contains the array of docs
          console.log("Fetched Documents:", result.data);
        } else {
          console.error("Backend returned success:false", result.message);
          setDocuments([]); // Set empty array on backend failure
        }    
      } catch (error) {
        console.error('Error fetching docs:', error);
        setDocuments([]); // Ensure docs is always an array
      } finally {
        setLoading(false);
      }
    };



  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          const { name, value } = e.target;
          setUploadName(value);

          // Clear error when user types
          if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
              ...prev,
              [name]: ''
            }));
          }
  }; 

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true); 
      const formData = new FormData();
      if (file) {
        formData.append('pdf', file);
      }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/${customerEmail}/${uploadName}`, {
            method: 'POST',
            //headers: {
            //   'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${userToken}`, // Assuming you have a userToken for authentication
            // },
            body: formData ,
          });
  
          //const result = await response.json();

          if (response.ok) {
            //window.alert("upload successful")
          } else {
            ////window.alert("upload failed" + JSON.stringify(response))
            const errorData = await response.json();
            //window.alert("upload failed" + JSON.stringify(response))
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
           
        } finally {
          setFile(null);
          setUploadName("");
          //setErrors(prev => ({ ...prev, form: errorMessage }));
          setIsSubmitting(false);
        }
      };

  // const uploadedDocuments = [
  //   {
  //     id: 1,
  //     name: "PAN Card.pdf",
  //     service: "Company Registration",
  //     uploadDate: "2024-12-15",
  //     status: "Approved",
  //     size: "2.3 MB",
  //   },
  //   {
  //     id: 2,
  //     name: "Address Proof.pdf",
  //     service: "Company Registration",
  //     uploadDate: "2024-12-16",
  //     status: "Under Review",
  //     size: "1.8 MB",
  //   },
  //   {
  //     id: 3,
  //     name: "Bank Statement.pdf",
  //     service: "GST Registration",
  //     uploadDate: "2024-12-17",
  //     status: "Rejected",
  //     size: "4.2 MB",
  //     feedback: "Document is not clear. Please upload a clearer version.",
  //   },
  // ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Upload Documents</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload New Document</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* <div>
              <Label htmlFor="service">Select Service</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company-registration">Company Registration</SelectItem>
                  <SelectItem value="gst-registration">GST Registration</SelectItem>
                  <SelectItem value="trademark-registration">Trademark Registration</SelectItem>
                  <SelectItem value="legal-documentation">Legal Documentation</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            <div>
              <Label htmlFor="uploadName">Document Type</Label>
              <Input
                  id="uploadName"
                  name="uploadName"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="Enter document type"
                  disabled={isSubmitting}
                  required
                />
              {/* <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pan-card">PAN Card</SelectItem>
                  <SelectItem value="aadhar-card">Aadhar Card</SelectItem>
                  <SelectItem value="address-proof">Address Proof</SelectItem>
                  <SelectItem value="bank-statement">Bank Statement</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select> */}
            </div>

            <div>
              <Label htmlFor="file-upload">Upload File</Label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                     {file ? (
              <div className="text-sm text-green-600">
                <CheckCircle className="mx-auto h-5 w-5" />
                <p>{file.name} selected</p>
                <p className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
              </div>
            ) : (
              <>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                    >
                      <span>Upload a file</span>
                      <Input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            setFile(files[0]);
                          } else {
                            setFile(null);
                          }
                        }}
                        className="sr-only"
                        disabled={isSubmitting}
                      />
                      {/* <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} /> */}
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF up to 10MB</p>
                  </>
            )}
                </div>
              </div>
            </div>
            </CardContent>
            
            {/* <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea id="notes" placeholder="Add any additional notes about this document..." className="mt-1" />
            </div> */}
            <CardFooter className="flex justify-end">
              <Button
                type="submit"
                disabled={!file || isSubmitting}
                className={`w-full${!file ? " opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" /> Upload Document
                  </>
                )}
              </Button>
           </CardFooter>
        </Card>
        </form>

        {/* Required Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Required Documents</CardTitle>
          </CardHeader>
          {/* <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Company Registration</h4>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• PAN Card ✓</li>
                  <li>• Address Proof (Pending)</li>
                  <li>• Bank Statement</li>
                  <li>• MOA & AOA Draft</li>
                </ul>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900">GST Registration</h4>
                <ul className="text-sm text-green-700 mt-1 space-y-1">
                  <li>• Business Registration Certificate</li>
                  <li>• Bank Account Details</li>
                  <li>• Address Proof</li>
                </ul>
              </div>
            </div>
          </CardContent> */}
          <CardContent>
            {docs.length === 0 ? (
    <div className="text-center py-8 text-gray-500">
      <FileText className="mx-auto h-12 w-12" />
      <p className="mt-2">No documents required</p>
    </div>
  ) : (
            <div className="space-y-3">
              {docs.map((service, index) => {
              // Assuming you have an array of already uploaded documents
              //const uploadedDocs = ['PAN Card', 'Address Proof', 'Bank Statement']; // Example uploaded docs
        
              // Color variations for different cards
              const colors = [
                { bg: 'bg-blue-50', text: 'text-blue-900', accent: 'text-blue-700' },
                { bg: 'bg-green-50', text: 'text-green-900', accent: 'text-green-700' },
                { bg: 'bg-purple-50', text: 'text-purple-900', accent: 'text-purple-700' },
              ];
              const color = colors[index % colors.length];

        return (
          <div key={service.serviceName.toLocaleString()} className={`p-3 ${color.bg} rounded-lg`}>
            <h4 className={`font-medium ${color.text}`}>{service.serviceName}</h4>
            <ul className={`text-sm ${color.accent} mt-1 space-y-1`}>
              {service.mergedArray.map((doc) => {
                const isUploaded = uploadedDocs.includes(doc);
                return (
                  <li key={doc} className="flex items-center justify-between">
                    <span>• {doc}</span>
                    {isUploaded && <span><CheckCircle className="h-4 w-4  text-green-600" /></span>}
                    {!isUploaded && <span><Clock className="h-4 w-4 text-yellow-600" /></span>}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  )}
  </CardContent>
        </Card>
      </div>

      {/* Uploaded Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.documentId.toLocaleString()} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <File className="h-8 w-8 text-blue-600" />
                  <div>
                    <h4 className="font-medium">{doc.name}</h4>
                    <p className="text-sm text-gray-500">
                      {/* {doc.service} • {doc.uploadDate} • {doc.size} */}
                      {`${new Date(doc.date).toISOString()} • ${doc.size}`}
                    </p>
                    {/* {doc.feedback && <p className="text-sm text-red-600 mt-1">{doc.feedback}</p>} */}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(doc.status.toLocaleString())}
                    <Badge className={getStatusColor(doc.status.toLocaleString())}>{doc.status}</Badge>
                  </div>
                  {/* <div className="flex space-x-1">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
