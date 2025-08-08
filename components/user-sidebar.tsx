"use client"

import { Upload, CreditCard, Calendar, Home, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function UserSidebar({ activeTab, setActiveTab }: UserSidebarProps) {
  const menuItems = [
    { id: "my-services", label: "My Services", icon: Home },
    { id: "upload-documents", label: "Upload Documents", icon: Upload },
    { id: "payment-compliance", label: "Payment & Compliance", icon: CreditCard },
    { id: "calendar", label: "Calendar", icon: Calendar },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-50",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200">
          <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-600 hover:bg-gray-50 transition-colors">
            <HelpCircle className="h-5 w-5" />
            <span className="font-medium">Help & Support</span>
          </button>
        </div>
      </nav>
    </aside>
  )
}
