"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { feedbackService } from "@/lib/appwrite-service"
import { Star, Send } from "lucide-react"

export default function Feedback() {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setError("You must be logged in to submit feedback.")
      return
    }

    if (rating === 0) {
      setError("Please select a rating.")
      return
    }

    setError("")
    setLoading(true)

    try {
      await feedbackService.create(user.id, {
        rating,
        comment: comment.trim() || undefined,
      })

      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback! We appreciate your input.",
      })

      // Reset form
      setRating(0)
      setComment("")
    } catch (error: any) {
      setError(error.message || "Failed to submit feedback")
    } finally {
      setLoading(false)
    }
  }

  const StarRating = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="p-1 transition-colors"
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(star)}
          >
            <Star
              className={`h-8 w-8 ${
                star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return "Very Poor"
      case 2:
        return "Poor"
      case 3:
        return "Average"
      case 4:
        return "Good"
      case 5:
        return "Excellent"
      default:
        return "Select a rating"
    }
  }

  return (
    <div className="container px-4 py-6 md:py-8">
      <h1 className="text-2xl font-bold mb-6">Rate LexCare</h1>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Share Your Experience</CardTitle>
            <CardDescription>
              Your feedback helps us improve LexCare for everyone. Please rate your experience and share any comments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  How would you rate your overall experience with LexCare?
                </Label>
                <div className="flex flex-col items-center gap-2">
                  <StarRating />
                  <p className="text-sm text-muted-foreground">{getRatingText(hoveredRating || rating)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="comment" className="text-base font-medium">
                  Additional Comments (Optional)
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Tell us what you liked or what we could improve..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Your feedback is anonymous and helps us improve our services.
                </p>
              </div>

              <Button type="submit" disabled={loading || rating === 0} className="w-full">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Feedback Categories */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>What can you rate?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">App Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• AI Consultation quality</li>
                  <li>• Chat functionality</li>
                  <li>• Health tracking tools</li>
                  <li>• Appointment management</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">User Experience</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• App design and layout</li>
                  <li>• Ease of navigation</li>
                  <li>• Loading speed</li>
                  <li>• Overall satisfaction</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have specific issues or need immediate assistance, you can contact our support team:
            </p>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Email:</strong> support@lexcare.com
              </p>
              <p className="text-sm">
                <strong>Phone:</strong> +1-800-LEXCARE
              </p>
              <p className="text-sm">
                <strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM EST
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
