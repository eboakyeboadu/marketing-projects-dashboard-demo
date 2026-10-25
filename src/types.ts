export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timeAgo: string;
  likes?: number;
  replies?: Comment[];
}

export interface UserProfile {
  email: string;
  name: string;
  avatar: string;
  role: string;
  organization: string;
  location: string;
}


export interface Project {
  id: string;
  title: string;
  region: string;
  country: string;
  city?: string;
  hqManager?: string;
  localManager?: string;
  targetAudience: string;
  channels: string[];
  objective: string; // Goals & Objectives
  context: string;
  execution: string[];
  results: string[];
  nextSteps: string[];
  metrics: { label: string; value: string }[]; // Measurable metrics
  tags: string[];
  images: string[]; // Multiple screenshots or project visuals
  date: string; // Report date (YYYY-MM-DD)
  comments?: Comment[];
  upvotes?: number;
  downvotes?: number;
  creatorEmail?: string;
  lessons?: {
    whatWorked: string[];
    challenges: string[];
  };
}


