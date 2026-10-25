import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Target, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Image as ImageIcon,
  Play,
  Star
} from 'lucide-react';
import { Project } from '../types';
import { isVideoUrl } from './ProjectDetailModal';

interface ProjectCardProps {
  project: Project;
  onViewDetails: () => void;
  onVote?: (id: string, voteType: 'up' | 'down') => void;
  userVote?: 'up' | 'down' | null;
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

export default function ProjectCard({ project, onViewDetails, onVote, userVote }: ProjectCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const firstMediaUrl = project.images[0] || getPlaceholderImage(project.region, project.title);
  const isFirstVideo = isVideoUrl(firstMediaUrl);
  const isEmbedVideo = isFirstVideo && (firstMediaUrl.includes('youtube.com') || firstMediaUrl.includes('youtu.be') || firstMediaUrl.includes('vimeo.com'));

  const currentBackMediaUrl = project.images[activeImageIdx] || getPlaceholderImage(project.region, project.title);
  const isBackVideo = isVideoUrl(currentBackMediaUrl);
  const isBackEmbedVideo = isBackVideo && (currentBackMediaUrl.includes('youtube.com') || currentBackMediaUrl.includes('youtu.be') || currentBackMediaUrl.includes('vimeo.com'));

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev + 1) % project.images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="perspective-1000 w-full h-[515px] cursor-pointer" 
      onClick={(e) => {
        if (!isFlipped) {
          onViewDetails();
        }
      }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="w-full h-full transform-style-3d relative"
      >
        {/* ================= FRONT SIDE ================= */}
        <div className={`absolute inset-0 backface-hidden bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden ${isFlipped ? 'pointer-events-none' : 'pointer-events-auto'}`}>
          {/* Cover Image Header */}
          <div className="h-[135px] shrink-0 bg-slate-100 relative overflow-hidden group/img">
            {isFirstVideo && !isEmbedVideo ? (
              <video 
                src={firstMediaUrl} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                muted 
                loop 
                autoPlay 
                playsInline 
              />
            ) : (
              <img 
                src={firstMediaUrl} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
              />
            )}
            {isFirstVideo && isEmbedVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                <div className="bg-slate-900/90 text-white p-2 rounded-full shadow-lg border border-white/10 flex items-center justify-center">
                  <Play className="w-4.5 h-4.5 fill-white/25" />
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
            
            {/* Top Badges */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
              <span className="px-2 py-0.5 bg-slate-900/95 text-white text-[9px] font-black uppercase tracking-wider rounded shadow-sm backdrop-blur-xs">
                {project.country}
              </span>
              <span className="px-2 py-0.5 bg-slate-900/75 text-slate-200 text-[9px] font-bold uppercase tracking-wider rounded shadow-sm backdrop-blur-xs border border-white/5">
                {project.region}
              </span>
            </div>

            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10" onClick={(e) => e.stopPropagation()}>
              {/* Upvote & Downvote Pill */}
              <div className="flex items-center space-x-1 bg-white/95 text-slate-800 text-[9px] font-bold rounded px-1.5 py-0.5 shadow-sm backdrop-blur-xs border border-white/20">
                <button 
                  onClick={() => onVote?.(project.id, 'up')}
                  className={`transition-colors flex items-center space-x-0.5 cursor-pointer ${userVote === 'up' ? 'text-emerald-600 font-extrabold' : 'text-slate-500 hover:text-emerald-600'}`}
                  title="Upvote Project"
                >
                  <ThumbsUp className={`w-2.5 h-2.5 ${userVote === 'up' ? 'fill-emerald-500/20 text-emerald-600' : 'text-slate-500'}`} />
                  <span className="font-bold">{project.upvotes ?? 0}</span>
                </button>
                <span className="text-slate-300 font-normal">|</span>
                <button 
                  onClick={() => onVote?.(project.id, 'down')}
                  className={`transition-colors flex items-center space-x-0.5 cursor-pointer ${userVote === 'down' ? 'text-brand font-extrabold' : 'text-slate-500 hover:text-brand'}`}
                  title="Downvote Project"
                >
                  <ThumbsDown className={`w-2.5 h-2.5 ${userVote === 'down' ? 'fill-brand/20 text-brand' : 'text-slate-500'}`} />
                  <span className="font-bold">{project.downvotes ?? 0}</span>
                </button>
              </div>
            </div>

            {/* Title Overlaid */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5">
              <h3 className="text-white text-sm sm:text-base font-bold font-display leading-tight tracking-tight drop-shadow-sm line-clamp-1">
                {project.title}
              </h3>
            </div>
          </div>

          {/* Main Body */}
          <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
            
            {/* Target Audience & Date (Styled like the Draft) */}
            <div className="flex flex-nowrap items-center gap-1.5 text-[11px] w-full overflow-hidden">
              {project.date && (
                <div className="flex items-center space-x-1 bg-brand-light border border-brand-border px-1.5 py-0.5 rounded text-brand shrink-0">
                  <Calendar className="w-3 h-3 text-brand shrink-0" />
                  <span className="font-bold text-[9px] uppercase tracking-wide whitespace-nowrap">
                    {new Date(project.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}
                  </span>
                </div>
              )}
            </div>

            {/* Project Details Section */}
            <div className="space-y-0.5">
              <div className="flex items-center space-x-1 text-slate-800 text-[9px] font-bold uppercase tracking-wider">
                <AlertCircle className="w-3 h-3 text-brand" />
                <span className="font-display">Project Context</span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 leading-snug">
                {project.context}
              </p>
            </div>

            {/* Achievements & Results Section */}
            <div className="space-y-0.5 pt-1.5 border-t border-slate-100">
              <div className="flex items-center space-x-1 text-slate-800 text-[9px] font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3 text-brand" />
                <span className="font-display">Key Achievements</span>
              </div>
              <ul className="text-xs text-slate-500 space-y-0.5">
                {project.results.slice(0, 2).map((result, idx) => (
                  <li key={idx} className="flex items-start space-x-1">
                    <span className="text-emerald-600 font-bold text-[10px] mt-0.5 flex-shrink-0">✓</span>
                    <span className="line-clamp-1 leading-normal text-slate-600">{result}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Measurable Metrics Grid */}
            <div className="pt-1.5 border-t border-slate-100">
              <div className="flex items-center space-x-1 text-slate-800 text-[9px] font-bold uppercase tracking-wider mb-1">
                <TrendingUp className="w-3 h-3 text-brand" />
                <span className="font-display">Measurable Metrics</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {project.metrics.slice(0, 2).map((metric, idx) => (
                  <div key={idx} className="bg-slate-50/70 p-1.5 rounded-lg border border-slate-100/80 flex flex-col justify-center">
                    <span className="text-sm font-black text-brand leading-none tracking-tight font-mono">
                      {metric.value}
                    </span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider truncate mt-0.5">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contributors Section */}
            {(project.hqManager || project.localManager) && (
              <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Contributors</span>
                <div className="flex items-center -space-x-1">
                  {project.hqManager && (
                    <div 
                      className="w-4.5 h-4.5 rounded-full bg-slate-900 border border-white flex items-center justify-center text-[8px] font-extrabold text-white shadow-sm font-mono"
                      title={`HQ Lead: ${project.hqManager}`}
                    >
                      {project.hqManager.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  {project.localManager && (
                    <div 
                      className="w-4.5 h-4.5 rounded-full bg-slate-700 border border-white flex items-center justify-center text-[8px] font-extrabold text-slate-200 shadow-sm font-mono"
                      title={`Local Lead: ${project.localManager}`}
                    >
                      {project.localManager.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1.5">
              <button 
                type="button"
                onClick={handleFlip}
                className="flex items-center space-x-1 px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold transition-all duration-200 cursor-pointer border border-slate-200/50"
              >
                <ImageIcon className="w-3 h-3 text-brand" />
                <span>Screenshots ({project.images.length})</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails();
                }}
                className="flex items-center space-x-0.5 text-slate-800 hover:text-brand text-[10px] font-bold cursor-pointer group-hover/img:text-brand transition-colors"
              >
                <span>Details</span>
                <ChevronRight className="w-3 h-3 text-brand" />
              </button>
            </div>
          </div>
        </div>

        {/* ================= BACK SIDE (SCREENSHOTS / IMAGES GALLERY) ================= */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className={`absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 rounded-2xl shadow-xl flex flex-col overflow-hidden text-white border border-slate-800 ${isFlipped ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
          
          {/* Header */}
          <div className="p-2 border-b border-slate-800 flex items-center justify-between bg-slate-950">
            <div>
              <div className="text-[8px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-slate-400" />
                <span className="font-display">Visual Assets & Screenshots</span>
              </div>
              <h4 className="text-[11px] font-bold truncate text-slate-200 max-w-[180px] font-display mt-0.5">
                {project.title}
              </h4>
            </div>
            <button
              type="button"
              onClick={handleFlip}
              className="flex items-center space-x-1 px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-md text-[10px] font-bold transition-colors"
            >
              <ArrowLeft className="w-3 h-3 text-slate-300" />
              <span>Back</span>
            </button>
          </div>

          {/* Interactive Screen Viewer */}
          <div className="flex-1 bg-slate-950 relative flex items-center justify-center p-2">
            <div className="relative w-full h-full max-h-[175px] rounded-lg overflow-hidden shadow-inner group/viewer border border-slate-800">
              {isBackVideo && !isBackEmbedVideo ? (
                <video 
                  src={currentBackMediaUrl} 
                  className="w-full h-full object-cover animate-fadeIn"
                  muted 
                  loop 
                  autoPlay 
                  playsInline 
                />
              ) : (
                <img 
                  src={currentBackMediaUrl} 
                  alt={`${project.title} screenshot ${activeImageIdx + 1}`}
                  className="w-full h-full object-cover animate-fadeIn"
                />
              )}
              {isBackVideo && isBackEmbedVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/45 z-10 pointer-events-none">
                  <div className="bg-slate-900/90 text-white p-2 rounded-full shadow-lg border border-white/10 flex items-center justify-center">
                    <Play className="w-4.5 h-4.5 fill-white/20" />
                  </div>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2 z-10">
                <p className="text-center text-[9px] text-slate-300 font-medium">
                  Asset {activeImageIdx + 1} of {project.images.length}
                </p>
              </div>

              {project.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 p-1 bg-black/60 rounded-full hover:bg-black/90 text-white transition-colors border border-slate-700 z-20"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 bg-black/60 rounded-full hover:bg-black/90 text-white transition-colors border border-slate-700 z-20"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="p-1.5 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-1 overflow-x-auto">
            {project.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIdx(idx);
                }}
                className={`w-8 h-8 rounded overflow-hidden border transition-all shrink-0 relative ${
                  activeImageIdx === idx ? 'border-brand scale-105 shadow-md' : 'border-slate-700 opacity-60 hover:opacity-100'
                }`}
              >
                {isVideoUrl(img) ? (
                  <div className="w-full h-full bg-slate-950 flex items-center justify-center">
                    <Play className="w-2.5 h-2.5 text-slate-300 fill-slate-300/10" />
                  </div>
                ) : (
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                )}
              </button>
            ))}
          </div>

          {/* Quick Context summary of results */}
          <div className="p-2.5 bg-slate-950 text-[10px] text-slate-400 text-center border-t border-slate-800">
            <span className="font-semibold text-slate-300 font-display">Key Outcome:</span>{" "}
            {project.results[0] || "Project executed successfully with high impact."}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

