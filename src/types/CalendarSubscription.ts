export interface CalendarSubscription {
  /** Bearer secret embedded in the feed URL; revocable/regenerable. */
  token: string
  /** Plain HTTPS iCal feed URL of the user's RSVP'd events. */
  rsvp_ics_url: string
  /** Same feed as a webcal:// link for one-tap "Subscribe" in calendar apps. */
  rsvp_webcal_url: string
}
