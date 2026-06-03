"use client"

import { useState } from "react"
import { Calendar, Check, Copy, ExternalLink, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "../ui/card"
import useCalendarSubscription from "@/hooks/useCalendarSubscription"

export default function CalendarSubscriptions() {
  const { subscription, isLoading, error, regenerate, isRegenerating } =
    useCalendarSubscription()
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success("Calendar link copied")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRegenerate = async () => {
    const confirmed = window.confirm(
      "Regenerate your calendar link? Calendars using the old link will stop updating until you re-subscribe with the new one.",
    )
    if (!confirmed) return

    const updated = await regenerate()
    if (updated) {
      toast.success("Calendar link regenerated")
    } else {
      toast.error("Could not regenerate the calendar link")
    }
  }

  return (
    <Card className="p-4 md:p-6">
      <div className="flex flex-col gap-1 items-start justify-center mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#020817]" />
          <h3 className="text-lg font-semibold text-[#020817]">Calendar Subscription</h3>
        </div>
        <p className="text-sm text-[#64748b]">
          Subscribe in Apple, Google, or Outlook Calendar to keep the events you’ve
          RSVP’d to in sync. Your calendar refreshes automatically.
        </p>
      </div>

      <div className="bg-[#f8fafc] rounded-lg p-3 md:p-4 space-y-4">
        {isLoading ? (
          <p className="text-sm text-[#64748b] text-center p-2">
            Loading your calendar link…
          </p>
        ) : error && !subscription ? (
          <p className="text-sm text-red-600 text-center p-2">{error}</p>
        ) : subscription ? (
          <>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
              <div className="w-full md:w-40 flex-shrink-0">
                <p className="text-sm text-[#020817] font-medium md:font-normal">
                  My RSVP’d events
                </p>
              </div>
              <div className="flex-1 relative w-full">
                <input
                  type="text"
                  value={subscription.rsvp_ics_url}
                  disabled
                  className="w-full px-3 py-2 pr-10 text-sm text-[#64748b] bg-[#ffffff] border border-[#e2e8f0] rounded-md cursor-default truncate"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(subscription.rsvp_ics_url)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-[#f1f5f9]"
                  aria-label="Copy calendar link"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-[#64748b]" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#64748b]" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <Button asChild className="w-full sm:w-auto">
                <a href={subscription.rsvp_webcal_url}>
                  <ExternalLink className="w-4 h-4" />
                  Subscribe
                </a>
              </Button>
              <Button
                variant="outline"
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="w-full sm:w-auto"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRegenerating ? "animate-spin" : ""}`}
                />
                {isRegenerating ? "Regenerating…" : "Regenerate link"}
              </Button>
            </div>

            <p className="text-xs text-[#94a3b8]">
              Treat this link like a password — anyone with it can see the events you’ve
              RSVP’d to. Shared it by mistake? Regenerate to revoke the old one.
            </p>
          </>
        ) : null}
      </div>
    </Card>
  )
}
