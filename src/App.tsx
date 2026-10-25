import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Globe, 
  Sparkles, 
  Plus, 
  LayoutGrid, 
  BookOpen, 
  CheckCircle,
  HelpCircle,
  Megaphone,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Calendar,
  UploadCloud,
  ThumbsUp,
  ArrowRight,
  Users,
  Target,
  User,
  Shield,
  Star,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { projectsData as initialProjects } from './data/projects';
import { Project, UserProfile } from './types';

// Component Imports
import ProjectCard from './components/ProjectCard';
import ProjectDetailModal from './components/ProjectDetailModal';
import AddProjectModal from './components/AddProjectModal';
import ProfileSettingsModal from './components/ProfileSettingsModal';

const REGIONS_DATA = [
  {
    id: 'NORTH AMERICA',
    name: 'NORTH AMERICA',
    countries: ['United States', 'Canada']
  },
  {
    id: 'LATAM',
    name: 'LATAM',
    countries: ['Brazil', 'Colombia', 'Mexico', 'Peru']
  },
  {
    id: 'EMEA',
    name: 'EMEA',
    countries: ['Spain', 'United Kingdom', 'Germany', 'South Africa', 'UAE']
  },
  {
    id: 'APAC',
    name: 'APAC',
    countries: ['Australia', 'India', 'Japan', 'Singapore']
  }
];

const REGION_MAPPING: Record<string, string> = Object.fromEntries(
  REGIONS_DATA.flatMap((r) => r.countries.map((c) => [c.toUpperCase(), r.id]))
);

const normalizeCountryName = (name: string): string => {
  const upper = name.trim().toUpperCase();
  if (upper === 'KAZAKHSTAN' || upper === 'QAZAQSTAN') return 'Qazaqstan';
  if (upper === 'TURKEY' || upper === 'TURKIYE') return 'Turkiye';
  if (upper === 'COTE D\'IVOIRE' || upper === "CÔTE D'IVOIRE" || upper === 'COTE DIVOIRE') return "Côte d'Ivoire";
  if (upper === 'DR CONGO' || upper === 'CONGO') return "DR Congo";
  
  for (const reg of REGIONS_DATA) {
    for (const c of reg.countries) {
      if (c.toUpperCase() === upper) {
        return c;
      }
    }
  }
  return name.trim().charAt(0).toUpperCase() + name.trim().slice(1);
};

const getProjectRegion = (countryName: string, fallbackRegion?: string): string => {
  const norm = countryName.trim().toUpperCase();
  if (REGION_MAPPING[norm]) {
    return REGION_MAPPING[norm];
  }
  for (const key of Object.keys(REGION_MAPPING)) {
    if (norm.includes(key) || key.includes(norm)) {
      return REGION_MAPPING[key];
    }
  }
  if (fallbackRegion) {
    const rNorm = fallbackRegion.trim().toUpperCase();
    const match = REGIONS_DATA.find((r) => r.id === rNorm);
    if (match) return match.id;
    if (rNorm === 'LATIN AMERICA') return 'LATAM';
  }
  return 'NORTH AMERICA';
};

const getPlaceholderImage = (region: string, title: string): string => {
  const r = (region || "").toUpperCase();
  const t = (title || "").toLowerCase();
  
  if (t.includes("cricket") || t.includes("league") || t.includes("playoff") || t.includes("sport")) {
    return "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800";
  }
  if (t.includes("award") || t.includes("gala") || t.includes("celebrat") || t.includes("recogni")) {
    return "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800";
  }
  if (t.includes("contest") || t.includes("win") || t.includes("raffle")) {
    return "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=800";
  }
  if (t.includes("female") || t.includes("women")) {
    return "https://images.unsplash.com/photo-1596495578065-6e0763fa1141?auto=format&fit=crop&q=80&w=800";
  }
  if (t.includes("video") || t.includes("show") || t.includes("media") || t.includes("tiktok")) {
    return "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800";
  }

  if (r.includes("AFRICA")) {
    return "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=800";
  }
  if (r.includes("LATAM")) {
    return "https://images.unsplash.com/photo-1617469767053-d3b508a0d822?auto=format&fit=crop&q=80&w=800";
  }
  if (r.includes("MENAP")) {
    return "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800";
  }
  if (r.includes("CIS")) {
    return "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800";
  }
  
  return "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800";
};

