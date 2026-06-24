//health record

"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { healthRecordsService } from "@/lib/appwrite-service"
import { FileText, Download, Calendar, User, AlertTriangle, Pill, Activity } from "lucide-react"

type HealthRecord = {
  id: string
  record_type: "diagnosis" | "allergy" | "medication" | "procedure" | "lab_result" | "vaccination"
  record_date: string
  title: string
  description: string
  doctor_name?: string
  severity?: "low" | "medium" | "high"
  status?: "active" | "resolved" | "chronic"
  details: any
  created_at: string
}

export default function HealthRecords() {
  const { user } = useAuth()
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [exportLoading, setExportLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      loadHealthRecords()
    }
  }, [user])

  const loadHealthRecords = async () => {
    if (!user) return

    try {
      const data = await healthRecordsService.getByUserId(user.id)
      
      if (data) {
        // Convert Appwrite documents to HealthRecord type
        const formattedData = data.map(item => ({
          id: item.$id,
          record_type: item.record_type,
          record_date: item.record_date,
          title: item.title,
          description: item.description,
          doctor_name: item.doctor_name,
          severity: item.severity,
          status: item.status,
          details: item.details ? JSON.parse(item.details) : {},
          created_at: item.$createdAt,
        }))
        setRecords(formattedData as HealthRecord[])
      }
    } catch (error) {
      console.error("Error loading health records:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load health records.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExportToPDF = async () => {
    setExportLoading(true)

    try {
      // Simulate PDF generation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Export successful",
        description: "Your health records have been exported to PDF.",
      })

      // In a real app, this would trigger a download
      const element = document.createElement("a")
      element.href = "data:text/plain;charset=utf-8," + encodeURIComponent("Health Records PDF would be generated here")
      element.download = "health-records.pdf"
      element.style.display = "none"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "Failed to export health records.",
      })
    } finally {
      setExportLoading(false)
    }
  }

  const getRecordIcon = (type: string) => {
    switch (type) {
      case "diagnosis":
        return <FileText className="h-5 w-5" />
      case "allergy":
        return <AlertTriangle className="h-5 w-5" />
      case "medication":
        return <Pill className="h-5 w-5" />
      case "procedure":
        return <Activity className="h-5 w-5" />
      case "lab_result":
        return <FileText className="h-5 w-5" />
      case "vaccination":
        return <Activity className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getRecordColor = (type: string) => {
    switch (type) {
      case "diagnosis":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "allergy":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medication":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "procedure":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "lab_result":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "vaccination":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const groupRecordsByType = (records: HealthRecord[]) => {
    return records.reduce(
      (groups, record) => {
        const type = record.record_type
        if (!groups[type]) {
          groups[type] = []
        }
        groups[type].push(record)
        return groups
      },
      {} as Record<string, HealthRecord[]>,
    )
  }

  const formatRecordType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const groupedRecords = groupRecordsByType(records)

  return (
    <div className="container px-4 py-6 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Health Records</h1>
        <Button onClick={handleExportToPDF} disabled={exportLoading || records.length === 0}>
          {exportLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export to PDF
            </>
          )}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="flex items-center p-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Records</p>
              <p className="text-xl font-bold">{records.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Allergies</p>
              <p className="text-xl font-bold">{groupedRecords.allergy?.length || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
              <Pill className="h-5 w-5 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Medications</p>
              <p className="text-xl font-bold">{groupedRecords.medication?.length || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
              <Activity className="h-5 w-5 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Procedures</p>
              <p className="text-xl font-bold">{groupedRecords.procedure?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Records */}
      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
          <CardDescription>Your complete medical records organized by category.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : records.length > 0 ? (
            <Accordion type="multiple" className="w-full">
              {Object.entries(groupedRecords).map(([type, typeRecords]) => (
                <AccordionItem key={type} value={type}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getRecordColor(type)}`}>{getRecordIcon(type)}</div>
                      <div className="text-left">
                        <p className="font-medium">{formatRecordType(type)}</p>
                        <p className="text-sm text-muted-foreground">
                          {typeRecords.length} record{typeRecords.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      {typeRecords.map((record) => (
                        <div key={record.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium">{record.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {new Date(record.record_date).toLocaleDateString()}
                                </span>
                                {record.doctor_name && (
                                  <>
                                    <User className="h-4 w-4 text-muted-foreground ml-2" />
                                    <span className="text-sm text-muted-foreground">Dr. {record.doctor_name}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {record.severity && (
                                <Badge className={getSeverityColor(record.severity)}>{record.severity}</Badge>
                              )}
                              {record.status && <Badge variant="outline">{record.status}</Badge>}
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-3">{record.description}</p>

                          {record.details && Object.keys(record.details).length > 0 && (
                            <div className="bg-muted/50 rounded-md p-3">
                              <h5 className="font-medium mb-2">Additional Details:</h5>
                              <div className="space-y-1">
                                {Object.entries(record.details).map(([key, value]) => (
                                  <div key={key} className="flex justify-between text-sm">
                                    <span className="capitalize">{key.replace("_", " ")}:</span>
                                    <span>{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
              <p className="mt-4 text-muted-foreground">No health records found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Your medical records will appear here as they are added by healthcare providers.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
