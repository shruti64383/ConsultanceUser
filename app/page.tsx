"use client"

import { useState, useEffect } from "react"
import { UserHeader } from "@/components/user-header"
import { UserSidebar } from "@/components/user-sidebar"
import { MyServices } from "@/components/my-services"
import { UploadDocuments } from "@/components/upload-documents"
import { PaymentCompliance } from "@/components/payment-compliance"
import { UserCalendar } from "@/components/user-calendar"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("my-services")
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      //window.alert("mail le rha hu")
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/mine`, {
          withCredentials: true
        });
        //window.alert(JSON.stringify(res.data.user.email))
        //window.alert("ye rhi body"+JSON.stringify(res.data))
        setUserEmail(res.data.user.email);
        setUserName(res.data.user.name);
      } catch (error: any) {
        //window.alert("dikkat ho gayi user data fetch karte waqt")
        //console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
        // Not logged in or token missing
          router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/login`); // redirect to login page
        } else {
          console.error("Error fetching user data:", error);
        }
      } finally {
        setIsLoading(false) // Set loading to false when done
      }
    }

    fetchUserData();
  }, [])

  const renderContent = () => {
    if (isLoading) {
      return <div>Loading...</div> // Show loading indicator
    }
    switch (activeTab) {
      case "my-services":
        return <MyServices customerEmail={userEmail} onBack={() => {}} />
      case "upload-documents":
        return <UploadDocuments customerEmail={userEmail} onBack={() => {}}/>
      case "payment-compliance":
        return <PaymentCompliance />
      case "calendar":
        return <UserCalendar />
      default:
        return <MyServices customerEmail={userEmail} onBack={() => {}} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader userName={userName} onBack={() => {}}/>
      <div className="flex">
        <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
