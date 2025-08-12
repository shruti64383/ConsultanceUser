"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Video, MapPin, Plus } from "lucide-react"

export function UserCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const appointments = [
    {
      id: 1,
      title: "Company Registration Consultation",
      date: "2024-12-28",
      time: "10:00 AM",
      duration: "1 hour",
      type: "Video Call",
      consultant: "Priya Sharma",
      status: "Confirmed",
      meetingLink: "https://meet.google.com/abc-def-ghi",
    },
    {
      id: 2,
      title: "GST Documentation Review",
      date: "2024-12-30",
      time: "2:00 PM",
      duration: "45 minutes",
      type: "In-Person",
      consultant: "Rajesh Kumar",
      status: "Pending",
      location: "Office - Conference Room A",
    },
    {
      id: 3,
      title: "Trademark Application Follow-up",
      date: "2025-01-02",
      time: "11:30 AM",
      duration: "30 minutes",
      type: "Phone Call",
      consultant: "Amit Singh",
      status: "Confirmed",
    },
  ]

  const upcomingDeadlines = [
    {
      id: 1,
      title: "Submit Additional Documents",
      service: "Company Registration",
      date: "2024-12-29",
      priority: "High",
    },
    {
      id: 2,
      title: "GST Return Filing",
      service: "GST Registration",
      date: "2025-01-15",
      priority: "Medium",
    },
    {
      id: 3,
      title: "Trademark Response Deadline",
      service: "Trademark Registration",
      date: "2025-01-20",
      priority: "High",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Video Call":
        return <Video className="h-4 w-4" />
      case "In-Person":
        return <MapPin className="h-4 w-4" />
      case "Phone Call":
        return <Clock className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Calendar & Appointments</h2>
        <h3 className="text-lg font-normal text-gray-500 mt-2">(This is sample/demo content)</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-lg">{appointment.title}</h4>
                      <p className="text-sm text-gray-600">with {appointment.consultant}</p>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>
                        {appointment.time} ({appointment.duration})
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(appointment.type)}
                      <span>{appointment.type}</span>
                    </div>
                    {appointment.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-xs">{appointment.location}</span>
                      </div>
                    )}
                  </div>

                  {appointment.meetingLink && (
                    <div className="mt-3 pt-3 border-t">
                      <Button size="sm" variant="outline" className="w-full bg-transparent">
                        <Video className="h-4 w-4 mr-2" />
                        Join Meeting
                      </Button>
                    </div>
                  )}

                  <div className="mt-3 flex space-x-2">
                    <Button size="sm" variant="outline">
                      Reschedule
                    </Button>
                    <Button size="sm" variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{deadline.title}</h4>
                    <Badge className={getPriorityColor(deadline.priority)} variant="outline">
                      {deadline.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{deadline.service}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{deadline.date}</span>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                View All Deadlines
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Calendar className="h-6 w-6 mb-2" />
              <span className="text-sm">Schedule Meeting</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Clock className="h-6 w-6 mb-2" />
              <span className="text-sm">Set Reminder</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Video className="h-6 w-6 mb-2" />
              <span className="text-sm">Join Call</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <MapPin className="h-6 w-6 mb-2" />
              <span className="text-sm">Get Directions</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
