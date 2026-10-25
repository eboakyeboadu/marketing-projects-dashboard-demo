import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, User, Briefcase, Building, MapPin, Camera, Sparkles, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileSettingsModalProps {
  profile: UserProfile;
  onClose: () => void;
  onSave: (updated: Partial<UserProfile>) => void;
}

const PRESET_AVATARS = [
  { id: '1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', label: 'Indigo Specialist' },
  { id: '2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', label: 'Emerald Lead' },
  { id: '3', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', label: 'Amber Director' },
  { id: '4', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150', label: 'Rose Strategist' },
  { id: '5', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', label: 'Slate Executive' },
  { id: '6', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150', label: 'Cyan Architect' },
];

export default function ProfileSettingsModal({ profile, onClose, onSave }: ProfileSettingsModalProps) {
  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [organization, setOrganization] = useState(profile.organization);
  const [location, setLocation] = useState(profile.location);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showCustomUrlInput, setShowCustomUrlInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim() || profile.name,
      role: role.trim() || profile.role,
      organization: organization.trim() || profile.organization,
      location: location.trim() || profile.location,
      avatar: avatar
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="relative bg-white w-full sm:max-w-lg rounded-none sm:rounded-2xl shadow-2xl border-0 sm:border border-slate-200 overflow-hidden z-10 flex flex-col text-slate-800 h-full sm:h-auto sm:max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-brand/10 rounded-lg text-brand">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-display">Account Profile Settings</h3>
              <p className="text-[10px] text-gray-400 font-bold block">{profile.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-5 overflow-y-auto flex-1">
          {/* Avatar Picker Section */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Profile Image / Avatar</label>
            <div className="flex items-center space-x-4">
              <img 
                src={avatar} 
                alt="Current Avatar" 
                className="w-16 h-16 rounded-full object-cover border-2 border-brand/20 shadow-md shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-slate-700 block mb-1">Choose a professional preset</span>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_AVATARS.map((p) => {
                    const isSelected = avatar === p.url;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setAvatar(p.url);
                          setShowCustomUrlInput(false);
                        }}
                        className={`relative rounded-full overflow-hidden aspect-square border transition-all hover:scale-105 cursor-pointer ${
                          isSelected ? 'ring-2 ring-brand border-brand' : 'border-slate-200'
                        }`}
                        title={p.label}
                      >
                        <img 
                          src={p.url} 
                          alt="" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-brand/30 flex items-center justify-center text-white">
                            <Check className="w-4 h-4 stroke-[3px]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Custom URL Option toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowCustomUrlInput(!showCustomUrlInput)}
                className="text-[11px] text-brand hover:text-brand-hover font-bold hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Or use a custom photo URL</span>
              </button>
              
              {showCustomUrlInput && (
                <div className="mt-2 flex gap-2 animate-fadeIn">
                  <input
                    type="url"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customAvatarUrl.trim()) {
                        setAvatar(customAvatarUrl.trim());
                        setCustomAvatarUrl('');
                        setShowCustomUrlInput(false);
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white"
              />
            </div>

            {/* Job Title / Role */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>Job Title / Corporate Role</span>
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Regional Marketing Manager"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white"
              />
            </div>

            {/* Department / Organization */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>Department / Organization</span>
              </label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Global Campaigns & Activation"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white"
              />
            </div>

            {/* Market Location */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Preferred Location / Base Market</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Singapore (APAC HQ)"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3.5 pt-3.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-500 rounded-full text-xs font-bold hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-full text-xs font-bold shadow-md shadow-brand/10 hover:shadow-brand/20 active:scale-95 transition-all cursor-pointer"
            >
              Save Profile Details
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

