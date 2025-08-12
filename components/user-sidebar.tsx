"use client"

import { Upload, CreditCard, Calendar, Home, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  collapsed: boolean
}

export function UserSidebar({ activeTab, setActiveTab, collapsed }: UserSidebarProps) {
  const menuItems = [
    { id: "my-services", label: "My Services", icon: Home },
    { id: "upload-documents", label: "Upload Documents", icon: Upload },
    { id: "payment-compliance", label: "Payment & Compliance", icon: CreditCard },
    { id: "calendar", label: "Calendar", icon: Calendar },
  ]

  return (
    <div 
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 border-b border-gray-200">
        {!collapsed && (
          <>
            <h2 className="text-xl font-bold text-gray-900">Bharat Comply</h2>
            <p className="text-xs text-gray-500">User Panel</p>
          </>
        )}
      </div>
      <nav className="flex-1 p-4 space-y-2">
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
                <Icon className={cn(
                  "transition-all duration-300",
                  collapsed ? "h-6 w-6" : "h-5 w-5"
                )} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </button>
            )
          })}
        </div>

        {!collapsed && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-600 hover:bg-gray-50 transition-colors">
              <HelpCircle className={cn(
                "transition-all duration-300",
                collapsed ? "h-6 w-6" : "h-5 w-5"
              )} />
              <span className="font-medium">Help & Support</span>
            </button>
          </div>
        )}
      </nav>
    </div>
  )
}
