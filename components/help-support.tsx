"use client"

import { useState, ChangeEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send, HelpCircle } from "lucide-react"

interface HelpSupportProps {
  customerEmail: string
  onBack: () => void
}

export function HelpSupport({ customerEmail, onBack }: HelpSupportProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newInquiry, setNewInquiry] = useState({
    name: "",
    phone: "",
    email: "",
    issue: ""
  })
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    issue: ""
  })

  const validateForm = () => {
    let isValid = true
    const newErrors = { ...errors }

    // Name validation
    if (!newInquiry.name.trim()) {
      newErrors.name = 'Name is required'
      isValid = false
    } else {
      newErrors.name = ''
    }

    // Phone validation
    const phoneRegex = /^[\d\s\-()+]{10,20}$/
    if (!newInquiry.phone) {
      newErrors.phone = 'Phone number is required'
      isValid = false
    } else if (!phoneRegex.test(newInquiry.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
      isValid = false
    } else {
      newErrors.phone = ''
    }

    // Email validation
    const emailRegex = /\S+@\S+\.\S+/
    if (!newInquiry.email) {
      newErrors.email = 'Email is required'
      isValid = false
    } else if (!emailRegex.test(newInquiry.email)) {
      newErrors.email = 'Please enter a valid email'
      isValid = false
    } else {
      newErrors.email = ''
    }

    // Issue validation
    if (!newInquiry.issue.trim()) {
      newErrors.issue = 'Please describe the issue you are facing'
      isValid = false
    } else {
      newErrors.issue = ''
    }

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewInquiry(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (validateForm()) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/lead`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newInquiry),
        })

        if (response.ok) {
          window.alert("Your help request has been submitted successfully. We will get back to you soon.")
        } else {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Submission failed')
        }
      } catch (error: unknown) {
        let errorMessage = 'Failed to submit help request'

        if (error instanceof Error) {
          errorMessage = error.message
        } else if (typeof error === 'string') {
          errorMessage = error
        }
        console.error('Submission error:', error)
        setErrors(prev => ({ ...prev, form: errorMessage }))
      } finally {
        setIsSubmitting(false)
        setNewInquiry({
          name: "",
          phone: "",
          email: "",
          issue: ""
        })
      }
    } else {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" onClick={onBack} className="mb-4 bg-transparent">
            ← Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600">
            Need assistance? Submit your inquiry below and we'll get back to you.
          </p>
        </div>
      </div>

      {/* Help Request Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <span>Submit Help Request</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInquirySubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={newInquiry.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  disabled={isSubmitting}
                  required
                  type="text"
                  className="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={newInquiry.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  disabled={isSubmitting}
                  required
                  type="tel"
                  className="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={newInquiry.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={isSubmitting}
                className="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="issue" className="block text-sm font-medium text-gray-700 mb-1">
                Which issue are you facing?
              </label>
              <Textarea
                id="issue"
                name="issue"
                value={newInquiry.issue}
                onChange={handleChange}
                placeholder="Write in detail the issue you are facing..."
                rows={4}
                required
                disabled={isSubmitting}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.issue && <p className="text-red-500 text-sm mt-1">{errors.issue}</p>}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
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
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Help Content Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">📋 Getting Started with Our Services</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800 space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                1
              </span>
              <div>
                <p className="font-semibold">Request a Service</p>
                <p className="text-blue-700">Visit the My Services page and submit a service request that matches your needs.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="font-semibold">Wait for Admin Contact</p>
                <p className="text-blue-700">Our admin will reach out to you for a brief discussion about your request.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                3
              </span>
              <div>
                <p className="font-semibold">Service Activation</p>
                <p className="text-blue-700">Once finalized, the admin will add your service. You can track its status in your My Services page.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                4
              </span>
              <div>
                <p className="font-semibold">Upload Required Documents</p>
                <p className="text-blue-700">Go to the Upload Documents page and check the right-side panel for the list of required documents. Upload all listed files to proceed with your service.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                5
              </span>
              <div>
                <p className="font-semibold">Track Document Status</p>
                <p className="text-blue-700">In the Uploads section of the Upload Documents page, you can monitor each file's status:</p>
                <div className="mt-2 space-y-1 text-blue-700">
                  <div className="flex items-center space-x-2">
                    <span>🕒</span>
                    <span><strong>Pending</strong> – Awaiting review</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>❌</span>
                    <span><strong>Rejected</strong> – Requires re-upload or correction</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>✅</span>
                    <span><strong>Approved</strong> – Cleared by admin</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                6
              </span>
              <div>
                <p className="font-semibold">Complete the Process</p>
                <p className="text-blue-700">Document upload and approval are mandatory to finalize and complete your service.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