const getDefaultProfile = (email: string): UserProfile => {
  if (email === 'admin@example.com') {
    return {
      email,
      name: 'Workspace Administrator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      role: 'Global Marketing Admin',
      organization: 'Global Brand & Marketing Tech',
      location: 'APAC HQ',
    };
  }
  if (email === 'marketing.lead@example.com') {
    return {
      email,
      name: 'Region Marketing Lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      role: 'Region Marketing Lead',
      organization: 'Commercial Growth Operations',
      location: 'Europe Central',
    };
  }
  
  const username = email.split('@')[0];
  const capitalizedName = username
    .split(/[\._]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
  
  return {
    email,
    name: capitalizedName || 'Simulated User',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    role: 'Campaign Partner',
    organization: 'External Agency Team',
    location: 'US West',
  };
};

export default function App() {
  // Modals Toggles State declared at top for early referencing in hooks
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Main Data State with LocalStorage Persistence
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('standard_marketing_projects');
    let loaded: Project[] = [];
    if (saved) {
      try {
        loaded = JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved projects, falling back to defaults", e);
        loaded = initialProjects;
      }
    } else {
      loaded = initialProjects;
    }
    
    // Pre-populate with upvotes and downvotes if they don't exist
    return loaded.map((p, idx) => ({
      ...p,
      upvotes: p.upvotes !== undefined ? p.upvotes : (15 - idx * 2 > 0 ? 15 - idx * 2 : Math.floor(Math.random() * 5) + 1),
      downvotes: p.downvotes !== undefined ? p.downvotes : Math.floor(Math.random() * 2),
    }));
  });

  // Save projects to localStorage whenever changed
  useEffect(() => {
    localStorage.setItem('standard_marketing_projects', JSON.stringify(projects));
  }, [projects]);

  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down'>>(() => {
    const saved = localStorage.getItem('standard_marketing_user_votes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  // Save user votes to localStorage whenever changed
  useEffect(() => {
    localStorage.setItem('standard_marketing_user_votes', JSON.stringify(userVotes));
  }, [userVotes]);

  const [currentUserEmail, setCurrentUserEmail] = useState<string>(() => {
    return localStorage.getItem('standard_marketing_current_user_email') || 'admin@example.com';
  });

  useEffect(() => {
    localStorage.setItem('standard_marketing_current_user_email', currentUserEmail);
  }, [currentUserEmail]);

  // User Profiles State with LocalStorage Persistence
  const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>(() => {
    const saved = localStorage.getItem('standard_marketing_user_profiles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('standard_marketing_user_profiles', JSON.stringify(userProfiles));
  }, [userProfiles]);

  // Compute active user profile dynamically based on active email
  const currentUserProfile = useMemo<UserProfile>(() => {
    if (!userProfiles[currentUserEmail]) {
      return getDefaultProfile(currentUserEmail);
    }
    return userProfiles[currentUserEmail];
  }, [userProfiles, currentUserEmail]);

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUserProfiles(prev => ({
      ...prev,
      [currentUserEmail]: {
        ...(prev[currentUserEmail] || getDefaultProfile(currentUserEmail)),
        ...updated
      }
    }));
  };

  // Favorites State with LocalStorage Persistence
  const [favorites, setFavorites] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('standard_marketing_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('standard_marketing_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Handle initial load URL parameter to deep-link straight to a project
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('project');
    if (projectId && projects.length > 0) {
      const proj = projects.find(p => p.id === projectId);
      if (proj) {
        setSelectedProject(proj);
      }
    }
  }, [projects]);

  // Sync selectedProject state with browser URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (selectedProject) {
      if (params.get('project') !== selectedProject.id) {
        params.set('project', selectedProject.id);
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({ projectId: selectedProject.id }, '', newUrl);
      }
    } else {
      if (params.has('project')) {
        params.delete('project');
        const searchStr = params.toString();
        const newUrl = searchStr ? `${window.location.pathname}?${searchStr}` : window.location.pathname;
        window.history.pushState(null, '', newUrl);
      }
    }
  }, [selectedProject]);

  // Listen to browser forward/back button clicks (popstate events)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const projectId = params.get('project');
      if (projectId) {
        const proj = projects.find(p => p.id === projectId);
        if (proj) {
          setSelectedProject(proj);
          return;
        }
      }
      setSelectedProject(null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [projects]);

  const toggleFavorite = (projectId: string) => {
    setFavorites(prev => {
      const next = { ...prev };
      if (next[projectId]) {
        delete next[projectId];
        triggerToast('Removed from Favorites');
      } else {
        next[projectId] = true;
        triggerToast('Added to Favorites', {
          label: 'View Favorites',
          onClick: () => {
            setDashboardTab('favorites');
            setSelectedProject(null);
            const el = document.getElementById('currently-viewing');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }
        });
      }
      return next;
    });
  };

  const [dashboardTab, setDashboardTab] = useState<'all' | 'favorites' | 'my-uploads'>('all');

  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  
  // Real-time search suggestions
  const suggestedProjects = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return projects.filter(project => {
      return (
        project.title.toLowerCase().includes(term) || 
        normalizeCountryName(project.country).toLowerCase().includes(term) ||
        (project.city && project.city.toLowerCase().includes(term)) ||
        project.objective.toLowerCase().includes(term) ||
        project.context.toLowerCase().includes(term) ||
        project.targetAudience.toLowerCase().includes(term) ||
        (project.hqManager && project.hqManager.toLowerCase().includes(term)) ||
        (project.localManager && project.localManager.toLowerCase().includes(term))
      );
    });
  }, [searchTerm, projects]);

  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [dateRangePreset, setDateRangePreset] = useState<'All' | 'ThisMonth' | 'Last30' | 'Last90' | 'Custom'>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  
  // Slide state for Featured Dashboards
  const [activeFeaturedIdx, setActiveFeaturedIdx] = useState(0);

  // User switcher toggle state
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Accordion Expand/Collapse State for Regions
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Modals Toggles
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalMode, setAddModalMode] = useState<'manual' | 'import'>('manual');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [successToast, setSuccessToast] = useState<{ message: string; action?: { label: string; onClick: () => void } } | null>(null);
  const toastTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Compute trending / featured projects (sorted by net upvotes)
  const featuredProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => ((b.upvotes ?? 0) - (b.downvotes ?? 0)) - ((a.upvotes ?? 0) - (a.downvotes ?? 0)))
      .slice(0, 5);
  }, [projects]);

  // Compute filtering dimensions
  const countries = useMemo(() => {
    return Array.from(new Set(projects.map(p => normalizeCountryName(p.country)))).sort();
  }, [projects]);

  const channels = useMemo(() => {
    const allChannels = projects.flatMap(p => p.channels);
    const list = Array.from(new Set(allChannels));
    return ['All', ...list.sort()];
  }, [projects]);

  const authors = useMemo(() => {
    const list: string[] = [];
    projects.forEach(p => {
      if (p.hqManager && !list.includes(p.hqManager)) {
        list.push(p.hqManager);
      }
      if (p.localManager && !list.includes(p.localManager)) {
        list.push(p.localManager);
      }
    });
    return ['All', ...list.sort()];
  }, [projects]);

  // Group countries under normalized regions dynamically
  const regionalGroups = useMemo(() => {
    return REGIONS_DATA.map(region => {
      const regionProjects = projects.filter(p => getProjectRegion(p.country, p.region) === region.id);
      const projectCountries = Array.from(new Set(regionProjects.map(p => normalizeCountryName(p.country))));
      const combinedCountries = Array.from(new Set([...region.countries, ...projectCountries])).sort();
      
      return {
        id: region.id,
        name: region.name,
        countries: combinedCountries
      };
    });
  }, [projects]);

  // Filter Projects logic
  const filteredProjects = useMemo(() => {
    const list = projects.filter(project => {
      const matchesSearch = 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        normalizeCountryName(project.country).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.city && project.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        project.objective.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.context.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.targetAudience.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.hqManager && project.hqManager.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.localManager && project.localManager.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const pRegion = getProjectRegion(project.country, project.region);
      const matchesRegionAndCountry = 
        (selectedRegions.length === 0 && selectedCountries.length === 0) ||
        (selectedRegions.includes(pRegion) && selectedCountries.length === 0) ||
        (selectedCountries.includes(normalizeCountryName(project.country)));
        
      const matchesChannel = selectedChannels.length === 0 || project.channels.some(c => selectedChannels.includes(c));
      const matchesAuthor = selectedAuthors.length === 0 || 
        (project.hqManager && selectedAuthors.includes(project.hqManager)) || 
        (project.localManager && selectedAuthors.includes(project.localManager));
 
      let matchesDate = true;
      if (project.date) {
        const pTime = new Date(project.date).getTime();
        const now = new Date();
        now.setHours(23, 59, 59, 999); // end of today
        
        if (dateRangePreset === 'ThisMonth') {
          const start = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
          const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
          matchesDate = pTime >= start && pTime <= end;
        } else if (dateRangePreset === 'Last30') {
          const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).setHours(0,0,0,0);
          matchesDate = pTime >= start && pTime <= now.getTime();
        } else if (dateRangePreset === 'Last90') {
          const start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).setHours(0,0,0,0);
          matchesDate = pTime >= start && pTime <= now.getTime();
        } else if (dateRangePreset === 'Custom') {
          let isAfterStart = true;
          let isBeforeEnd = true;
          if (startDate) {
            isAfterStart = pTime >= new Date(startDate).setHours(0,0,0,0);
          }
          if (endDate) {
            isBeforeEnd = pTime <= new Date(endDate).setHours(23,59,59,999);
          }
          matchesDate = isAfterStart && isBeforeEnd;
        }
      }
 
      let matchesTab = true;
      if (dashboardTab === 'favorites') {
        matchesTab = !!favorites[project.id];
      } else if (dashboardTab === 'my-uploads') {
        matchesTab = project.creatorEmail === currentUserEmail;
      }
 
      return matchesSearch && matchesRegionAndCountry && matchesChannel && matchesDate && matchesAuthor && matchesTab;
    });

    return [...list].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [searchTerm, selectedRegions, selectedCountries, selectedChannels, selectedAuthors, dateRangePreset, startDate, endDate, projects, sortBy, dashboardTab, favorites, currentUserEmail]);

  const handleAddProject = (newProject: Project) => {
    const projectWithCreator = {
      ...newProject,
      creatorEmail: currentUserEmail
    };
    setProjects([projectWithCreator, ...projects]);
    setIsAddModalOpen(false);
    triggerToast(`"${newProject.title}" successfully added to dashboard!`);
  };

  const handleReplicateProject = (project: Project) => {
    triggerToast(`Project "${project.title}" added to your local workspace! Ready for replication.`);
    setSelectedProject(null);
  };

  const handleUpdateProject = (updated: Project) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    setSelectedProject(updated);
    setEditingProject(null);
    triggerToast(`"${updated.title}" successfully updated!`);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setSelectedProject(null);
    setEditingProject(null);
    triggerToast("Project was successfully deleted.");
  };

  const handleVote = (id: string, voteType: 'up' | 'down') => {
    let upDelta = 0;
    let downDelta = 0;
    const currentVote = userVotes[id];

    if (voteType === 'up') {
      if (currentVote === 'up') {
        // Toggle off
        upDelta = -1;
        setUserVotes(prev => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      } else if (currentVote === 'down') {
        // Switch from down to up
        upDelta = 1;
        downDelta = -1;
        setUserVotes(prev => ({ ...prev, [id]: 'up' }));
      } else {
        // First time upvote
        upDelta = 1;
        setUserVotes(prev => ({ ...prev, [id]: 'up' }));
      }
    } else {
      if (currentVote === 'down') {
        // Toggle off
        downDelta = -1;
        setUserVotes(prev => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      } else if (currentVote === 'up') {
        // Switch from up to down
        downDelta = 1;
        upDelta = -1;
        setUserVotes(prev => ({ ...prev, [id]: 'down' }));
      } else {
        // First time downvote
        downDelta = 1;
        setUserVotes(prev => ({ ...prev, [id]: 'down' }));
      }
    }

    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          upvotes: Math.max(0, (p.upvotes ?? 0) + upDelta),
          downvotes: Math.max(0, (p.downvotes ?? 0) + downDelta)
        };
      }
      return p;
    }));
    
    // Also update selectedProject in the detail modal if it is open
    setSelectedProject(prev => {
      if (prev && prev.id === id) {
        return {
          ...prev,
          upvotes: Math.max(0, (prev.upvotes ?? 0) + upDelta),
          downvotes: Math.max(0, (prev.downvotes ?? 0) + downDelta)
        };
      }
      return prev;
    });
  };

  const triggerToast = (msg: string, action?: { label: string; onClick: () => void }) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setSuccessToast({ message: msg, action });
    toastTimeoutRef.current = setTimeout(() => {
      setSuccessToast(null);
    }, action ? 6500 : 4000);
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] text-[#1E2022] font-sans transition-colors antialiased overflow-x-hidden">
      
      {/* Header */}
      <header className="bg-brand border-b border-brand-hover text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[4.5rem] py-2 flex flex-wrap lg:flex-nowrap items-center justify-between gap-x-4 gap-y-2">
          
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 flex-shrink-0 select-none">
            <div className="flex items-center space-x-2">
              <span className="text-white text-2xl font-black italic tracking-tighter uppercase font-display">DASHBOARD</span>
              <span className="h-5 w-px bg-white/20 self-center hidden xs:inline-block"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-white mt-0.5 hidden xs:inline-block bg-white/20 px-2.5 py-0.5 rounded-full">Marketing Hub</span>
            </div>
          </div>
          
          {/* Search Box */}
          <div className="flex-1 min-w-[160px] max-w-lg relative block">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-white/60" />
            </div>
            <input
              type="text"
              className="block w-full pl-9 pr-4 py-2 border border-white/20 rounded-full bg-white/15 hover:bg-white/20 focus:bg-white text-white focus:text-slate-950 placeholder-white/70 focus:placeholder-slate-400 sm:text-xs font-semibold focus:outline-none transition-all shadow-inner"
              placeholder="Search dashboards, objectives, mechanics, audiences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm.trim() !== '' && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSearchTerm('')} />
                <div className="absolute top-full left-0 right-0 mt-2 bg-white text-slate-900 rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-80 overflow-y-auto">
                  {suggestedProjects.length > 0 ? (
                    <div className="py-1">
                      <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-gray-100">
                        Suggested Dashboards ({suggestedProjects.length})
                      </div>
                      {suggestedProjects.map(project => (
                        <button
                          key={project.id}
                          onClick={() => {
                            setSelectedProject(project);
                            setSearchTerm('');
                          }}
                          className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center space-x-3 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer"
                        >
                          <img 
                            src={project.images[0] || getPlaceholderImage(project.region, project.title)} 
                            alt="" 
                            className="w-8 h-8 rounded-md object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-900 truncate">{project.title}</div>
                            <div className="flex items-center space-x-1.5 mt-0.5 text-xs text-slate-500 font-medium">
                              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-semibold text-slate-600 shrink-0">
                                {normalizeCountryName(project.country)}
                              </span>
                              <span className="truncate">{project.objective}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-xs font-bold text-slate-500">Nothing was found</p>
                      <p className="text-xs text-slate-400 mt-1">Try searching for other words, markets, or metrics.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Input Project Action */}
          <div className="flex flex-wrap items-center gap-2.5 sm:flex-nowrap sm:flex-shrink-0">
            {/* USER IDENTITY CONTROLLER */}
            <div className="relative">
              <button
                onClick={() => setIsUserSwitcherOpen(!isUserSwitcherOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white rounded-full text-xs font-bold transition-all cursor-pointer select-none active:scale-95"
                title={`Manage profile and simulation: ${currentUserEmail}`}
              >
                <img 
                  src={currentUserProfile.avatar} 
                  alt="" 
                  className="w-5 h-5 rounded-full object-cover shrink-0 border border-white/20"
                  referrerPolicy="no-referrer"
                />
                <span className="max-w-[120px] truncate">{currentUserProfile.name}</span>
                {currentUserEmail === 'admin@example.com' ? (
                  <span className="bg-yellow-400 text-slate-950 font-black px-1.5 py-0.5 rounded-full text-[9px] uppercase tracking-wide shrink-0">
                    👑 Admin
                  </span>
                ) : (
                  <span className="bg-slate-700 text-slate-100 font-bold px-1.5 py-0.5 rounded-full text-[9px] uppercase tracking-wide shrink-0">
                    User
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {isUserSwitcherOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUserSwitcherOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50 text-slate-900 animate-scaleUp">
                    {/* Active Profile Info */}
                    <div className="flex items-center space-x-2.5 pb-3 border-b border-gray-100">
                      <img 
                        src={currentUserProfile.avatar} 
                        alt="" 
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-black text-gray-900 truncate leading-tight">{currentUserProfile.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold truncate leading-none mt-1">{currentUserProfile.role}</p>
                        <p className="text-[10px] text-gray-500 truncate leading-none mt-0.5">{currentUserProfile.organization} • {currentUserProfile.location}</p>
                      </div>
                    </div>

                    {/* Customize Profile Trigger */}
                    <div className="py-2.5 border-b border-gray-100">
                      <button
                        onClick={() => {
                          setIsUserSwitcherOpen(false);
                          setIsProfileModalOpen(true);
                        }}
                        className="w-full flex items-center justify-center space-x-1.5 py-2 bg-brand/5 hover:bg-brand/10 border border-brand/15 hover:border-brand/35 text-brand rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span>Customize Profile Details</span>
                      </button>
                    </div>

                    {/* Presets switcher */}
                    <div className="py-3 space-y-2 border-b border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Simulation Presets</span>
                      <div className="space-y-1.5">
                        <button
                          onClick={() => {
                            setCurrentUserEmail('admin@example.com');
                            setIsUserSwitcherOpen(false);
                            triggerToast('Logged in as Workspace Administrator (admin@example.com)');
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between border transition-all cursor-pointer ${
                            currentUserEmail === 'admin@example.com'
                              ? 'bg-red-50 border-red-200 text-red-700 font-bold'
                              : 'border-transparent hover:bg-slate-50 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-[11px]">admin@example.com</span>
                            <span className="bg-yellow-100 text-yellow-800 text-[9px] font-black px-1.5 py-0.2 rounded uppercase shrink-0">Admin</span>
                          </div>
                          {currentUserEmail === 'admin@example.com' && <CheckCircle className="w-3.5 h-3.5 text-red-600" />}
                        </button>

                        <button
                          onClick={() => {
                            setCurrentUserEmail('marketing.lead@example.com');
                            setIsUserSwitcherOpen(false);
                            triggerToast('Logged in as Region Marketing Lead (marketing.lead@example.com)');
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between border transition-all cursor-pointer ${
                            currentUserEmail === 'marketing.lead@example.com'
                              ? 'bg-red-50 border-red-200 text-red-700 font-bold'
                              : 'border-transparent hover:bg-slate-50 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-[11px]">marketing.lead@example.com</span>
                            <span className="bg-slate-100 text-slate-800 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase shrink-0">User</span>
                          </div>
                          {currentUserEmail === 'marketing.lead@example.com' && <CheckCircle className="w-3.5 h-3.5 text-red-600" />}
                        </button>
                      </div>
                    </div>

                    {/* Custom Input */}
                    <div className="pt-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Simulate Custom Email</span>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          const customEmail = formData.get('customEmail')?.toString().trim();
                          if (customEmail) {
                            setCurrentUserEmail(customEmail);
                            setIsUserSwitcherOpen(false);
                            triggerToast(`Logged in as simulated user: ${customEmail}`);
                          }
                        }}
                        className="flex gap-2"
                      >
                        <input
                          type="email"
                          name="customEmail"
                          required
                          placeholder="partner@example.com"
                          defaultValue={currentUserEmail !== 'admin@example.com' && currentUserEmail !== 'marketing.lead@example.com' ? currentUserEmail : ''}
                          className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-lg text-xs hover:bg-black transition-colors cursor-pointer"
                        >
                          Set
                        </button>
                      </form>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => {
                setAddModalMode('manual');
                setIsAddModalOpen(true);
              }}
              className="flex items-center space-x-1.5 px-4 py-2 border border-white/30 hover:bg-white/10 text-white rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95 font-display"
              title="Enter details manually from scratch"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>Add Project</span>
            </button>
            <button
              onClick={() => {
                setAddModalMode('import');
                setIsAddModalOpen(true);
              }}
              className="flex items-center space-x-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-brand rounded-full text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-md font-display"
              title="Import a presentation slide or PDF document via AI assistant"
            >
              <UploadCloud className="w-3.5 h-3.5 text-brand shrink-0" />
              <span>Import Project</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Header Section containing both branding & featured dashboards */}
      <section className="bg-[#090C15] text-white border-b border-slate-950 relative overflow-hidden flex items-center">
        {/* Immersive background decoration recreating the red neon light tube/container wall effect from the screenshot */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#090C15] via-[#090C15]/90 to-transparent z-1 bg-no-repeat" />
        
        {/* The Red Container vertical light columns styling from the screenshot */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-[60%] opacity-25 lg:opacity-40 pointer-events-none mix-blend-screen select-none">
          {/* Subtle overlay photo of dynamic city life/industrial architecture for depth */}
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=1200')` }} />
          {/* Neon Light Tubes overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090C15] via-transparent to-[#090C15]" />
          <div className="absolute inset-y-0 right-10 left-10 flex justify-between opacity-70">
            <div className="w-1.5 h-full bg-gradient-to-b from-red-600/10 via-red-500/80 to-red-600/10 blur-[1px]" />
            <div className="w-1.5 h-full bg-gradient-to-b from-red-600/10 via-red-500/80 to-red-600/10 blur-[1px] hidden sm:block" />
            <div className="w-1.5 h-full bg-gradient-to-b from-red-600/10 via-red-500/80 to-red-600/10 blur-[1px]" />
            <div className="w-1.5 h-full bg-gradient-to-b from-red-600/10 via-red-500/80 to-red-600/10 blur-[1px] hidden md:block" />
            <div className="w-1.5 h-full bg-gradient-to-b from-red-600/10 via-red-500/80 to-red-600/10 blur-[1px]" />
            <div className="w-1.5 h-full bg-gradient-to-b from-red-600/10 via-red-500/80 to-red-600/10 blur-[1px] hidden lg:block" />
            <div className="w-1.5 h-full bg-gradient-to-b from-red-600/10 via-red-500/80 to-red-600/10 blur-[1px]" />
          </div>
          {/* Ambient red volumetric glow */}
          <div className="absolute right-0 top-1/4 w-[350px] h-[350px] bg-red-600/30 rounded-full blur-[110px]" />
          <div className="absolute left-1/3 bottom-10 w-[250px] h-[250px] bg-red-600/20 rounded-full blur-[90px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Left side: Hero branding copy */}
            <div className="col-span-1 lg:col-span-5 space-y-4 text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-3.5xl font-extrabold tracking-tight leading-[1.1] text-white font-display">
                Share Your Marketing Projects & Explore Others Work
              </h2>

              {/* Added premium action links mimicking the official buttons */}
              <div className="pt-2 flex flex-wrap gap-2">
                <a 
                  href="#currently-viewing" 
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-lg shadow-brand/20 font-display"
                >
                  Explore Dashboards
                </a>
              </div>
            </div>

            {/* Right side: Seamless Featured Dashboards slider */}
            <div className="col-span-1 lg:col-span-7 bg-white/5 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-white/10 text-slate-100 text-[11px] font-extrabold uppercase tracking-widest rounded-full border border-white/20">
                    ★ FEATURED BEST PRACTICES
                  </span>
                  <h3 className="text-sm font-extrabold text-white mt-0.5 tracking-tight">
                    Trending
                  </h3>
                </div>
                
                {/* Slider Arrows */}
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => {
                      setActiveFeaturedIdx(prev => prev > 0 ? prev - 1 : featuredProjects.length - 1);
                    }}
                    className="w-7 h-7 rounded bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => {
                      setActiveFeaturedIdx(prev => (prev + 1) % featuredProjects.length);
                    }}
                    className="w-7 h-7 rounded bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Slider Grid View (displays 2 cards on desktop, 1 on mobile) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Card 1 */}
                {(() => {
                  const project = featuredProjects[activeFeaturedIdx];
                  if (!project) return null;
                  const initialsHq = project.hqManager ? project.hqManager.split(' ').map(n => n[0]).join('') : 'HQ';
                  const initialsLocal = project.localManager ? project.localManager.split(' ').map(n => n[0]).join('') : 'LM';
                  
                  return (
                    <div 
                      onClick={() => setSelectedProject(project)}
                      className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl p-3.5 flex flex-col justify-between h-[135px] relative overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer text-left"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-slate-300 text-[11px] font-black tracking-wider uppercase">
                            {project.country.toUpperCase()} • {project.region}
                          </span>
                          
                          {/* Upvote score badge */}
                          <span className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded text-[11px] text-white font-bold flex items-center gap-0.5">
                            <ThumbsUp className="w-2.5 h-2.5 text-slate-300" />
                            <span>{((project.upvotes ?? 0) - (project.downvotes ?? 0))} Net</span>
                          </span>
                        </div>
                        
                        <h3 className="text-white text-xs font-extrabold leading-tight line-clamp-1 mb-1 group-hover:text-white transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-slate-300 text-xs line-clamp-2 leading-snug">
                          {project.context}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-1.5 border-t border-white/10">
                        {/* Avatars stacked */}
                        <div className="flex items-center space-x-1.5">
                          <div className="flex -space-x-1">
                            {project.hqManager && (
                              <div className="w-5 h-5 rounded-full bg-slate-250 border border-slate-900 flex items-center justify-center text-[10px] font-black text-slate-900 font-mono" title={`HQ Lead: ${project.hqManager}`}>
                                {initialsHq}
                              </div>
                            )}
                            {project.localManager && (
                              <div className="w-5 h-5 rounded-full bg-slate-700 border border-slate-900 flex items-center justify-center text-[10px] font-black text-slate-100 font-mono" title={`Local Lead: ${project.localManager}`}>
                                {initialsLocal}
                              </div>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-bold">
                            {project.hqManager && project.localManager ? '2 Leads' : '1 Lead'}
                          </span>
                        </div>
                        
                        {/* Arrow right indicator */}
                        <div className="text-slate-300 group-hover:text-white transform group-hover:translate-x-1 transition-all">
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Card 2 */}
                {(() => {
                  const nextIdx = (activeFeaturedIdx + 1) % featuredProjects.length;
                  if (featuredProjects.length <= 1 || nextIdx === activeFeaturedIdx) return null;
                  const project = featuredProjects[nextIdx];
                  const initialsHq = project.hqManager ? project.hqManager.split(' ').map(n => n[0]).join('') : 'HQ';
                  const initialsLocal = project.localManager ? project.localManager.split(' ').map(n => n[0]).join('') : 'LM';

                  return (
                    <div 
                      onClick={() => setSelectedProject(project)}
                      className="hidden md:flex bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl p-3.5 flex-col justify-between h-[135px] relative overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer text-left"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-slate-300 text-[11px] font-black tracking-wider uppercase">
                            {project.country.toUpperCase()} • {project.region}
                          </span>
                          
                          {/* Upvote score badge */}
                          <span className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded text-[11px] text-white font-bold flex items-center gap-0.5">
                            <ThumbsUp className="w-2.5 h-2.5 text-slate-300" />
                            <span>{((project.upvotes ?? 0) - (project.downvotes ?? 0))} Net</span>
                          </span>
                        </div>
                        
                        <h3 className="text-white text-xs font-extrabold leading-tight line-clamp-1 mb-1 group-hover:text-white transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-slate-300 text-xs line-clamp-2 leading-snug">
                          {project.context}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-1.5 border-t border-white/10">
                        {/* Avatars stacked */}
                        <div className="flex items-center space-x-1.5">
                          <div className="flex -space-x-1">
                            {project.hqManager && (
                              <div className="w-5 h-5 rounded-full bg-slate-250 border border-slate-900 flex items-center justify-center text-[10px] font-black text-slate-900 font-mono" title={`HQ Lead: ${project.hqManager}`}>
                                {initialsHq}
                              </div>
                            )}
                            {project.localManager && (
                              <div className="w-5 h-5 rounded-full bg-slate-700 border border-slate-900 flex items-center justify-center text-[10px] font-black text-slate-100 font-mono" title={`Local Lead: ${project.localManager}`}>
                                {initialsLocal}
                              </div>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-bold">
                            {project.hqManager && project.localManager ? '2 Leads' : '1 Lead'}
                          </span>
                        </div>
                        
                        {/* Arrow right indicator */}
                        <div className="text-slate-300 group-hover:text-white transform group-hover:translate-x-1 transition-all">
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mobile Search block */}
        <div className="hidden mb-6 relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4.5 w-4.5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-red-500/20"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm.trim() !== '' && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setSearchTerm('')} />
              <div className="absolute top-full left-0 right-0 mt-2 bg-white text-slate-900 rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-80 overflow-y-auto">
                {suggestedProjects.length > 0 ? (
                  <div className="py-1">
                    <div className="px-3.5 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-gray-100">
                      Suggested Dashboards ({suggestedProjects.length})
                    </div>
                    {suggestedProjects.map(project => (
                      <button
                        key={project.id}
                        onClick={() => {
                          setSelectedProject(project);
                          setSearchTerm('');
                        }}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center space-x-3 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer"
                      >
                        <img 
                          src={project.images[0] || getPlaceholderImage(project.region, project.title)} 
                          alt="" 
                          className="w-8 h-8 rounded-md object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-900 truncate">{project.title}</div>
                          <div className="flex items-center space-x-1.5 mt-0.5 text-xs text-slate-500 font-medium">
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-semibold text-slate-600 shrink-0">
                              {normalizeCountryName(project.country)}
                            </span>
                            <span className="truncate">{project.objective}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-xs font-bold text-slate-500">Nothing was found</p>
                    <p className="text-xs text-slate-400 mt-1">Try searching for other words, markets, or metrics.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Toggle Filters Button for Mobile/Tablet */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand" />
              <span>Filters</span>
              {(selectedRegions.length > 0 || selectedCountries.length > 0 || selectedChannels.length > 0 || selectedAuthors.length > 0 || dateRangePreset !== 'All') && (
                <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-brand" />
              )}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showMobileFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start w-full pb-4">
          
          {/* Sidebar Navigation Filters */}
          <aside className={`${showMobileFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0 space-y-4 sm:space-y-6`}>
            
            {/* Country Markets Filter Card */}
            <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-gray-200 shadow-xs">
              <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-gray-100">
                <Target className="w-4.5 h-4.5 text-brand" />
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider font-display">
                  Active Markets
                </h3>
              </div>
              
              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                {/* All Markets Button */}
                <button
                  onClick={() => {
                    setExpandedRegion(null);
                    setSelectedRegions([]);
                    setSelectedCountries([]);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    selectedRegions.length === 0 && selectedCountries.length === 0
                      ? 'bg-brand border-brand text-white font-bold shadow-sm'
                      : 'bg-slate-50 border-gray-100 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    <span>All Global Markets</span>
                  </span>
                  <span className={`px-2 py-0.5 text-[11px] rounded-md font-bold ${
                    selectedRegions.length === 0 && selectedCountries.length === 0
                      ? 'bg-slate-950/20 text-slate-100'
                      : 'bg-gray-200 text-gray-600'
                   }`}>
                    {projects.length}
                  </span>
                </button>

                {/* Grouped Regions and Countries */}
                {regionalGroups.map(group => {
                  const regionProjectsCount = projects.filter(p => getProjectRegion(p.country, p.region) === group.id).length;
                  const isRegionExpanded = expandedRegion === group.id;
                  const isRegionActive = selectedRegions.includes(group.id);

                  return (
                    <div key={group.id} className="space-y-1">
                      {/* Region Header Button */}
                      <button
                        onClick={() => {
                          if (!isRegionExpanded) {
                            setExpandedRegion(group.id);
                          } else {
                            setExpandedRegion(null);
                          }
                          setSelectedRegions(prev => 
                            prev.includes(group.id) ? prev.filter(r => r !== group.id) : [...prev, group.id]
                          );
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-black tracking-wide uppercase transition-all border ${
                          isRegionActive
                            ? 'text-slate-900 bg-slate-100 border-slate-200 font-extrabold shadow-2xs'
                            : 'text-gray-900 bg-transparent border-transparent hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {isRegionExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          )}
                          <span className="truncate text-left">{group.name}</span>
                        </span>
                        <span className="text-[11px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md font-bold">
                          {regionProjectsCount}
                        </span>
                      </button>

                      {/* Animated Collapsible Countries List */}
                      <AnimatePresence initial={false}>
                        {isRegionExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="overflow-hidden pl-3.5 space-y-1 border-l border-slate-200 ml-3.5 mt-1"
                          >
                            {group.countries.map(country => {
                              const countryCount = projects.filter(p => normalizeCountryName(p.country) === country).length;
                              const isCountryActive = selectedCountries.includes(country);

                              return (
                                <button
                                  key={country}
                                  onClick={() => setSelectedCountries(prev => 
                                    prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
                                  )}
                                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                                    isCountryActive
                                      ? 'bg-slate-100 text-slate-900 font-extrabold shadow-2xs'
                                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80'
                                  }`}
                                >
                                  <span className="truncate">{country}</span>
                                  <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-bold ${
                                    isCountryActive 
                                      ? 'bg-slate-200 text-slate-800 font-bold' 
                                      : countryCount > 0 
                                        ? 'bg-slate-100 text-slate-600' 
                                        : 'bg-slate-50 text-slate-300'
                                  }`}>
                                    {countryCount}
                                  </span>
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Channels Filter Card */}
            <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-gray-200 shadow-xs">
              <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-gray-100">
                <Filter className="w-4.5 h-4.5 text-brand" />
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-display">
                  Filter by Channels
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedChannels([])}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                    selectedChannels.length === 0
                      ? 'bg-brand border-brand text-white font-bold shadow-sm'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All
                </button>
                {channels.filter(c => c !== 'All').map(channel => (
                  <button
                    key={channel}
                    onClick={() => setSelectedChannels(prev => 
                      prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]
                    )}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                      selectedChannels.includes(channel)
                        ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-sm'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {channel}
                  </button>
                ))}
              </div>
            </div>

            {/* Authors Filter Card */}
            <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-gray-200 shadow-xs">
              <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-gray-100">
                <Users className="w-4.5 h-4.5 text-brand" />
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-display">
                  Filter by Author
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto">
                <button
                  onClick={() => setSelectedAuthors([])}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                    selectedAuthors.length === 0
                      ? 'bg-brand border-brand text-white font-bold shadow-sm'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Authors
                </button>
                {authors.filter(a => a !== 'All').map(author => (
                  <button
                    key={author}
                    onClick={() => setSelectedAuthors(prev => 
                      prev.includes(author) ? prev.filter(a => a !== author) : [...prev, author]
                    )}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                      selectedAuthors.includes(author)
                        ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-sm'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {author}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range Filter Card */}
            <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                <Calendar className="w-4.5 h-4.5 text-brand" />
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-display">
                  Filter by Date Range
                </h3>
              </div>

              {/* Preset Buttons Grid */}
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setDateRangePreset('All')}
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold text-center border transition-all ${
                    dateRangePreset === 'All'
                      ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-2xs'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Dates
                </button>
                <button
                  onClick={() => setDateRangePreset('ThisMonth')}
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold text-center border transition-all ${
                    dateRangePreset === 'ThisMonth'
                      ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-2xs'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  This Month
                </button>
                <button
                  onClick={() => setDateRangePreset('Last30')}
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold text-center border transition-all ${
                    dateRangePreset === 'Last30'
                      ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-2xs'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Last 30 Days
                </button>
                <button
                  onClick={() => setDateRangePreset('Last90')}
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold text-center border transition-all ${
                    dateRangePreset === 'Last90'
                      ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-2xs'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Last 90 Days
                </button>
              </div>

              {/* Custom Selector Toggle */}
              <button
                onClick={() => {
                  setDateRangePreset('Custom');
                  // Set defaults if empty
                  if (!startDate) {
                    const past30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                    setStartDate(past30.toISOString().split('T')[0]);
                  }
                  if (!endDate) {
                    setEndDate(new Date().toISOString().split('T')[0]);
                  }
                }}
                className={`w-full px-3 py-1.5 rounded-lg text-xs font-semibold text-center border transition-all ${
                  dateRangePreset === 'Custom'
                    ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-2xs'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Custom Range...
              </button>

              {/* Custom Date Inputs */}
              <AnimatePresence initial={false}>
                {dateRangePreset === 'Custom' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden space-y-2.5 pt-1.5"
                  >
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Start Date</label>
                      <input
                        type="date"
                        className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-500/20 focus:border-red-500 bg-white"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">End Date</label>
                      <input
                        type="date"
                        className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-500/20 focus:border-red-500 bg-white"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Stats overview of repository */}
            <div className="bg-slate-900 text-slate-100 p-3.5 sm:p-5 rounded-2xl border border-slate-800 shadow-xs relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-5 text-white font-black text-9xl">
                P
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Sync Statistics</h4>
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Projects:</span>
                  <span className="font-bold text-white">{projects.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Active Markets:</span>
                  <span className="font-bold text-white">{countries.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Avg Metrics/Project:</span>
                  <span className="font-bold text-white">3.4</span>
                </div>
              </div>
            </div>

          </aside>

          {/* Projects Listing Grid */}
          <div className="w-full flex-1 min-w-0">
            
            {/* Dashboard Workspace Views Tab Bar */}
            <div className="flex border-b border-gray-200 mb-6 gap-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setDashboardTab('all')}
                className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 font-display flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  dashboardTab === 'all'
                    ? 'border-brand text-brand'
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>All</span>
              </button>
              
              <button
                onClick={() => setDashboardTab('favorites')}
                className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 font-display flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  dashboardTab === 'favorites'
                    ? 'border-brand text-brand'
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>My Favorites ({Object.keys(favorites).length})</span>
              </button>
              
              <button
                onClick={() => setDashboardTab('my-uploads')}
                className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 font-display flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  dashboardTab === 'my-uploads'
                    ? 'border-brand text-brand'
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <UploadCloud className="w-4 h-4" />
                <span>My Uploads ({projects.filter(p => p.creatorEmail === currentUserEmail).length})</span>
              </button>
            </div>
            
            {/* Filter Title Bar */}
            <div id="currently-viewing" className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mb-0.5 font-display">Currently Viewing</span>
                <div className="flex items-center space-x-2 text-xl font-bold text-gray-900 font-display">
                  <Target className="w-5 h-5 text-brand" />
                  <span>
                    {selectedCountries.length > 0 
                      ? selectedCountries.join(', ')
                      : selectedRegions.length > 0 
                        ? `${selectedRegions.join(', ')} (All Markets)` 
                        : 'All Markets'}
                  </span>
                  {selectedChannels.length > 0 && (
                    <span className="text-slate-400 font-normal text-base"> / {selectedChannels.join(', ')} channel</span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3.5 self-start sm:self-center">
                {/* Sorting Select Option */}
                <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 shadow-2xs">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                    className="text-xs font-bold bg-transparent border-none text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>

                <div className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-2 rounded-xl">
                  {filteredProjects.length} standardized projects matching
                </div>
              </div>
            </div>

            {/* Core Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProjectCard
                      project={project}
                      // When the user clicks the card, we trigger details modal
                      onViewDetails={() => setSelectedProject(project)}
                      onVote={handleVote}
                      userVote={userVotes[project.id]}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* No Results Fallback */}
              {filteredProjects.length === 0 && (
                <div className="col-span-full bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-xs">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-800 mx-auto mb-4">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">No Dashboard Projects Found</h3>
                  <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
                    Try adjusting your filters, searching for alternate keywords, or log a new project for this market.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedRegions([]);
                      setSelectedCountries([]);
                      setSelectedChannels([]);
                      setDateRangePreset('All');
                      setSelectedAuthors([]);
                    }}
                    className="mt-5 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
                  >
                    Clear Filter Selection
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Dashboard Submission Modal Form */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddProjectModal
            onClose={() => setIsAddModalOpen(false)}
            onAddProject={handleAddProject}
            existingCountries={Array.from(new Set(initialProjects.map(p => p.country)))}
            initialMode={addModalMode}
          />
        )}
      </AnimatePresence>

      {/* Dashboard Edit Modal Form */}
      <AnimatePresence>
        {editingProject && (
          <AddProjectModal
            onClose={() => {
              setSelectedProject(editingProject);
              setEditingProject(null);
            }}
            onAddProject={handleAddProject}
            onUpdateProject={handleUpdateProject}
            existingCountries={Array.from(new Set(initialProjects.map(p => p.country)))}
            initialMode="manual"
            projectToEdit={editingProject}
          />
        )}
      </AnimatePresence>

      {/* User Profile Settings Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <ProfileSettingsModal
            profile={currentUserProfile}
            onClose={() => setIsProfileModalOpen(false)}
            onSave={(updated) => {
              updateProfile(updated);
              triggerToast('Successfully updated profile details!');
            }}
          />
        )}
      </AnimatePresence>

      {/* Dashboard Detailed Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onReplicate={() => handleReplicateProject(selectedProject)}
            onUpdateProject={handleUpdateProject}
            onVote={handleVote}
            userVote={userVotes[selectedProject.id]}
            onEdit={() => {
              setEditingProject(selectedProject);
              setSelectedProject(null);
            }}
            onDelete={handleDeleteProject}
            canEdit={currentUserEmail === 'admin@example.com' || selectedProject.creatorEmail === currentUserEmail}
            isFavorite={!!favorites[selectedProject.id]}
            onToggleFavorite={toggleFavorite}
            currentUserProfile={currentUserProfile}
          />
        )}
      </AnimatePresence>

      {/* Success Toast System */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm bg-gray-900 text-white p-4 rounded-xl shadow-2xl border border-gray-800 flex items-start space-x-3.5"
          >
            <div className="p-1 bg-green-500 rounded-full text-white mt-0.5 shrink-0">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className="w-full flex-1 min-w-0">
              <h5 className="font-bold text-sm">Action Complete</h5>
              <p className="text-xs text-gray-400 mt-1">{successToast.message}</p>
              {successToast.action && (
                <button
                  onClick={() => {
                    successToast.action?.onClick();
                    setSuccessToast(null);
                  }}
                  className="mt-2.5 px-3 py-1.5 bg-brand text-white font-bold text-[10px] uppercase tracking-wider rounded-md hover:bg-brand-hover active:scale-95 transition-all flex items-center gap-1 cursor-pointer select-none"
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{successToast.action.label}</span>
                </button>
              )}
            </div>
            <button
              onClick={() => setSuccessToast(null)}
              className="text-gray-500 hover:text-white transition-colors p-0.5 rounded cursor-pointer shrink-0"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer id="dashboard-footer" className="bg-slate-950 text-slate-400 border-t border-slate-900 mt-16 py-6 relative z-10 w-full select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center space-y-1.5">
          <p className="text-xs font-black text-white uppercase tracking-wider sm:whitespace-nowrap">
            Global Dashboard • Unified Repository for Cross-Border Marketing Project Optimization
          </p>
          <p className="text-xs text-slate-500 font-medium tracking-normal sm:whitespace-nowrap">
            Standardizing operational checklists, performance metrics, and target audience mechanics for collaborative success.
          </p>
        </div>
      </footer>

    </div>
  );
}

