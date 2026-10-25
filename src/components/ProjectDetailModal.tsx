import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  MapPin, 
  Target, 
  Compass, 
  Users, 
  Megaphone, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  Layers,
  UserCheck,
  Calendar,
  Maximize2,
  Minimize2,
  ArrowLeft,
  MessageSquare,
  Send,
  Route,
  GitBranch,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Pencil,
  Star,
  Lightbulb,
  HelpCircle,
  CheckCircle,
  Trash2,
  Play,
  ChevronLeft,
  ChevronRight,
  Share2,
  Mail,
  Copy
} from 'lucide-react';
import { Project, UserProfile } from '../types';

export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  const lowercase = url.toLowerCase();
  return (
    lowercase.endsWith('.mp4') ||
    lowercase.endsWith('.webm') ||
    lowercase.endsWith('.ogg') ||
    lowercase.endsWith('.mov') ||
    lowercase.endsWith('.m4v') ||
    lowercase.includes('youtube.com') ||
    lowercase.includes('youtu.be') ||
    lowercase.includes('vimeo.com') ||
    lowercase.includes('video') ||
    lowercase.startsWith('data:video/')
  );
}

export function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    }
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } else if (url.includes('vimeo.com')) {
    const regExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
    const match = url.match(regExp);
    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}`;
    }
  }
  return null;
}

function getPlaceholderImage(region: string, title: string): string {
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
}

function getLessonsLearned(projectId: string): { whatWorked: string[]; challenges: string[] } {
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
    whatWorked: [
      "Focused marketing channels outperformed broad audience outreach by 2.1x.",
      "Visual-heavy educational creatives drove 35% higher engagement compared to text-only instructions.",
      "Leveraging local influencers and regional advocates significantly reduced acquisition costs."
    ],
    challenges: [
      "Tracking multi-platform attribution presented minor data sync delays.",
      "Ad creative fatigue was observed after 3 weeks, requiring fresh design versions.",
      "High demand peaks created occasional server-side request overhead."
    ]
  };
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timeAgo: string;
  likes?: number;
  replies?: Comment[];
}

interface DiscussionSectionProps {
  project: Project;
  onUpdateProject: (updated: Project) => void;
  currentUserProfile?: UserProfile;
}

function DiscussionSection({ project, onUpdateProject, currentUserProfile }: DiscussionSectionProps) {
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: string; author: string } | null>(null);

  const comments = project.comments || [];
  const currentAuthorName = currentUserProfile ? currentUserProfile.name : "You (Marketing Lead)";

  const handleLike = (commentId: string, isReply: boolean, parentId?: string) => {
    const updatedComments = comments.map(c => {
      if (!isReply && c.id === commentId) {
        return { ...c, likes: (c.likes || 0) + 1 };
      }
      if (isReply && c.id === parentId && c.replies) {
        return {
          ...c,
          replies: c.replies.map(r => r.id === commentId ? { ...r, likes: (r.likes || 0) + 1 } : r)
        };
      }
      return c;
    });
    onUpdateProject({ ...project, comments: updatedComments });
  };

  const handleDelete = (commentId: string, isReply: boolean, parentId?: string) => {
    let updatedComments: Comment[];
    if (isReply && parentId) {
      updatedComments = comments.map(c => {
        if (c.id === parentId && c.replies) {
          return {
            ...c,
            replies: c.replies.filter(r => r.id !== commentId)
          };
        }
        return c;
      });
    } else {
      updatedComments = comments.filter(c => c.id !== commentId);
    }
    onUpdateProject({ ...project, comments: updatedComments });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const authorName = currentUserProfile ? currentUserProfile.name : "You (Marketing Lead)";
    const authorAvatar = currentUserProfile ? currentUserProfile.avatar : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150";

    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      author: authorName,
      avatar: authorAvatar,
      text: text.trim(),
      timeAgo: "Just now",
      likes: 0,
      replies: []
    };

    let updatedComments: Comment[];
    if (replyTo) {
      updatedComments = comments.map(c => {
        if (c.id === replyTo.id) {
          return {
            ...c,
            replies: [...(c.replies || []), newComment]
          };
        }
        return c;
      });
    } else {
      updatedComments = [...comments, newComment];
    }

    onUpdateProject({ ...project, comments: updatedComments });
    setText('');
    setReplyTo(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center space-x-2.5 bg-white">
        <MessageSquare className="w-5 h-5 text-brand" />
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-display">Discussion</h4>
      </div>

      {/* Comments List */}
      <div className="p-4 sm:p-5 space-y-5 max-h-[380px] overflow-y-auto bg-white">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-400 font-medium">No comments yet. Be the first to ask a question!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {/* Parent Comment */}
              <div className="flex items-start space-x-3 text-left">
                <img 
                  src={comment.avatar} 
                  alt={comment.author} 
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0 shadow-2xs"
                />
                <div className="flex-1 min-w-0 bg-gray-50/50 rounded-xl p-3.5 border border-slate-100">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-gray-900 text-xs sm:text-sm truncate">{comment.author}</span>
                    <span className="text-[10px] text-gray-400 font-bold shrink-0">{comment.timeAgo}</span>
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-3 mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <button 
                      onClick={() => setReplyTo({ id: comment.id, author: comment.author })}
                      className="hover:text-brand transition-colors cursor-pointer"
                    >
                      Reply
                    </button>
                    <span>•</span>
                    <button 
                      onClick={() => handleLike(comment.id, false)}
                      className="hover:text-brand transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <span>Like</span>
                      {comment.likes ? <span>({comment.likes})</span> : null}
                    </button>
                    {comment.author === currentAuthorName && (
                      <>
                        <span>•</span>
                        <button 
                          onClick={() => handleDelete(comment.id, false)}
                          className="hover:text-red-600 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.map((reply) => (
                <div key={reply.id} className="flex items-start space-x-3 pl-8 text-left">
                  <img 
                    src={reply.avatar} 
                    alt={reply.author} 
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 shadow-2xs"
                  />
                  <div className="flex-1 min-w-0 bg-gray-50/50 rounded-xl p-3 border border-slate-100/80">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-gray-900 text-xs truncate">{reply.author}</span>
                      <span className="text-[10px] text-gray-400 font-bold shrink-0">{reply.timeAgo}</span>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{reply.text}</p>
                    
                    {/* Like Reply */}
                    <div className="flex items-center space-x-3 mt-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                      <button 
                        onClick={() => handleLike(reply.id, true, comment.id)}
                        className="hover:text-brand transition-colors cursor-pointer flex items-center space-x-1"
                      >
                        <span>Like</span>
                        {reply.likes ? <span>({reply.likes})</span> : null}
                      </button>
                      {reply.author === currentAuthorName && (
                        <>
                          <span>•</span>
                          <button 
                            onClick={() => handleDelete(reply.id, true, comment.id)}
                            className="hover:text-red-600 transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-slate-100 bg-white">
        {replyTo && (
          <div className="flex items-center justify-between bg-brand-light/10 text-brand text-[10px] font-bold px-3 py-1.5 rounded-lg mb-2.5 border border-brand-border/10 uppercase tracking-wider">
            <span>Replying to {replyTo.author}</span>
            <button 
              onClick={() => setReplyTo(null)}
              className="text-brand hover:text-brand-hover text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="relative flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs focus-within:ring-2 focus-within:ring-brand/10 focus-within:border-brand transition-all">
          <input 
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
            className="flex-1 bg-transparent text-xs sm:text-sm text-gray-700 placeholder-gray-400 focus:outline-none pr-8"
          />
          <button 
            type="submit"
            className="absolute right-3.5 text-brand hover:text-brand-hover transition-colors p-1 rounded-lg"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

interface ReplicationGuideModalProps {
  project: Project;
  onClose: () => void;
  onConfirm: () => void;
}

function ReplicationGuideModal({ project, onClose, onConfirm }: ReplicationGuideModalProps) {
  const steps = [
    {
      title: "Market Analysis & Localisation",
      description: `Identify top 3 pain points for local ${project.targetAudience || 'users'} in ${project.city || project.country || 'your target market'}. Ensure all creative copy is translated and culturally vetted for the specific city, adapting the core mechanics of '${project.title}'.`
    },
    {
      title: "Media Buying Setup",
      description: `Allocate 60% of your launch budget to ${project.channels.slice(0, 2).join(' / ') || 'digital channels'} and 40% to localized search terms. Configure specific target segments for ${project.targetAudience || 'leads'} and set up custom tracking.`
    },
    {
      title: "Execution & Optimization",
      description: `Launch with local A/B testing on primary creative formats. Monitor core performance metrics daily to aim for a comparable ${project.metrics[0]?.value || 'strong conversion'} ${project.metrics[0]?.label || 'uplift'}, shifting budget dynamically every 48 hours.`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/65 backdrop-blur-sm">
      <div 
        onClick={onClose}
        className="fixed inset-0 transition-opacity cursor-default"
      />
      
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-55 border border-slate-200 flex flex-col max-h-[90vh] animate-scaleUp">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4.5 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-brand-light/10 text-brand flex items-center justify-center shadow-2xs">
              <Route className="w-5.5 h-5.5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900 tracking-tight font-display">Replication Guide</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-0.5">Project deployment path</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 bg-gray-50 hover:bg-slate-100 rounded-lg text-gray-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 flex-1 text-left">
          
          {/* Customized Timeline */}
          <div className="relative pl-12 space-y-8">
            {/* Vertical Connecting Line */}
            <div className="absolute left-[17px] top-3 bottom-3 w-[2px] bg-brand-light/30" />
            
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-start text-left animate-fadeIn">
                {/* Number Badge */}
                <div className="absolute -left-[45px] top-0.5 w-9 h-9 rounded-full bg-brand text-white font-extrabold flex items-center justify-center text-sm shadow-xs border-2 border-white">
                  {idx + 1}
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 text-sm sm:text-base leading-snug mb-1.5 font-display">
                    {step.title}
                  </h5>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Project Leads & Support Callout */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="space-y-1.5">
              <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-display">
                <UserCheck className="w-4 h-4 text-brand shrink-0" />
                Original Project Execution Team
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                This project was successfully implemented by our regional leads. To guarantee an effective replication, please contact the original project team for advice, high-resolution source designs, localized creatives, and detailed performance insights:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {project.hqManager && (
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-3xs">
                  <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block mb-1">HQ Project Lead</span>
                  <span className="font-bold text-gray-900 text-xs sm:text-sm">{project.hqManager}</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5 font-sans">HQ Marketing Team</span>
                </div>
              )}
              {project.localManager && (
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-3xs">
                  <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Local Market Lead</span>
                  <span className="font-bold text-gray-900 text-xs sm:text-sm">{project.localManager}</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5 font-sans">{project.city || project.country} Office</span>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-700 bg-white p-3 rounded-lg border border-slate-200/60 text-center font-semibold animate-pulse">
              💡 Tip: Reach out on Telegram at <span className="underline font-bold">@MarketingSync</span> or email project leads directly.
            </div>
          </div>

          {/* Done Button */}
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-md flex items-center justify-center space-x-2 text-xs uppercase tracking-wider cursor-pointer font-display"
          >
            <span>Close & Return to Case Study</span>
          </button>

        </div>
      </div>
    </div>
  );
}

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
  onReplicate: () => void;
  onUpdateProject: (updated: Project) => void;
  onVote?: (id: string, voteType: 'up' | 'down') => void;
  userVote?: 'up' | 'down' | null;
  onEdit?: () => void;
  onDelete?: (id: string) => void;
  canEdit?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  currentUserProfile?: UserProfile;
}

export default function ProjectDetailModal({ 
  project, 
  onClose, 
  onReplicate, 
  onUpdateProject, 
  onVote, 
  userVote,
  onEdit,
  onDelete,
  canEdit = false,
  isFavorite = false,
  onToggleFavorite,
  currentUserProfile
}: ProjectDetailModalProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isMaximized, setIsMaximized] = useState(true);
  const [showReplicationGuide, setShowReplicationGuide] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?project=${project.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy link:', err);
    });
  };

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?project=${project.id}` : '';
  const shareTitle = `Check out this marketing project: ${project.title}`;

  const lessons = project.lessons || getLessonsLearned(project.id);
  const currentMediaUrl = project.images[activeImageIdx] || getPlaceholderImage(project.region, project.title);
  const isCurrentVideo = isVideoUrl(currentMediaUrl);
  const currentEmbedUrl = isCurrentVideo ? getEmbedUrl(currentMediaUrl) : null;

  const formattedDate = project.date 
    ? new Date(project.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
    : 'JUL 1, 2026';

  const modalContent = (
    <div className="flex-1 bg-[#F8F9FA] flex flex-col min-h-0 text-left">
      {/* Sticky Top Header Navigation */}
      <div className="sticky top-0 bg-slate-950 border-b border-slate-900 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-30 shadow-md text-white shrink-0">
        <div className="flex items-center space-x-1.5 sm:space-x-3">
          <button 
            onClick={onClose}
            className="flex items-center space-x-1.5 text-slate-200 hover:text-white font-semibold text-xs transition-all bg-white/5 hover:bg-white/10 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-white/5 active:scale-95 font-display"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </button>
          <span className="text-white/20">|</span>
          <span className="text-xs font-bold uppercase text-white/60 tracking-wider hidden md:inline-block font-display">Project Case Study page</span>
        </div>
        
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Share Button with Dropdown Dialogue */}
          <div className="relative">
            <button
              onClick={() => setShowShareDialog(!showShareDialog)}
              className={`flex items-center space-x-1 px-2.5 sm:px-3.5 py-1.5 rounded-full border transition-all active:scale-95 cursor-pointer text-xs font-bold ${
                showShareDialog 
                  ? 'bg-red-600 border-red-600 text-white shadow-xs' 
                  : 'bg-white/5 border-white/10 text-slate-200 hover:text-white hover:bg-white/10'
              }`}
              title="Share Case Study"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {showShareDialog && (
              <>
                {/* Backdrop to close the dropdown */}
                <div 
                  className="fixed inset-0 z-45 cursor-default bg-transparent" 
                  onClick={() => setShowShareDialog(false)} 
                />
                
                {/* Popover Card */}
                <div className="absolute right-0 mt-2.5 w-72 sm:w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 text-slate-100 z-50 space-y-3 origin-top-right animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Share Case Study</span>
                    <button 
                      onClick={() => setShowShareDialog(false)}
                      className="p-1 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  {/* Link Copy Field */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block text-left">Direct Link</span>
                    <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                      <input 
                        type="text" 
                        readOnly 
                        value={shareUrl} 
                        className="bg-transparent border-0 text-xs text-slate-300 w-full focus:ring-0 focus:outline-hidden px-1 cursor-text"
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                      />
                      <button
                        onClick={handleCopyLink}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all shrink-0 active:scale-95 flex items-center space-x-1 ${
                          copied 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white'
                        }`}
                      >
                        {copied ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-white" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Share platforms */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block text-left">Share via</span>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Telegram */}
                      <a
                        href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-800 bg-slate-950/40 hover:bg-slate-950 hover:border-slate-700 transition-all text-slate-300 hover:text-white gap-1 group cursor-pointer"
                      >
                        <Send className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-medium">Telegram</span>
                      </a>

                      {/* WhatsApp */}
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-800 bg-slate-950/40 hover:bg-slate-950 hover:border-slate-700 transition-all text-slate-300 hover:text-white gap-1 group cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-medium">WhatsApp</span>
                      </a>

                      {/* Email */}
                      <a
                        href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent("Check out this marketing project:\n\n" + shareUrl)}`}
                        className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-800 bg-slate-950/40 hover:bg-slate-950 hover:border-slate-700 transition-all text-slate-300 hover:text-white gap-1 group cursor-pointer"
                      >
                        <Mail className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-medium">Email</span>
                      </a>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Favorite Star Button */}
          <button
            onClick={() => onToggleFavorite?.(project.id)}
            className={`flex items-center space-x-1 px-2.5 sm:px-3.5 py-1.5 rounded-full border transition-all active:scale-95 cursor-pointer text-xs font-bold ${
              isFavorite 
                ? 'bg-amber-400 border-amber-400 text-slate-900' 
                : 'bg-white/5 border-white/10 text-slate-200 hover:text-amber-400 hover:bg-white/10'
            }`}
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">{isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>

          {/* Rating Pill */}
          <div className="flex items-center space-x-1 bg-white/5 rounded-full px-2 py-1 sm:px-2.5 sm:py-1.5 border border-white/10">
            <button 
              onClick={() => onVote?.(project.id, 'up')}
              className={`p-1 rounded-full transition-all flex items-center space-x-1 cursor-pointer active:scale-90 ${userVote === 'up' ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-white/10 text-white/85 hover:text-white'}`}
              title="Upvote Project"
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${userVote === 'up' ? 'fill-white/10 text-white' : ''}`} />
              <span className="text-xs font-bold">{project.upvotes ?? 0}</span>
            </button>
            <span className="text-white/10 font-bold">|</span>
            <button 
              onClick={() => onVote?.(project.id, 'down')}
              className={`p-1 rounded-full transition-all flex items-center space-x-1 cursor-pointer active:scale-90 ${userVote === 'down' ? 'bg-brand text-white font-bold' : 'hover:bg-white/10 text-white/85 hover:text-white'}`}
              title="Downvote Project"
            >
              <ThumbsDown className={`w-3.5 h-3.5 ${userVote === 'down' ? 'fill-white/10 text-white' : ''}`} />
              <span className="text-xs font-bold">{project.downvotes ?? 0}</span>
            </button>
          </div>

          {canEdit && (
            <>
              <button 
                onClick={onEdit}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800 text-white rounded-full text-xs font-bold hover:bg-slate-700 border border-slate-700/60 transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer active:scale-95 font-display"
                title="Edit project details"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit Case Study</span>
              </button>
              
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white rounded-full text-xs font-bold hover:bg-red-700 border border-red-600/60 transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer active:scale-95 font-display"
                title="Delete project"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete Case Study</span>
              </button>
            </>
          )}

          <button 
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/90 hover:text-white transition-colors"
            title={isMaximized ? "Minimize to dialog" : "Maximize to fullscreen"}
          >
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button 
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-brand hover:border-brand border border-white/10 rounded-full text-white/90 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Scrollable View Area */}
      <div className="flex-1 overflow-y-auto w-full">
        {/* Dynamic Dark Hero Banner matching screenshot */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white border-b border-slate-900 py-10 md:py-14 shadow-lg w-full ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Hero Column: Gallery Panel (5/12 width) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="aspect-video relative rounded-2xl overflow-hidden bg-slate-950/40 border border-white/5 shadow-2xl group/gallery">
                {isCurrentVideo ? (
                  currentEmbedUrl ? (
                    <iframe 
                      src={currentEmbedUrl} 
                      className="w-full h-full border-0" 
                      allowFullScreen 
                      title="Project Video"
                    />
                  ) : (
                    <video 
                      src={currentMediaUrl} 
                      controls 
                      className="w-full h-full object-contain bg-black"
                    />
                  )
                ) : (
                  <img 
                    src={currentMediaUrl} 
                    alt={`${project.title} gallery`}
                    className="w-full h-full object-cover cursor-zoom-in"
                    onClick={() => {
                      setLightboxIdx(activeImageIdx);
                      setShowLightbox(true);
                    }}
                  />
                )}
                {/* Overlay only for non-embed or overlay elements to click & maximize */}
                {!currentEmbedUrl && (
                  <div 
                    onClick={() => {
                      setLightboxIdx(activeImageIdx);
                      setShowLightbox(true);
                    }}
                    className="absolute inset-0 bg-black/0 hover:bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
                  >
                    <div className="bg-slate-900/90 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg border border-white/10">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Maximize View</span>
                    </div>
                  </div>
                )}
                
                {/* If it is an embed URL, since iframe intercepts clicks, we can place a small float maximize button on top right */}
                {currentEmbedUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setLightboxIdx(activeImageIdx);
                      setShowLightbox(true);
                    }}
                    className="absolute top-2.5 right-2.5 bg-slate-900/90 hover:bg-slate-900 text-white p-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg border border-white/10 z-20 cursor-pointer transition-colors"
                    title="Maximize Video"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {/* Custom Screenshot Thumbnails exactly like screenshot */}
              {project.images.length > 0 && (
                <div className="flex gap-2.5 overflow-x-auto py-1 justify-start">
                  {project.images.slice(0, 3).map((img, idx) => {
                    const isLast = idx === 2 && project.images.length > 3;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`relative w-16 h-11 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                          activeImageIdx === idx ? 'border-brand scale-105' : 'border-white/10 opacity-60 hover:opacity-100'
                        }`}
                      >
                        {isVideoUrl(img) ? (
                          <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
                            {img.startsWith('data:') ? (
                              <video src={img} className="w-full h-full object-cover opacity-80" muted playsInline />
                            ) : (
                              <div className="w-full h-full bg-slate-950/80 flex items-center justify-center">
                                <Play className="w-4 h-4 text-white" />
                              </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Play className="w-3.5 h-3.5 text-white fill-white/20" />
                            </div>
                          </div>
                        ) : (
                          <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                        )}
                        {isLast && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-[11px] font-black text-white">
                            +{project.images.length - 2}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Hero Column: Details & Brand Info (7/12 width) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Header Pill Tags precisely styled */}
              <div className="flex flex-wrap gap-2.5">
                <span className="px-3.5 py-1 bg-white/10 border border-white/10 text-slate-100 text-[10px] font-semibold rounded-full uppercase tracking-wider">
                  {project.country}
                </span>
                {project.city && (
                  <span className="px-3.5 py-1 bg-white/10 border border-white/10 text-slate-100 text-[10px] font-semibold rounded-full uppercase tracking-wider">
                    {project.city}
                  </span>
                )}
                <span className="px-3.5 py-1 bg-white/10 border border-white/10 text-slate-100 text-[10px] font-semibold rounded-full uppercase tracking-wider">
                  {project.region}
                </span>
                <span className="px-3.5 py-1 bg-white/10 border border-white/10 text-slate-100 text-[10px] font-semibold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 opacity-85 shrink-0" />
                  <span>{formattedDate.toUpperCase()}</span>
                </span>
              </div>

              {/* Title Typography */}
              <h1 className="text-2xl sm:text-3.5xl font-bold text-white leading-tight tracking-tight font-display">
                {project.title}
              </h1>

              {/* Details List */}
              <div className="space-y-4 pt-4 border-t border-white/10 max-w-xl text-left">
                <div className="flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-4.5 h-4.5 text-white/90" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-white/55 uppercase tracking-widest block mb-1.5 font-display">Target Audience</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.targetAudience.split(",").map(t => t.trim()).filter(Boolean).map(t => (
                        <span key={t} className="px-2.5 py-1 bg-white/10 border border-white/15 text-white text-[11px] font-bold rounded-md font-display uppercase tracking-wider">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Megaphone className="w-4.5 h-4.5 text-white/90" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-white/55 uppercase tracking-widest block mb-0.5 font-display">Channels</span>
                    <strong className="text-white text-sm sm:text-base font-semibold">{project.channels.join(", ")}</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Below Hero Case Study Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 ">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* LEFT MAIN DETAILS COLUMN (8/12 width) */}
            <div className="lg:col-span-8 space-y-8 text-left">
              
              {/* 1. Context & Objectives Section */}
              <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-brand-light/10 border border-brand-border/10 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-4.5 h-4.5 text-brand" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-display">Context & Objectives</h3>
                </div>

                <div className="space-y-5">
                  {/* Background Context Box */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/60 border-l-4 border-brand text-left">
                    <strong className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 font-display">Background Context</strong>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">{project.context}</p>
                  </div>

                  {/* Core Project Objective Box */}
                  <div className="bg-brand-light/5 p-5 rounded-xl border border-brand-border/10 border-l-4 border-brand text-left">
                    <strong className="text-[10px] font-bold text-brand uppercase tracking-widest block mb-2 font-display">Core Project Objective</strong>
                    <p className="text-slate-900 text-sm font-bold leading-relaxed">{project.objective}</p>
                  </div>
                </div>
              </section>

              {/* 2. Execution Process & Details Section */}
              <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-brand-light/10 border border-brand-border/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4.5 h-4.5 text-brand" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-display">Execution Process & Details</h3>
                </div>

                <div className="space-y-4 text-left">
                  {project.execution.map((step, idx) => (
                    <div key={idx} className="flex space-x-4 bg-white hover:bg-slate-50/50 p-4.5 rounded-xl border border-slate-200/60 shadow-3xs transition-all">
                      <div className="w-7 h-7 rounded-lg bg-brand-light/10 text-brand flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 3. Results & Achievements Section */}
              <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-brand-light/10 border border-brand-border/10 flex items-center justify-center shrink-0">
                    <Star className="w-4.5 h-4.5 text-brand" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-display">Results & Achievements</h3>
                </div>

                <ul className="space-y-4 text-left pl-1">
                  {project.results.map((result, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
                      <span className="text-brand font-extrabold text-sm shrink-0 mt-0.5">▸</span>
                      <span>{result}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 4. Lessons Learned Section (RECREATED DESIGN MATCHING SCREENSHOT) */}
              <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-brand-light/10 border border-brand-border/10 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-4.5 h-4.5 text-brand" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-display">Lessons Learned</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {/* What Worked */}
                  <div className="border-l-4 border-brand bg-brand-light/5 p-5 rounded-r-xl border border-slate-200/60">
                    <div className="flex items-center space-x-2 mb-3">
                      <CheckCircle className="w-4 h-4 text-brand shrink-0" />
                      <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider font-display">What Worked</span>
                    </div>
                    <ul className="space-y-3">
                      {lessons.whatWorked.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-slate-700 text-xs leading-relaxed">
                          <span className="text-brand font-bold shrink-0 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Challenges */}
                  <div className="border-l-4 border-slate-400 bg-slate-50/50 p-5 rounded-r-xl border border-slate-200/60">
                    <div className="flex items-center space-x-2 mb-3">
                      <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider font-display font-semibold">Challenges</span>
                    </div>
                    <ul className="space-y-3">
                      {lessons.challenges.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-slate-700 text-xs leading-relaxed">
                          <span className="text-slate-400 font-bold shrink-0 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* 5. Next Steps Section */}
              <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-brand-light/10 border border-brand-border/10 flex items-center justify-center shrink-0">
                    <ArrowRight className="w-4.5 h-4.5 text-brand" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-display">Next Steps</h3>
                </div>

                <div className="bg-slate-50 p-5 sm:p-6 rounded-xl border border-slate-200/60 text-left">
                  <ul className="space-y-4">
                    {project.nextSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start space-x-3 text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
                        <span className="text-brand font-bold shrink-0 text-sm mt-0.5">↳</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

            </div>

            {/* RIGHT SIDEBAR DETAILS COLUMN (4/12 width) */}
            <div className="lg:col-span-4 space-y-8 text-left">
              
              {/* Sidebar Measurable Metrics */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs text-left">
                <div className="flex items-center space-x-2 mb-6 pb-3 border-b border-gray-100">
                  <TrendingUp className="w-4.5 h-4.5 text-brand" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Measurable Metrics</h4>
                </div>
                <div className="space-y-6">
                  {project.metrics.map((metric, idx) => (
                    <div key={idx} className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0">
                      <div className="text-3.5xl font-black text-slate-900 tracking-tight mb-1">
                        {metric.value}
                      </div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-snug">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Team Card */}
              {(project.hqManager || project.localManager) && (
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs text-left">
                  <div className="flex items-center space-x-2 mb-5 pb-3 border-b border-gray-100">
                    <Users className="w-4.5 h-4.5 text-brand" />
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Project Team Leads</h4>
                  </div>
                  <div className="space-y-3.5">
                    {project.hqManager && (
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 flex items-center space-x-3.5">
                        <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs font-display">
                          {project.hqManager.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] text-brand font-bold uppercase tracking-widest block leading-none mb-1 font-display">HQ Lead Manager</span>
                          <span className="font-semibold text-slate-900 text-xs sm:text-sm block truncate">{project.hqManager}</span>
                        </div>
                      </div>
                    )}
                    {project.localManager && (
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 flex items-center space-x-3.5">
                        <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs font-display">
                          {project.localManager.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest block leading-none mb-1 font-display">Local Market Manager</span>
                          <span className="font-semibold text-slate-900 text-xs sm:text-sm block truncate">{project.localManager}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Discussion Section Widget */}
              <DiscussionSection project={project} onUpdateProject={onUpdateProject} currentUserProfile={currentUserProfile} />

            </div>

          </div>
        </div>
      </div>
    </div>
  );

  if (isMaximized) {
    return (
      <div className="fixed inset-0 z-50 bg-[#F8F9FA] overflow-y-auto flex flex-col h-screen">
        {modalContent}
        {showReplicationGuide && (
          <ReplicationGuideModal 
            project={project}
            onClose={() => setShowReplicationGuide(false)}
            onConfirm={onReplicate}
          />
        )}
        {showDeleteConfirm && (
          <DeleteConfirmModal
            projectTitle={project.title}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={() => {
              if (onDelete) {
                onDelete(project.id);
              }
            }}
          />
        )}
        {showLightbox && (
          <LightboxModal
            images={project.images.length > 0 ? project.images : [getPlaceholderImage(project.region, project.title)]}
            initialIdx={lightboxIdx}
            onClose={() => setShowLightbox(false)}
            title={project.title}
          />
        )}
      </div>
    );
  }

  // Centered Dialogue format
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
      />
      
      {/* Modal Card */}
      <div className="relative w-full sm:max-w-7xl bg-[#F8F9FA] rounded-none sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full sm:h-[90vh] z-10 border-0 sm:border border-slate-200 animate-scaleUp">
        {modalContent}
        {showReplicationGuide && (
          <ReplicationGuideModal 
            project={project}
            onClose={() => setShowReplicationGuide(false)}
            onConfirm={onReplicate}
          />
        )}
        {showDeleteConfirm && (
          <DeleteConfirmModal
            projectTitle={project.title}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={() => {
              if (onDelete) {
                onDelete(project.id);
              }
            }}
          />
        )}
        {showLightbox && (
          <LightboxModal
            images={project.images.length > 0 ? project.images : [getPlaceholderImage(project.region, project.title)]}
            initialIdx={lightboxIdx}
            onClose={() => setShowLightbox(false)}
            title={project.title}
          />
        )}
      </div>
    </div>
  );
}

interface DeleteConfirmModalProps {
  projectTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteConfirmModal({ projectTitle, onClose, onConfirm }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/75 backdrop-blur-sm">
      <div 
        onClick={onClose}
        className="fixed inset-0 transition-opacity cursor-default"
      />
      
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col p-6 text-left animate-scaleUp z-10">
        <div className="flex items-start space-x-3.5">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 shadow-sm">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-gray-900 tracking-tight font-display">Delete Case Study?</h4>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider block mt-0.5">Permanent Action</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Are you absolutely sure you want to delete <span className="font-bold text-slate-900">"{projectTitle}"</span>?
          </p>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-2.5">
            This action <span className="text-red-600 font-bold">cannot be undone</span>. All content, comments, and metrics associated with this case study will be permanently deleted and you will no longer have access to it.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer font-display text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer font-display text-center shadow-lg shadow-red-500/15"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}

interface LightboxModalProps {
  images: string[];
  initialIdx: number;
  onClose: () => void;
  title: string;
}

function LightboxModal({ images, initialIdx, onClose, title }: LightboxModalProps) {
  const [currentIdx, setCurrentIdx] = useState(initialIdx);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIdx(prev => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIdx(prev => (prev + 1) % images.length);
  };

  const currentMediaUrl = images[currentIdx];
  const isVideo = isVideoUrl(currentMediaUrl);
  const embedUrl = isVideo ? getEmbedUrl(currentMediaUrl) : null;

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md  p-4 md:p-8">
      {/* Top Bar inside Lightbox */}
      <div className="absolute top-0 inset-x-0 p-4 md:p-6 flex items-center justify-between text-white bg-gradient-to-b from-black/80 to-transparent z-10">
        <div className="text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">Project Visual Maximized</p>
          <h4 className="text-sm font-semibold truncate text-white max-w-xs sm:max-w-md md:max-w-xl font-display">{title}</h4>
        </div>
        <div className="flex items-center space-x-3.5 shrink-0">
          <span className="text-xs font-bold text-slate-300 font-mono">
            {currentIdx + 1} of {images.length}
          </span>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all active:scale-95 border border-white/5 cursor-pointer flex items-center justify-center"
            title="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-5xl aspect-video relative flex items-center justify-center p-2 rounded-2xl overflow-hidden bg-black/40 border border-white/5">
        {isVideo ? (
          embedUrl ? (
            <iframe
              src={`${embedUrl}?autoplay=1`}
              className="w-full h-full rounded-xl border-0"
              allow="autoplay; fullscreen"
              allowFullScreen
              title="Maximized Project Video"
            />
          ) : (
            <video
              src={currentMediaUrl}
              autoPlay
              controls
              className="w-full h-full object-contain rounded-xl"
            />
          )
        ) : (
          <img
            src={currentMediaUrl}
            alt="Maximized Project View"
            className="w-full h-full object-contain rounded-xl max-h-[80vh]"
          />
        )}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all active:scale-90 border border-white/5 cursor-pointer z-10 flex items-center justify-center"
            title="Previous Visual"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all active:scale-90 border border-white/5 cursor-pointer z-10 flex items-center justify-center"
            title="Next Visual"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Thumbnails strip at the bottom */}
      {images.length > 1 && (
        <div className="absolute bottom-6 flex items-center justify-center gap-2 max-w-full overflow-x-auto px-4 z-10">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIdx(idx);
              }}
              className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                currentIdx === idx ? 'border-brand scale-110 shadow-lg' : 'border-white/20 opacity-50 hover:opacity-100'
              }`}
            >
              {isVideoUrl(img) ? (
                <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
                  <Play className="w-4 h-4 text-white fill-white/10" />
                </div>
              ) : (
                <img src={img} alt="Thumb" className="w-full h-full object-cover animate-fadeIn" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

