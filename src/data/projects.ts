import { Project } from '../types';

// SAMPLE DATA created for demonstration. All companies, people, and metrics
// are invented for demonstration and do not describe any real business.

export const projectsData: Project[] = [
  {
    id: "1",
    title: "Onboarding Video Series Relaunch",
    region: "EMEA",
    country: "Spain",
    city: "Madrid",
    hqManager: "Laura Bennett",
    localManager: "Carlos Mendez",
    targetAudience: "New users",
    channels: ["In-app", "YouTube", "Email"],
    objective: "Lift first-week activation by replacing text onboarding with a short localized video series.",
    context: "New-user drop-off in the first week was concentrated at the third onboarding screen, where a long text tutorial explained core features.",
    execution: [
      "Scripted and produced 6 short videos with local presenters",
      "Replaced the text tutorial with an in-app video carousel",
      "Added subtitles for accessibility and quieter autoplay defaults"
    ],
    results: [
      "First-week activation rose from 41% to 55% in eight weeks",
      "Support tickets tagged 'getting started' fell by a third"
    ],
    nextSteps: [
      "Extend the series to two more cities",
      "Test a 15-second cutdown for paid social"
    ],
    metrics: [
      { label: "Activation Lift", value: "+14pp" },
      { label: "Videos Produced", value: "6" },
      { label: "Support Tickets", value: "-33%" }
    ],
    tags: ["Onboarding", "Video", "Activation"],
    images: [
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800"
    ],
    date: "2026-08-14",
    comments: [],
    upvotes: 24,
    downvotes: 1,
    creatorEmail: "admin@example.com",
    lessons: {
      whatWorked: ["Local presenters outperformed dubbed versions in completion rate"],
      challenges: ["Coordinating subtitles across three vendors added a week"]
    }
  },
  {
    id: "2",
    title: "Campus Ambassador Pilot",
    region: "North America",
    country: "United States",
    city: "Austin",
    hqManager: "Priya Nair",
    localManager: "Jordan Lee",
    targetAudience: "Students",
    channels: ["Campus events", "Instagram", "Referral codes"],
    objective: "Test whether a paid student ambassador program can acquire users below paid-social CAC.",
    context: "Paid social CAC in the 18-24 segment had risen steadily, and organic referral was strongest on two university campuses.",
    execution: [
      "Recruited 12 ambassadors across two campuses",
      "Gave each a personal referral code and a monthly event budget",
      "Ran 8 pop-up events with product demos"
    ],
    results: [
      "Referral signups attributed to ambassadors came in 38% below paid-social CAC",
      "Two events sold out their demo slots within a day"
    ],
    nextSteps: [
      "Expand to four campuses next semester",
      "Build a self-serve ambassador dashboard"
    ],
    metrics: [
      { label: "CAC vs Paid Social", value: "-38%" },
      { label: "Ambassadors", value: "12" },
      { label: "Events", value: "8" }
    ],
    tags: ["Ambassador", "Referral", "Students"],
    images: [
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800"
    ],
    date: "2026-07-22",
    comments: [],
    upvotes: 31,
    downvotes: 2,
    creatorEmail: "admin@example.com",
    lessons: {
      whatWorked: ["Personal referral codes outperformed QR posters 4:1"],
      challenges: ["Ambassador churn mid-semester required a backup roster"]
    }
  },
  {
    id: "3",
    title: "Win-Back Email Journey Redesign",
    region: "APAC",
    country: "Australia",
    city: "Sydney",
    hqManager: "Laura Bennett",
    localManager: "Emma Wilson",
    targetAudience: "Lapsed users",
    channels: ["Email", "Push"],
    objective: "Recover lapsed users with a behavior-triggered email journey instead of a single generic blast.",
    context: "The existing win-back was one monthly email to everyone inactive 60+ days, with a flat 1.2% reactivation rate.",
    execution: [
      "Segmented lapsed users by last-used feature",
      "Wrote three journey variants tied to each segment's core use case",
      "Added a push fallback for email non-openers"
    ],
    results: [
      "Reactivation rose from 1.2% to 3.9% over two months",
      "Unsubscribe rate stayed flat, indicating the targeting was welcome"
    ],
    nextSteps: [
      "Localize the top-performing variant",
      "Test an incentive vs. no-incentive branch"
    ],
    metrics: [
      { label: "Reactivation Rate", value: "1.2% → 3.9%" },
      { label: "Variants", value: "3" },
      { label: "Unsubscribes", value: "flat" }
    ],
    tags: ["Email", "Retention", "Lifecycle"],
    images: [
      "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&q=80&w=800"
    ],
    date: "2026-06-30",
    comments: [],
    upvotes: 18,
    downvotes: 0,
    creatorEmail: "admin@example.com",
    lessons: {
      whatWorked: ["Segmenting by last-used feature beat segmenting by tenure"],
      challenges: ["Push fallback required new consent copy review"]
    }
  },
  {
    id: "4",
    title: "Retail Partner Co-Marketing Kit",
    region: "LATAM",
    country: "Mexico",
    city: "Mexico City",
    hqManager: "Priya Nair",
    localManager: "Sofia Herrera",
    targetAudience: "Retail partners",
    channels: ["Partner portal", "Print", "In-store"],
    objective: "Give retail partners a self-serve kit of approved co-marketing assets to cut custom design requests.",
    context: "The design team spent a third of its time on one-off partner asset requests with long turnaround times.",
    execution: [
      "Defined the 20 most-requested asset types",
      "Built a partner portal with locked-brand templates",
      "Ran a webinar series to onboard partners"
    ],
    results: [
      "Custom design requests dropped 55% in one quarter",
      "Partner-sourced campaign launches doubled"
    ],
    nextSteps: [
      "Add video templates to the kit",
      "Introduce seasonal asset packs"
    ],
    metrics: [
      { label: "Design Requests", value: "-55%" },
      { label: "Templates", value: "20" },
      { label: "Partner Launches", value: "2x" }
    ],
    tags: ["Partnerships", "Brand", "Self-serve"],
    images: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800"
    ],
    date: "2026-05-18",
    comments: [],
    upvotes: 27,
    downvotes: 1,
    creatorEmail: "admin@example.com",
    lessons: {
      whatWorked: ["Locked-brand templates removed the review bottleneck"],
      challenges: ["Print vendors needed a separate color-profile guide"]
    }
  }
];
