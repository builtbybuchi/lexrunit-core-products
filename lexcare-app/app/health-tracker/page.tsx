"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { vitalSignsService } from "@/lib/appwrite-service"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Thermometer, Activity, Heart, Weight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

type VitalSign = {
  id: string
  temperature?: number
  blood_pressure?: string
  heart_rate?: number
  weight?: number
  recorded_at: string
}

export default function HealthTracker() {
  const { user } = useAuth()
  const [temperature, setTemperature] = useState<string>("")
  const [systolic, setSystolic] = useState<string>("")
  const [diastolic, setDiastolic] = useState<string>("")
  const [heartRate, setHeartRate] = useState<string>("")
  const [weight, setWeight] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([])
  const [activeTab, setActiveTab] = useState("temperature")
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const { toast } = useToast()

  // Loading state for initial user check
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      loadVitalSigns()
    }
  }, [user])

  const loadVitalSigns = async () => {
    if (!user) return

    try {
      const data = await vitalSignsService.getByUserId(user.id, 30)
      
      if (data) {
        // Convert Appwrite documents to VitalSign type
        const formattedData = data.map(item => ({
          id: item.$id,
          temperature: item.temperature,
          blood_pressure: item.blood_pressure,
          heart_rate: item.heart_rate,
          weight: item.weight,
          recorded_at: item.recorded_at,
        }))
        setVitalSigns(formattedData)
      }
    } catch (error) {
      console.error("Error loading vital signs:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your health data.",
      })
    }
  }

  const handleSaveVitals = async () => {
    if (!user) return

    setError("")
    setLoading(true)

    try {
      const newVitalSign = await vitalSignsService.create(user.id, {
        temperature: temperature ? Number.parseFloat(temperature) : undefined,
        blood_pressure: systolic && diastolic ? `${systolic}/${diastolic}` : undefined,
        heart_rate: heartRate ? Number.parseInt(heartRate) : undefined,
        weight: weight ? Number.parseFloat(weight) : undefined,
        recorded_at: new Date().toISOString(),
      })

      toast({
        title: "Vital signs saved",
        description: "Your health data has been successfully recorded.",
      })

      // Optimistically update vitalSigns with the new data
      const formattedVital = {
        id: newVitalSign.$id,
        temperature: newVitalSign.temperature,
        blood_pressure: newVitalSign.blood_pressure,
        heart_rate: newVitalSign.heart_rate,
        weight: newVitalSign.weight,
        recorded_at: newVitalSign.recorded_at,
      }
      setVitalSigns(prev => [formattedVital, ...prev])

      // Reset form
      setTemperature("")
      setSystolic("")
      setDiastolic("")
      setHeartRate("")
      setWeight("")
    } catch (error: any) {
      setError(error.message || "Failed to save vital signs")
      // If error, try to reload
      loadVitalSigns()
    } finally {
      setLoading(false)
    }
  }

  const formatChartData = (data: VitalSign[], type: string) => {
    return data
      .filter((item) => {
        if (type === "temperature") return item.temperature
        if (type === "blood_pressure") return item.blood_pressure
        if (type === "heart_rate") return item.heart_rate
        if (type === "weight") return item.weight
        return false
      })
      .map((item) => {
        const date = new Date(item.recorded_at)
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`

        if (type === "blood_pressure" && item.blood_pressure) {
          const [systolic, diastolic] = item.blood_pressure.split("/")
          return {
            date: formattedDate,
            systolic: Number.parseInt(systolic),
            diastolic: Number.parseInt(diastolic),
          }
        }

        return {
          date: formattedDate,
          [type]:
            type === "temperature"
              ? item.temperature
              : type === "heart_rate"
                ? item.heart_rate
                : type === "weight"
                  ? item.weight
                  : null,
        }
      })
      .reverse()
  }

  const checkVitalWarnings = () => {
    if (vitalSigns.length === 0) return null

    const latestVital = vitalSigns[0]
    const warnings = []

    if (latestVital.temperature && latestVital.temperature > 38) {
      warnings.push("Your temperature is elevated. Consider consulting a doctor if it persists.")
    }

    if (latestVital.blood_pressure) {
      const [systolic, diastolic] = latestVital.blood_pressure.split("/").map(Number)
      if (systolic > 140 || diastolic > 90) {
        warnings.push("Your blood pressure is high. Monitor it regularly and consult your doctor.")
      }
    }

    if (latestVital.heart_rate && latestVital.heart_rate > 100) {
      warnings.push("Your heart rate is elevated. Rest and monitor for changes.")
    }

    return warnings.length > 0 ? warnings : null
  }

  const warnings = checkVitalWarnings()

  // Helper to get the latest non-null value for a metric
  function getLatestMetricValue(metric: "temperature" | "blood_pressure" | "heart_rate" | "weight") {
    for (const vital of vitalSigns) {
      if (metric === "temperature" && vital.temperature != null) return vital.temperature;
      if (metric === "blood_pressure" && vital.blood_pressure) return vital.blood_pressure;
      if (metric === "heart_rate" && vital.heart_rate != null) return vital.heart_rate;
      if (metric === "weight" && vital.weight != null) return vital.weight;
    }
    return "";
  }

  return (
    <div className="container px-4 py-6 md:py-8">
      {initialLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3 mb-6" />
          <div className="grid grid-cols-2 gap-4 w-full mb-8">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6">Health Tracker</h1>

          {warnings && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                <div className="font-semibold mb-2">Health Alerts:</div>
                <ul className="list-disc pl-5 space-y-1">
                  {warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Form */}
            <div className="mb-8 w-full">
              <div className="grid grid-cols-2 gap-4 w-full">
                {[
                  {
                    key: "temperature",
                    label: "Temperature (°C)",
                    icon: <Thermometer className="w-8 h-8 text-blue-700" />,
                    value: temperature,
                    setValue: setTemperature,
                    placeholder: "36.5",
                    inputType: "number",
                    inputProps: { step: "0.1" },
                  },
                  {
                    key: "blood_pressure",
                    label: "Blood Pressure (mmHg)",
                    icon: <Activity className="w-8 h-8 text-red-700" />,
                    value: systolic && diastolic ? `${systolic}/${diastolic}` : "",
                    setValue: (val: string) => {
                      const [sys, dia] = val.split("/");
                      setSystolic(sys || "");
                      setDiastolic(dia || "");
                    },
                    placeholder: "120/80",
                    inputType: "text",
                    inputProps: {},
                  },
                  {
                    key: "heart_rate",
                    label: "Heart Rate (BPM)",
                    icon: <Heart className="w-8 h-8 text-pink-600" />,
                    value: heartRate,
                    setValue: setHeartRate,
                    placeholder: "75",
                    inputType: "number",
                    inputProps: {},
                  },
                  {
                    key: "weight",
                    label: "Weight (kg)",
                    icon: <Weight className="w-8 h-8 text-green-700" />,
                    value: weight,
                    setValue: setWeight,
                    placeholder: "70.5",
                    inputType: "number",
                    inputProps: { step: "0.1" },
                  },
                ].map((card) => (
                  <div
                    key={card.key}
                    className={`transition-all duration-300 rounded-2xl shadow cursor-pointer flex flex-col items-center justify-center bg-gray-50
                  w-full ${expandedCard === card.key ? "h-64 p-8 bg-white relative" : "h-32 p-4"}
                `}
                    onClick={() => setExpandedCard(card.key)}
                    style={{ position: "relative" }}
                  >
                    {/* Close button, only when expanded */}
                    {expandedCard === card.key && (
                      <button
                        type="button"
                        aria-label="Close"
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold bg-transparent border-none focus:outline-none"
                        onClick={e => {
                          e.stopPropagation();
                          setExpandedCard(null);
                        }}
                      >
                        ×
                      </button>
                    )}
                    <div className="flex flex-col items-center mb-2 w-full">
                      {card.icon}
                      {expandedCard === card.key ? (
                        card.key === "blood_pressure" ? (
                          <div className="flex space-x-1 mt-2">
                            <input
                              type="number"
                              placeholder="120"
                              value={systolic}
                              onChange={(e) => setSystolic(e.target.value)}
                              className="text-2xl font-bold w-16 text-center border rounded"
                              onClick={e => e.stopPropagation()}
                            />
                            <span className="text-xl font-bold">/</span>
                            <input
                              type="number"
                              placeholder="80"
                              value={diastolic}
                              onChange={(e) => setDiastolic(e.target.value)}
                              className="text-2xl font-bold w-16 text-center border rounded"
                              onClick={e => e.stopPropagation()}
                            />
                          </div>
                        ) : (
                          <input
                            type={card.inputType}
                            placeholder={card.placeholder}
                            value={card.value}
                            onChange={(e) => card.setValue(e.target.value)}
                            className="text-2xl font-bold w-24 text-center border rounded mt-2"
                            {...card.inputProps}
                            onClick={e => e.stopPropagation()}
                          />
                        )
                      ) : (
                        <span className="text-2xl font-bold mt-2">
                          {getLatestMetricValue(card.key as "temperature" | "blood_pressure" | "heart_rate" | "weight") || "-"}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">{card.label}</div>
                    {expandedCard === card.key && (
                      <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        onClick={e => {
                          handleSaveVitals();
                          e.stopPropagation();
                          setExpandedCard(null);
                        }}
                      >
                        Update
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Charts */}
            <Card>
              <CardHeader>
                <CardTitle>Health Trends</CardTitle>
                <CardDescription>View your health metrics over time.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="temperature">Temp</TabsTrigger>
                    <TabsTrigger value="blood_pressure">BP</TabsTrigger>
                    <TabsTrigger value="heart_rate">Heart Rate</TabsTrigger>
                    <TabsTrigger value="weight">Weight</TabsTrigger>
                  </TabsList>

                  <TabsContent value="temperature">
                    <div className="h-[300px]">
                      {formatChartData(vitalSigns, "temperature").length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={formatChartData(vitalSigns, "temperature")}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={["dataMin - 0.5", "dataMax + 0.5"]} />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="temperature"
                              stroke="#021488"
                              name="Temperature (°C)"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground">No temperature data available</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="blood_pressure">
                    <div className="h-[300px]">
                      {formatChartData(vitalSigns, "blood_pressure").length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={formatChartData(vitalSigns, "blood_pressure")}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[40, "dataMax + 10"]} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="systolic" stroke="#021488" name="Systolic" strokeWidth={2} />
                            <Line type="monotone" dataKey="diastolic" stroke="#0A91F9" name="Diastolic" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground">No blood pressure data available</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="heart_rate">
                    <div className="h-[300px]">
                      {formatChartData(vitalSigns, "heart_rate").length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={formatChartData(vitalSigns, "heart_rate")}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={["dataMin - 5", "dataMax + 5"]} />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="heart_rate"
                              stroke="#0546B6"
                              name="Heart Rate (BPM)"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground">No heart rate data available</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="weight">
                    <div className="h-[300px]">
                      {formatChartData(vitalSigns, "weight").length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={formatChartData(vitalSigns, "weight")}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={["dataMin - 2", "dataMax + 2"]} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="weight" stroke="#0A91F9" name="Weight (kg)" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground">No weight data available</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Recent Readings */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Readings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Temperature (°C)</th>
                      <th className="text-left py-3 px-4">Blood Pressure</th>
                      <th className="text-left py-3 px-4">Heart Rate (BPM)</th>
                      <th className="text-left py-3 px-4">Weight (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vitalSigns.length > 0 ? (
                      vitalSigns.slice(0, 5).map((vital) => (
                        <tr key={vital.id} className="border-b">
                          <td className="py-3 px-4">{new Date(vital.recorded_at).toLocaleDateString()}</td>
                          <td className="py-3 px-4">{vital.temperature || "-"}</td>
                          <td className="py-3 px-4">{vital.blood_pressure || "-"}</td>
                          <td className="py-3 px-4">{vital.heart_rate || "-"}</td>
                          <td className="py-3 px-4">{vital.weight || "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-muted-foreground">
                          No vital signs recorded yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
