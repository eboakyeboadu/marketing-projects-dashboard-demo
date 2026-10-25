import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Plus, 
  Trash2, 
  Sparkles, 
  Globe, 
  User, 
  ListTodo, 
  Target, 
  Compass, 
  TrendingUp, 
  Image as ImageIcon,
  UploadCloud,
  HelpCircle,
  Calendar,
  FileText,
  CheckCircle2,
  Loader2,
  ArrowRight,
  FileSpreadsheet,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Play
} from 'lucide-react';
import { Project } from '../types';
import { isVideoUrl } from './ProjectDetailModal';

interface AddProjectModalProps {
  onClose: () => void;
  onAddProject: (newProject: Project) => void;
  onUpdateProject?: (updatedProject: Project) => void;
  existingCountries: string[];
  initialMode?: 'manual' | 'import';
  projectToEdit?: Project;
}

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

function getFallbackLessons(projectId: string): { whatWorked: string[]; challenges: string[] } {
  const data: Record<string, { whatWorked: string[]; challenges: string[] }> = {
    "1": {
      whatWorked: [
        "Local presenters outperformed dubbed versions in completion rate",
        "Short chapters kept viewers past the third onboarding screen",
        "Subtitles lifted completion among viewers with sound off"
      ],
      challenges: [
        "Coordinating subtitles across vendors added a week",
        "Video hosting costs rose faster than planned",
        "Older app versions could not play the in-app carousel"
      ]
    },
    "2": {
      whatWorked: [
        "Student ambassadors with a clear weekly brief produced the best referrals",
        "Simple referral codes were easier to share than links",
        "Short campus events beat online-only promotion"
      ],
      challenges: [
        "Ambassador engagement dropped during exam weeks",
        "Tracking codes by campus took manual work",
        "Reward fulfillment was slower than promised"
      ]
    },
    "3": {
      whatWorked: [
        "Segmenting by inactivity length improved reactivation",
        "A three-email sequence beat a single monthly send",
        "Plain-text subject lines outperformed promotional ones"
      ],
      challenges: [
        "Unsubscribe rates rose slightly in the oldest segment",
        "Attribution between email and push was unclear",
        "Template changes needed repeated design review"
      ]
    },
    "4": {
      whatWorked: [
        "A ready-to-use asset kit cut partner turnaround time",
        "Co-branded templates raised partner adoption",
        "A single request form replaced scattered emails"
      ],
      challenges: [
        "Partners customized templates beyond brand guidelines",
        "Print lead times varied by region",
        "Measuring partner-level results required manual reporting"
      ]
    }
  };

  return data[projectId] || {
    whatWorked: [""],
    challenges: [""]
  };
}

export default function AddProjectModal({ onClose, onAddProject, onUpdateProject, existingCountries, initialMode = 'manual', projectToEdit }: AddProjectModalProps) {
  // Mode Selection: manual form vs AI document importer
  const [mode, setMode] = useState<'manual' | 'import' | 'extracting'>(projectToEdit ? 'manual' : initialMode);
  const [isAiImported, setIsAiImported] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [activeScanLogIdx, setActiveScanLogIdx] = useState(0);

  const SAMPLES = [
    {
      title: "Customer Referral Boost",
      region: "NORTH AMERICA",
      country: "United States",
      city: "Chicago",
      date: "2026-06-15",
      targetAudience: "Users",
      hqManager: "Laura Bennett",
      localManager: "Jordan Lee",
      channels: ['In-app', 'Email', 'Push'],
      context: "Referral volume was flat because few customers knew the two-sided reward existed.",
      objective: "Lift referral signups by 30% within 30 days through a clearer two-sided reward.",
      execution: [
        "Added an in-app referral banner explaining the reward for both sides.",
        "Sent a three-message email series to active customers.",
        "Tracked redemptions in a simple weekly dashboard."
      ],
      results: [
        "Referral signups rose 34% in four weeks.",
        "Cost per acquisition fell 18% compared with paid channels."
      ],
      nextSteps: [
        "Test a 48-hour reward expiry to add urgency.",
        "Offer a bonus to customers who refer more than five people."
      ],
      metrics: [
        { label: "Referral Signups", value: "+34%" },
        { label: "CPA Reduction", value: "-18%" }
      ],
      images: [
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800"
      ]
    },
    {
      title: "Community Meetup Series",
      region: "EMEA",
      country: "United Kingdom",
      city: "London",
      date: "2026-05-20",
      targetAudience: "Partners",
      hqManager: "Priya Nair",
      localManager: "Emma Wilson",
      channels: ['Partner portal', 'Email', 'Campus events'],
      context: "Partners wanted more face-to-face time with the product team, and online webinars had low attendance.",
      objective: "Run four in-person meetups and reach 200 partner attendees.",
      execution: [
        "Picked four partner-dense cities and booked small venues.",
        "Invited partners through the portal and email.",
        "Collected feedback with a short survey after each event."
      ],
      results: [
        "212 partners attended across four events.",
        "Post-event satisfaction averaged 4.5 out of 5."
      ],
      nextSteps: [
        "Add a recorded version for partners who cannot travel.",
        "Plan a second series in two new cities."
      ],
      metrics: [
        { label: "Attendees", value: "212" },
        { label: "Satisfaction", value: "4.5/5" }
      ],
      images: [
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800"
      ]
    },
    {
      title: "Transit Poster QR Campaign",
      region: "LATAM",
      country: "Colombia",
      city: "Bogota",
      date: "2026-04-10",
      targetAudience: "Users",
      hqManager: "Carlos Mendez",
      localManager: "Sofia Herrera",
      channels: ['Print', 'Referral codes'],
      context: "The market was crowded and the team needed a low-cost way to reach commuters in person.",
      objective: "Gain 15,000 first-time customers using QR posters at transit stops.",
      execution: [
        "Placed posters at high-traffic transit stops.",
        "Used a unique QR code per location to track scans.",
        "Offered a first-purchase discount through the code."
      ],
      results: [
        "18,500 new signups used a poster code.",
        "First-purchase conversion reached 78%."
      ],
      nextSteps: [
        "Move budget to the five best-performing locations.",
        "Test shorter poster copy."
      ],
      metrics: [
        { label: "New Signups", value: "+18.5K" },
        { label: "First-Purchase Conv.", value: "78%" }
      ],
      images: [
        "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800"
      ]
    }
  ];

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const aiDocumentInputRef = useRef<HTMLInputElement>(null);

  const handleAiDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleStartImportWithFile(file);
    }
  };

  const handleStartImportWithFile = async (file: File) => {
    setMode('extracting');
    setScanProgress(1);
    setScanLogs([`Reading uploaded file "${file.name}"...`]);
    setActiveScanLogIdx(0);

    let currentProgress = 1;
    let targetCeiling = 15;

    const progressInterval = setInterval(() => {
      if (!isMountedRef.current) {
        clearInterval(progressInterval);
        return;
      }
      if (currentProgress < targetCeiling) {
        currentProgress += 1;
        setScanProgress(currentProgress);
      } else if (targetCeiling === 85 && currentProgress < 85) {
        // Slow creep to keep it moving while waiting for Gemini API response
        if (Math.random() > 0.4 && currentProgress < 83) {
          currentProgress += 1;
          setScanProgress(currentProgress);
        }
      } else if (targetCeiling === 95 && currentProgress < 95) {
        if (Math.random() > 0.7) {
          currentProgress += 1;
          setScanProgress(currentProgress);
        }
      }
    }, 80);

    try {
      // Step 1: Read the file as base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          // Extract base64 part
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      
      const base64Data = await base64Promise;
      if (!isMountedRef.current) {
        clearInterval(progressInterval);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 600));
      if (!isMountedRef.current) {
        clearInterval(progressInterval);
        return;
      }

      setScanLogs(prev => [...prev, "Uploading file to AI Analysis Engine..."]);
      setActiveScanLogIdx(1);
      targetCeiling = 35;
      
      await new Promise(resolve => setTimeout(resolve, 800));
      if (!isMountedRef.current) {
        clearInterval(progressInterval);
        return;
      }

      setScanLogs(prev => [...prev, "Detecting headings, layout, and structure..."]);
      setActiveScanLogIdx(2);
      targetCeiling = 60;

      await new Promise(resolve => setTimeout(resolve, 600));
      if (!isMountedRef.current) {
        clearInterval(progressInterval);
        return;
      }

      setScanLogs(prev => [...prev, "Extracting strategic objectives, context, and metrics with Gemini..."]);
      setActiveScanLogIdx(3);
      targetCeiling = 85;

      // Call server side API
      const response = await fetch('/api/parse-slide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Data,
          mimeType: file.type || 'image/png',
          fileName: file.name
        })
      });

      if (!isMountedRef.current) {
        clearInterval(progressInterval);
        return;
      }

      const responseText = await response.text();

      if (!response.ok) {
        let errorMsg = responseText;
        try {
          const errObj = JSON.parse(responseText);
          errorMsg = errObj.error || errObj.message || responseText;
        } catch {
          // not JSON, keep original text
        }
        throw new Error(errorMsg || 'Failed to parse image with Gemini');
      }

      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch (jsonErr) {
        console.error("Failed to parse API response as JSON:", jsonErr, responseText);
        if (responseText.includes("<!doctype html>") || responseText.includes("<html")) {
          throw new Error("The server returned an HTML page instead of a JSON response. The server may be restarting or experiencing an error. Please try again in a few seconds.");
        }
        throw new Error("Invalid response format received from server.");
      }
      
      setScanLogs(prev => [...prev, "Compiling dashboard details..."]);
      setActiveScanLogIdx(4);
      targetCeiling = 95;

      // Populate form state with parsed data
      setTitle(parsedData.title || '');
      setRegion(parsedData.region || 'NORTH AMERICA');
      
      // Match country against known list or select 'Custom'
      const isKnownCountry = REGIONS_DATA.some(r => r.countries.includes(parsedData.country));
      if (parsedData.country) {
        if (isKnownCountry) {
          setCountry(parsedData.country);
          setCustomCountry('');
          // Auto select region if country is known
          const foundRegion = REGIONS_DATA.find(r => r.countries.includes(parsedData.country));
          if (foundRegion) {
            setRegion(foundRegion.id);
          }
        } else {
          setCountry('Custom');
          setCustomCountry(parsedData.country);
        }
      } else {
        setCountry('');
        setCustomCountry('');
      }

      setCity(parsedData.city || '');
      if (parsedData.date) {
        setDate(parsedData.date);
      }
      const parsedAudience = parsedData.targetAudience || 'Users';
      const parsedLoaded: string[] = [];
      if (/user|customer/i.test(parsedAudience)) parsedLoaded.push("Users");
      if (/partner/i.test(parsedAudience)) parsedLoaded.push("Partners");
      setSelectedAudience(parsedLoaded.length > 0 ? parsedLoaded : ["Users"]);
      setHqManager(parsedData.hqManager || '');
      setLocalManager(parsedData.localManager || '');
      setChannels(parsedData.channels && parsedData.channels.length > 0 ? parsedData.channels : ['In-app', 'WhatsApp']);
      setContext(parsedData.context || '');
      setObjective(parsedData.objective || '');
      
      // Filter out any blank values to prevent empty fields
      const parsedExecution = parsedData.execution ? parsedData.execution.filter((x: string) => x && x.trim() !== '') : [];
      setExecution(parsedExecution.length > 0 ? parsedExecution : ['']);
      
      const parsedResults = parsedData.results ? parsedData.results.filter((x: string) => x && x.trim() !== '') : [];
      setResults(parsedResults.length > 0 ? parsedResults : ['']);
      
      const parsedNextSteps = parsedData.nextSteps ? parsedData.nextSteps.filter((x: string) => x && x.trim() !== '') : [];
      setNextSteps(parsedNextSteps.length > 0 ? parsedNextSteps : ['']);

      const parsedLessons = parsedData.lessons || {};
      const parsedWhatWorked = parsedLessons.whatWorked ? parsedLessons.whatWorked.filter((x: string) => x && x.trim() !== '') : [];
      setLessonsWhatWorked(parsedWhatWorked.length > 0 ? parsedWhatWorked : ['']);

      const parsedChallenges = parsedLessons.challenges ? parsedLessons.challenges.filter((x: string) => x && x.trim() !== '') : [];
      setLessonsChallenges(parsedChallenges.length > 0 ? parsedChallenges : ['']);
      
      const parsedMetrics = parsedData.metrics ? parsedData.metrics.filter((m: any) => m && m.label && m.label.trim() !== '') : [];
      setMetrics(parsedMetrics.length > 0 ? parsedMetrics : [{ label: '', value: '' }]);
      
      // Save reader result data URL as the local image representation
      const fileUrl = reader.result as string;
      const isPresentationFile = file.name.endsWith('.pptx') || 
                                 file.name.endsWith('.pdf') || 
                                 file.name.endsWith('.key') ||
                                 file.name.endsWith('.ppt') ||
                                 file.type.includes('presentationml') ||
                                 file.type.includes('pdf');
      
      if (parsedData.extractedImages && parsedData.extractedImages.length > 0) {
        setImages(parsedData.extractedImages);
      } else if (isPresentationFile) {
        setImages(["https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800"]);
      } else {
        setImages([fileUrl]);
      }

      setScanLogs(prev => [...prev, "Done! Generating draft dashboard review form..."]);
      setActiveScanLogIdx(5);
      
      targetCeiling = 100;
      setScanProgress(100);
      clearInterval(progressInterval);

      setTimeout(() => {
        if (isMountedRef.current) {
          setIsAiImported(true);
          setMode('manual');
        }
      }, 500);

    } catch (err: any) {
      clearInterval(progressInterval);
      console.error(err);
      if (isMountedRef.current) {
        setScanLogs(prev => [...prev, `Error: ${err.message || 'Unknown error occurred.'}`]);
        setScanProgress(100);
        alert(`AI parsing failed: ${err.message || 'Please make sure GEMINI_API_KEY is configured.'}`);
        setMode('import');
      }
    }
  };

  // Simple Form State
  const [title, setTitle] = useState(projectToEdit ? projectToEdit.title : '');
  const [region, setRegion] = useState(projectToEdit ? projectToEdit.region : 'NORTH AMERICA');
  const [country, setCountry] = useState(() => {
    if (projectToEdit) {
      const isKnownCountry = REGIONS_DATA.some(r => r.countries.includes(projectToEdit.country));
      return isKnownCountry ? projectToEdit.country : 'Custom';
    }
    return '';
  });
  const [customCountry, setCustomCountry] = useState(() => {
    if (projectToEdit) {
      const isKnownCountry = REGIONS_DATA.some(r => r.countries.includes(projectToEdit.country));
      return isKnownCountry ? '' : projectToEdit.country;
    }
    return '';
  });
  const [city, setCity] = useState(projectToEdit ? (projectToEdit.city || '') : '');
  const [date, setDate] = useState(projectToEdit ? projectToEdit.date : new Date().toISOString().split('T')[0]);
  const [selectedAudience, setSelectedAudience] = useState<string[]>(() => {
    if (projectToEdit && projectToEdit.targetAudience) {
      const val = projectToEdit.targetAudience;
      const loaded: string[] = [];
      if (/user|customer/i.test(val)) loaded.push("Users");
      if (/partner/i.test(val)) loaded.push("Partners");
      return loaded.length > 0 ? loaded : ["Users"];
    }
    return ["Users"];
  });
  const [hqManager, setHqManager] = useState(projectToEdit ? (projectToEdit.hqManager || '') : '');
  const [localManager, setLocalManager] = useState(projectToEdit ? (projectToEdit.localManager || '') : '');
  const [objective, setObjective] = useState(projectToEdit ? projectToEdit.objective : '');
  const [context, setContext] = useState(projectToEdit ? projectToEdit.context : '');
  
  // Channels State (tags list)
  const [channels, setChannels] = useState<string[]>(projectToEdit ? projectToEdit.channels : ['In-app', 'WhatsApp']);
  const [newChannel, setNewChannel] = useState('');

  // Dynamic Lists State
  const [execution, setExecution] = useState<string[]>(projectToEdit ? projectToEdit.execution : ['']);
  const [results, setResults] = useState<string[]>(projectToEdit ? projectToEdit.results : ['']);
  const [nextSteps, setNextSteps] = useState<string[]>(projectToEdit ? projectToEdit.nextSteps : ['']);
  
  // Lessons Learned State
  const [lessonsWhatWorked, setLessonsWhatWorked] = useState<string[]>(() => {
    if (projectToEdit) {
      if (projectToEdit.lessons) return projectToEdit.lessons.whatWorked;
      return getFallbackLessons(projectToEdit.id).whatWorked;
    }
    return [''];
  });
  const [lessonsChallenges, setLessonsChallenges] = useState<string[]>(() => {
    if (projectToEdit) {
      if (projectToEdit.lessons) return projectToEdit.lessons.challenges;
      return getFallbackLessons(projectToEdit.id).challenges;
    }
    return [''];
  });
  
  // Metrics State
  const [metrics, setMetrics] = useState<{ label: string; value: string }[]>(
    projectToEdit ? projectToEdit.metrics : [{ label: '', value: '' }]
  );

  // Images State
  const [images, setImages] = useState<string[]>(projectToEdit ? projectToEdit.images : []);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Overwrite Warning State
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [pendingProjectData, setPendingProjectData] = useState<Project | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const processFiles = (files: FileList) => {
    const filePromises = Array.from(files).map(file => {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        alert("Please select image or video files only.");
        return Promise.resolve(null);
      }
      return new Promise<string | null>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(base64Images => {
      const validImages = base64Images.filter((img): img is string => img !== null);
      if (validImages.length > 0) {
        setImages(prev => {
          // If the previous state was just a preset and user uploads, let's append or replace
          // Let's keep existing, but clean out empty strings
          const cleanPrev = prev.filter(img => img.trim() !== '');
          return [...cleanPrev, ...validImages];
        });
      }
    });
  };

  const handleAddExecutionStep = () => setExecution([...execution, '']);
  const handleRemoveExecutionStep = (index: number) => {
    setExecution(execution.filter((_, idx) => idx !== index));
  };
  const handleExecutionChange = (index: number, val: string) => {
    const updated = [...execution];
    updated[index] = val;
    setExecution(updated);
  };

  const handleAddResult = () => setResults([...results, '']);
  const handleRemoveResult = (index: number) => {
    setResults(results.filter((_, idx) => idx !== index));
  };
  const handleResultChange = (index: number, val: string) => {
    const updated = [...results];
    updated[index] = val;
    setResults(updated);
  };

  const handleAddNextStep = () => setNextSteps([...nextSteps, '']);
  const handleRemoveNextStep = (index: number) => {
    setNextSteps(nextSteps.filter((_, idx) => idx !== index));
  };
  const handleNextStepChange = (index: number, val: string) => {
    const updated = [...nextSteps];
    updated[index] = val;
    setNextSteps(updated);
  };

  const handleAddMetric = () => setMetrics([...metrics, { label: '', value: '' }]);
  const handleRemoveMetric = (index: number) => {
    setMetrics(metrics.filter((_, idx) => idx !== index));
  };
  const handleMetricChange = (index: number, key: 'label' | 'value', val: string) => {
    const updated = [...metrics];
    updated[index][key] = val;
    setMetrics(updated);
  };

  const handleAddImage = () => {
    setImages([...images, '']);
  };
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };
  const handleImageChange = (index: number, val: string) => {
    const updated = [...images];
    updated[index] = val;
    setImages(updated);
  };

  const handleAddChannel = () => {
    if (newChannel.trim() && !channels.includes(newChannel.trim())) {
      setChannels([...channels, newChannel.trim()]);
      setNewChannel('');
    }
  };

  const handleRemoveChannel = (channel: string) => {
    setChannels(channels.filter(c => c !== channel));
  };

  const handleAddWhatWorked = () => setLessonsWhatWorked([...lessonsWhatWorked, '']);
  const handleRemoveWhatWorked = (index: number) => {
    setLessonsWhatWorked(lessonsWhatWorked.filter((_, idx) => idx !== index));
  };
  const handleWhatWorkedChange = (index: number, val: string) => {
    const updated = [...lessonsWhatWorked];
    updated[index] = val;
    setLessonsWhatWorked(updated);
  };

  const handleAddChallenge = () => setLessonsChallenges([...lessonsChallenges, '']);
  const handleRemoveChallenge = (index: number) => {
    setLessonsChallenges(lessonsChallenges.filter((_, idx) => idx !== index));
  };
  const handleChallengeChange = (index: number, val: string) => {
    const updated = [...lessonsChallenges];
    updated[index] = val;
    setLessonsChallenges(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalCountry = country === 'Custom' || !country ? customCountry : country;
    if (!finalCountry) {
      alert("Please specify a country.");
      return;
    }

    if (selectedAudience.length === 0) {
      alert("Please specify at least one Target Audience option (Users or Partners).");
      return;
    }

    // Filter out blank inputs
    const cleanExecution = execution.filter(x => x.trim() !== '');
    const cleanResults = results.filter(x => x.trim() !== '');
    const cleanNextSteps = nextSteps.filter(x => x.trim() !== '');
    const cleanMetrics = metrics.filter(m => m.label.trim() !== '' && m.value.trim() !== '');
    
    const cleanWhatWorked = lessonsWhatWorked.filter(x => x.trim() !== '');
    const cleanChallenges = lessonsChallenges.filter(x => x.trim() !== '');
    
    // Ensure images lists have at least one valid URL
    let cleanImages = images.filter(img => img.trim() !== '');
    if (cleanImages.length === 0) {
      // Use clean cityscape style fallback
      cleanImages = ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800"];
    }

    const targetAudienceStr = selectedAudience.join(", ");

    const updatedProject: Project = {
      id: projectToEdit ? projectToEdit.id : Math.random().toString(36).substring(2, 9),
      title: title.trim(),
      region,
      country: finalCountry.trim(),
      city: city.trim() || undefined,
      hqManager: hqManager.trim() || undefined,
      localManager: localManager.trim() || undefined,
      targetAudience: targetAudienceStr,
      channels,
      objective: objective.trim(),
      context: context.trim(),
      execution: cleanExecution.length > 0 ? cleanExecution : ["Execution detailed by regional management team."],
      results: cleanResults.length > 0 ? cleanResults : ["Initial results logged inside local reports."],
      nextSteps: cleanNextSteps.length > 0 ? cleanNextSteps : ["Continue ongoing project communication and performance auditing."],
      metrics: cleanMetrics.length > 0 ? cleanMetrics : [{ label: "Target Achieved", value: "100%" }],
      lessons: {
        whatWorked: cleanWhatWorked.length > 0 ? cleanWhatWorked : ["Marketing strategies executed as per design patterns."],
        challenges: cleanChallenges.length > 0 ? cleanChallenges : ["Friction points monitored and mitigated."]
      },
      tags: [region, "Marketing", targetAudienceStr],
      images: cleanImages,
      date: date,
      upvotes: projectToEdit ? projectToEdit.upvotes : 0,
      downvotes: projectToEdit ? projectToEdit.downvotes : 0,
      comments: projectToEdit ? projectToEdit.comments : [],
      creatorEmail: projectToEdit ? projectToEdit.creatorEmail : undefined
    };

    if (projectToEdit && onUpdateProject) {
      setPendingProjectData(updatedProject);
      setShowSaveConfirm(true);
    } else {
      onAddProject(updatedProject);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Scrollable Container Modal */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="relative w-full sm:max-w-3xl bg-white rounded-none sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full sm:h-[90vh] z-10 border-0 sm:border border-slate-200"
      >
        {/* Header */}
        <div className="px-4 py-3.5 sm:p-6 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10 shrink-0">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-red-600 animate-pulse" />
            <h2 className="text-sm sm:text-xl font-bold text-gray-900">
              {projectToEdit 
                ? 'Edit Marketing Project' 
                : mode === 'import' 
                  ? 'Import Slide or Document' 
                  : mode === 'extracting' 
                    ? 'AI Parsing Project Document...' 
                    : 'Input New Marketing Project'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode 1: Import Document / Slide */}
        {mode === 'import' && (
          <div className="overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-center max-w-md mx-auto space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                  <UploadCloud className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Upload Presentation Slide or Project PDF</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Drop a presentation slide image, project outline PDF, or project slide deck here. Our AI assistant will extract key objectives, team metrics, execution stages, and results to draft the dashboard.
                </p>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    handleStartImportWithFile(file);
                  }
                }}
                onClick={() => aiDocumentInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragging 
                    ? 'border-red-500 bg-red-50/50' 
                    : 'border-gray-300 hover:border-red-400 hover:bg-slate-50/50'
                }`}
              >
                <input
                  type="file"
                  ref={aiDocumentInputRef}
                  onChange={handleAiDocumentChange}
                  className="hidden"
                  accept=".pptx,.ppt,.pdf,.key,.jpg,.jpeg,.png"
                />
                <UploadCloud className="w-10 h-10 text-gray-400 animate-bounce" />
                <div>
                  <p className="text-sm font-bold text-gray-800">Drag & drop your presentation slide here, or browse</p>
                  <p className="text-xs text-gray-500 mt-1">Supports PPTX/PPT, PDF, KEY, JPG, JPEG, PNG up to 25MB</p>
                </div>
              </div>
            </div>

            {/* Footer switcher */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMode('manual')}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center space-x-1"
              >
                <span>Or switch to manual project entry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold hover:bg-gray-50 text-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Mode 2: AI Extracting / Scanning Progress */}
        {mode === 'extracting' && (
          <div className="overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 flex-1 flex flex-col justify-center items-center min-h-[400px]">
            {/* Animated Laser Scanner Card */}
            <div className="relative w-64 h-40 rounded-2xl border border-gray-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden shadow-inner">
              {/* Laser line effect */}
              <div className="absolute top-0 inset-x-0 h-1 bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)] animate-scan" />
              
              <div className="p-3 bg-red-50 rounded-full text-red-600 mb-2">
                <FileText className="w-8 h-8 animate-pulse" />
              </div>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-widest animate-pulse">Scanning Slide...</span>
              <span className="text-[11px] text-gray-400 mt-1">AI-Powered Extraction Engine</span>
            </div>

            {/* Progress bar and logs */}
            <div className="w-full max-w-md space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-700">
                  <span>Extracting Dashboard Parameters</span>
                  <span className="text-red-600 font-black">{scanProgress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-600 transition-all duration-100" 
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>

              {/* Interactive terminal logs */}
              <div className="bg-gray-950 rounded-xl p-4 font-mono text-[11px] text-gray-400 min-h-[120px] border border-gray-800 space-y-1 shadow-md">
                {scanLogs.slice(0, activeScanLogIdx + 1).map((log, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    {idx === activeScanLogIdx && scanProgress < 100 ? (
                      <Loader2 className="w-3.5 h-3.5 text-red-500 animate-spin shrink-0 mt-0.5" />
                    ) : (
                      <span className="text-green-500 font-bold shrink-0">✓</span>
                    )}
                    <span className={idx === activeScanLogIdx ? "text-slate-100 font-semibold" : "text-gray-500"}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mode 3: Manual Entry Form */}
        {mode === 'manual' && (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 flex-1">
            {isAiImported && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3 shadow-xs"
              >
                <Sparkles className="w-5 h-5 text-red-600 shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-red-900">✨ AI Slide Import Successful!</h4>
                  <p className="text-xs text-red-700 leading-relaxed">
                    We've extracted the core marketing mechanics, objectives, local managers, execution phases, and performance results from your document. Please review the details below, attach project photos/visuals, and submit.
                  </p>
                </div>
              </motion.div>
            )}
            
            {/* SECTION 1: High Level Identifiers */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-4 h-4 text-red-600" />
              <span>Project Meta & Location</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., FOMO CRM Churn Prevention"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Region *</label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500"
                  value={region}
                  onChange={(e) => {
                    setRegion(e.target.value);
                    setCountry('');
                    setCustomCountry('');
                  }}
                >
                  {REGIONS_DATA.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Country *</label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500"
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    if (e.target.value !== 'Custom') {
                      setCustomCountry('');
                    }
                  }}
                >
                  <option value="">Select Country</option>
                  {(REGIONS_DATA.find(r => r.id === region)?.countries || []).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="Custom">Other (Specify Below)</option>
                </select>
              </div>

              {country === 'Custom' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Specify Custom Country *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., United States"
                    className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500"
                    value={customCountry}
                    onChange={(e) => setCustomCountry(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">City (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Chicago"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Reporting Date *</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 bg-white"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Audience, Channels & Team */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1">
              <User className="w-4 h-4 text-red-600" />
              <span>Audience, Channels & Team</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Target Audience *</label>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {["Users", "Partners"].map((opt) => {
                    const isSelected = selectedAudience.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedAudience(prev => prev.filter(x => x !== opt));
                          } else {
                            setSelectedAudience(prev => [...prev, opt]);
                          }
                        }}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer active:scale-95 ${
                          isSelected
                            ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5">Select one or more target audiences (Users, Partners).</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">HQ Lead Manager</label>
                <input
                  type="text"
                  placeholder="e.g., Laura Bennett"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500"
                  value={hqManager}
                  onChange={(e) => setHqManager(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Local Market Manager</label>
                <input
                  type="text"
                  placeholder="e.g., Carlos Mendez"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500"
                  value={localManager}
                  onChange={(e) => setLocalManager(e.target.value)}
                />
              </div>

              {/* Channels management */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Project Channels *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., TikTok, Radio"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500"
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value)}
                    onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddChannel(); } }}
                  />
                  <button
                    type="button"
                    onClick={handleAddChannel}
                    className="px-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-black transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {channels.map(channel => (
                    <span key={channel} className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-md">
                      <span>{channel}</span>
                      <button type="button" onClick={() => handleRemoveChannel(channel)} className="text-red-500 hover:text-red-900 font-bold ml-1">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Context & Objective */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1">
              <Target className="w-4 h-4 text-red-600" />
              <span>Project Objectives & Context</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Background Context *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain why this project was needed, what pain points it addresses..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Goals & Objectives *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Specify the measurable goals of this project..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Execution Steps */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1">
                <ListTodo className="w-4 h-4 text-red-600" />
                <span>Execution Steps *</span>
              </h3>
              <button
                type="button"
                onClick={handleAddExecutionStep}
                className="text-xs font-bold text-red-600 flex items-center gap-1 bg-red-5 px-2.5 py-1.5 rounded-md hover:bg-red-100"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-2">
              {execution.map((step, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-xs font-bold text-gray-400 w-5">{idx + 1}.</span>
                  <input
                    type="text"
                    required
                    placeholder="Describe a key execution step..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500"
                    value={step}
                    onChange={(e) => handleExecutionChange(idx, e.target.value)}
                  />
                  {execution.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveExecutionStep(idx)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: Results */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-red-600" />
                <span>Results achieved *</span>
              </h3>
              <button
                type="button"
                onClick={handleAddResult}
                className="text-xs font-bold text-red-600 flex items-center gap-1 bg-red-5 px-2.5 py-1.5 rounded-md hover:bg-red-100"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Result</span>
              </button>
            </div>

            <div className="space-y-2">
              {results.map((res, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-xs font-bold text-gray-400 w-5">•</span>
                  <input
                    type="text"
                    required
                    placeholder="Describe a major success or outcome..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500"
                    value={res}
                    onChange={(e) => handleResultChange(idx, e.target.value)}
                  />
                  {results.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveResult(idx)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 6: Next Steps */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1">
                <Compass className="w-4 h-4 text-red-600" />
                <span>Next Steps for the Project *</span>
              </h3>
              <button
                type="button"
                onClick={handleAddNextStep}
                className="text-xs font-bold text-red-600 flex items-center gap-1 bg-red-5 px-2.5 py-1.5 rounded-md hover:bg-red-100"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-2">
              {nextSteps.map((step, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-xs font-bold text-gray-400 w-5">➔</span>
                  <input
                    type="text"
                    required
                    placeholder="What should the team do next? e.g., A/B test copies..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500"
                    value={step}
                    onChange={(e) => handleNextStepChange(idx, e.target.value)}
                  />
                  {nextSteps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveNextStep(idx)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 6.5: Lessons Learned */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1">
              <Lightbulb className="w-4.5 h-4.5 text-red-600" />
              <span>Lessons Learned (Case Study Details) *</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              {/* What Worked List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    What Worked
                  </span>
                  <button
                    type="button"
                    onClick={handleAddWhatWorked}
                    className="text-[11px] font-bold text-red-600 flex items-center gap-1 bg-red-50 px-2 py-1 rounded hover:bg-red-100 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {lessonsWhatWorked.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="text-xs font-bold text-gray-400 w-4 shrink-0">{idx + 1}.</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Video testimonials increased CTR by 2.4x..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 bg-white"
                        value={item}
                        onChange={(e) => handleWhatWorkedChange(idx, e.target.value)}
                      />
                      {lessonsWhatWorked.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveWhatWorked(idx)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg shrink-0 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Challenges List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
                    Challenges
                  </span>
                  <button
                    type="button"
                    onClick={handleAddChallenge}
                    className="text-[11px] font-bold text-red-600 flex items-center gap-1 bg-red-50 px-2 py-1 rounded hover:bg-red-100 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {lessonsChallenges.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="text-xs font-bold text-gray-400 w-4 shrink-0">{idx + 1}.</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. High drop-off rate during document upload..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 bg-white"
                        value={item}
                        onChange={(e) => handleChallengeChange(idx, e.target.value)}
                      />
                      {lessonsChallenges.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveChallenge(idx)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg shrink-0 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 7: Measurable Metrics */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-red-600" />
                <span>Measurable Metrics *</span>
              </h3>
              <button
                type="button"
                onClick={handleAddMetric}
                className="text-xs font-bold text-red-600 flex items-center gap-1 bg-red-5 px-2.5 py-1.5 rounded-md hover:bg-red-100"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Metric</span>
              </button>
            </div>

            <div className="space-y-2">
              {metrics.map((metric, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <input
                    type="text"
                    required
                    placeholder="Label (e.g., Conversion Rate)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500"
                    value={metric.label}
                    onChange={(e) => handleMetricChange(idx, 'label', e.target.value)}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Value (e.g., +24%)"
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 font-bold text-red-600"
                    value={metric.value}
                    onChange={(e) => handleMetricChange(idx, 'value', e.target.value)}
                  />
                  {metrics.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMetric(idx)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 8: Visual Creative & Screenshots */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1">
              <ImageIcon className="w-4 h-4 text-red-600" />
              <span>Screenshots, Videos & Project Visuals *</span>
            </h3>

            {/* Drag & Drop File Upload Container */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Upload Screenshots / Videos from Computer (Recommended)
              </label>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                  isDragging 
                    ? 'border-red-500 bg-red-50/50' 
                    : 'border-gray-300 hover:border-red-400 hover:bg-slate-50/50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-red-500' : 'text-gray-400'}`} />
                <div>
                  <p className="text-sm font-bold text-gray-700">Drag & drop screenshots or videos here, or click to browse</p>
                  <p className="text-xs text-gray-500 mt-1">Supports PNG, JPG, JPEG, WebP, MP4, WebM, and YouTube / Vimeo streams</p>
                </div>
              </div>
            </div>

            {/* Display selected/uploaded images thumbnails */}
            {images.filter(img => img && img.trim() !== '').length > 0 && (
              <div>
                <span className="text-xs font-semibold text-gray-500 block mb-2">Currently Added Visuals ({images.filter(img => img && img.trim() !== '').length}):</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((img, idx) => {
                    if (!img || img.trim() === '') return null;
                    return (
                      <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 group bg-gray-50 shadow-xs">
                        {isVideoUrl(img) ? (
                          <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
                            {img.startsWith('data:') ? (
                              <video src={img} className="w-full h-full object-cover" muted playsInline />
                            ) : (
                              <div className="w-full h-full bg-slate-950 flex items-center justify-center">
                                <Play className="w-6 h-6 text-slate-300" />
                              </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Play className="w-5 h-5 text-white fill-white/20 animate-pulse" />
                            </div>
                          </div>
                        ) : (
                          <img src={img} alt={`Project visual ${idx + 1}`} className="w-full h-full object-cover" />
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1.5 right-1.5 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all shadow-md z-10"
                          title="Remove visual asset"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 px-2 py-1 text-[11px] text-white truncate z-10">
                          {img.startsWith('data:') ? 'Local Computer File' : 'Web Image URL'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Custom URLs */}
            <div className="space-y-2 mt-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-700 block">Advanced: Public Image & Video URLs</span>
                  <span className="text-[11px] text-gray-500 block">Or manually link direct images/videos or embed streams from the web</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="text-xs font-bold text-red-600 flex items-center gap-1 bg-white hover:bg-gray-100 border border-gray-200 px-2 py-1 rounded-md transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add URL Field</span>
                </button>
              </div>

              {images.map((img, idx) => {
                // If it's a base64 string, don't show an input text field for it to avoid clutter
                if (img.startsWith('data:')) return null;
                return (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="URL (e.g. https://youtube.com/watch?v=... or https://...)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500"
                      value={img}
                      onChange={(e) => handleImageChange(idx, e.target.value)}
                    />
                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-2 text-gray-400 hover:text-slate-800 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-6 border-t border-gray-200 flex justify-between items-center">
            <div>
              {!projectToEdit && (
                <button
                  type="button"
                  onClick={() => {
                    setIsAiImported(false);
                    setMode('import');
                  }}
                  className="text-xs font-bold text-gray-500 hover:text-slate-800 transition-colors flex items-center space-x-1"
                >
                  <UploadCloud className="w-4 h-4 text-slate-800 animate-bounce" />
                  <span>Import Slide Instead</span>
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
              >
                {projectToEdit ? 'Save Changes' : 'Submit Project'}
              </button>
            </div>
          </div>
        </form>
      )}
      </motion.div>

      {showSaveConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/75 backdrop-blur-sm">
          <div className="fixed inset-0" onClick={() => setShowSaveConfirm(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 flex flex-col text-left animate-scaleUp z-10">
            <div className="flex items-start space-x-3.5">
              <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center shrink-0 shadow-sm">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900 tracking-tight font-display">Confirm Save Changes?</h4>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider block mt-0.5">Overwrite Previous Version</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-slate-655 text-xs sm:text-sm leading-relaxed">
                You are editing an existing case study. Saving these changes will <span className="font-bold text-slate-900">permanently overwrite</span> the previous version.
              </p>
              <p className="text-slate-655 text-xs sm:text-sm leading-relaxed mt-2.5">
                The old details, objectives, lessons, or metrics will be completely replaced and you will not have access to them anymore.
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setShowSaveConfirm(false)}
                className="flex-1 py-3 px-4 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer font-display text-center"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (pendingProjectData && onUpdateProject) {
                    onUpdateProject(pendingProjectData);
                  }
                  setShowSaveConfirm(false);
                }}
                className="flex-1 py-3 px-4 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer font-display text-center shadow-lg"
              >
                Confirm & Overwrite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

