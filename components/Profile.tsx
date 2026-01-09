
import React, { useState } from 'react';
import { User } from '../types';
import { 
  Mail, Edit3, Save, Plus, X, BookOpen, GraduationCap, 
  Camera, Award, Video, Coins, CheckCircle, AlertCircle 
} from 'lucide-react';

interface ProfileProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user);
  const [newTeachSkill, setNewTeachSkill] = useState('');
  const [newLearnSkill, setNewLearnSkill] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    onUpdateUser(editedUser);
    setIsEditing(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const addSkill = (type: 'teach' | 'learn') => {
    if (type === 'teach' && newTeachSkill.trim()) {
      if (!editedUser.skillsToTeach.includes(newTeachSkill.trim())) {
        setEditedUser({ ...editedUser, skillsToTeach: [...editedUser.skillsToTeach, newTeachSkill.trim()] });
      }
      setNewTeachSkill('');
    } else if (type === 'learn' && newLearnSkill.trim()) {
      if (!editedUser.skillsToLearn.includes(newLearnSkill.trim())) {
        setEditedUser({ ...editedUser, skillsToLearn: [...editedUser.skillsToLearn, newLearnSkill.trim()] });
      }
      setNewLearnSkill('');
    }
  };

  const removeSkill = (type: 'teach' | 'learn', skill: string) => {
    if (type === 'teach') {
      setEditedUser({ ...editedUser, skillsToTeach: editedUser.skillsToTeach.filter(s => s !== skill) });
    } else {
      setEditedUser({ ...editedUser, skillsToLearn: editedUser.skillsToLearn.filter(s => s !== skill) });
    }
  };

  const changeAvatar = () => {
    const newSeed = Math.floor(Math.random() * 1000);
    const newAvatar = `https://picsum.photos/seed/${newSeed}/200`;
    setEditedUser({ ...editedUser, avatar: newAvatar });
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fadeIn transition-colors duration-300">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-8 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slideIn">
          <CheckCircle size={20} />
          <span className="font-bold">Profile updated successfully!</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="h-48 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-900 relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="absolute -bottom-1 left-0 right-0 h-12 bg-white dark:bg-slate-900 rounded-t-[3rem]"></div>
        </div>
        
        <div className="px-6 lg:px-12 pb-12">
          {/* Profile Header Area */}
          <div className="flex flex-col md:flex-row md:items-end -mt-16 mb-10 gap-6">
            <div className="relative group mx-auto md:mx-0">
              <img 
                src={isEditing ? editedUser.avatar : user.avatar} 
                className="w-36 h-36 rounded-[2.5rem] border-8 border-white dark:border-slate-800 shadow-2xl object-cover transition-transform group-hover:scale-[1.02]" 
              />
              {isEditing && (
                <button 
                  onClick={changeAvatar}
                  className="absolute bottom-2 right-2 p-3 bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center"
                  title="Change Avatar"
                >
                  <Camera size={18} />
                </button>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-none">
                  {isEditing ? (
                    <input 
                      type="text"
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                      className="bg-slate-50 dark:bg-slate-800 border-b-2 border-indigo-600 outline-none px-2 py-1 w-full max-w-xs text-slate-800 dark:text-white"
                    />
                  ) : user.name}
                </h2>
                {!isEditing && (
                  <div className="flex items-center justify-center md:justify-start gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-sm font-bold w-fit mx-auto md:mx-0">
                    <Award size={14} fill="currentColor" />
                    <span>Level {Math.floor(user.sessionsCompleted / 5) + 1} Expert</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center md:justify-start text-slate-500 dark:text-slate-400 mt-2 font-medium">
                <Mail size={16} className="mr-2 text-indigo-400" />
                <span>{user.email}</span>
              </div>
            </div>

            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button 
                    onClick={() => { setIsEditing(false); setEditedUser(user); }}
                    className="flex-1 md:flex-none px-6 py-3 rounded-2xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex-1 md:flex-none px-6 py-3 rounded-2xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    <span>Save Changes</span>
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full md:w-auto px-8 py-3 rounded-2xl font-bold bg-slate-900 dark:bg-slate-800 text-white hover:bg-black dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <Edit3 size={18} />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Lessons Done</p>
              <div className="flex items-center justify-center gap-2 text-slate-900 dark:text-white font-black text-xl">
                <Video size={18} className="text-indigo-500" /> {user.sessionsCompleted}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Skills Mastery</p>
              <div className="flex items-center justify-center gap-2 text-slate-900 dark:text-white font-black text-xl">
                <BookOpen size={18} className="text-emerald-500" /> {user.skillsToTeach.length + user.skillsToLearn.length}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Current Credits</p>
              <div className="flex items-center justify-center gap-2 text-slate-900 dark:text-white font-black text-xl">
                <Coins size={18} className="text-amber-500" /> {user.credits}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column: Bio & Teaching */}
            <div className="space-y-10">
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Edit3 size={14} /> About Me
                  </h3>
                  {isEditing && (
                    <span className={`text-[10px] font-bold ${editedUser.bio.length > 250 ? 'text-rose-500' : 'text-slate-400'}`}>
                      {editedUser.bio.length}/300
                    </span>
                  )}
                </div>
                {isEditing ? (
                  <textarea 
                    value={editedUser.bio}
                    onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value.slice(0, 300) })}
                    className="w-full p-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[2rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all text-sm leading-relaxed text-slate-800 dark:text-white"
                    rows={5}
                    placeholder="Tell the community about your expertise and what you're looking for..."
                  />
                ) : (
                  <div className="relative">
                    <div className="absolute -left-3 -top-3 text-indigo-100 dark:text-indigo-900/20">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C20.1216 16 21.017 16.8954 21.017 18V21C21.017 22.1046 20.1216 23 19.017 23H16.017C14.9124 23 14.017 22.1046 14.017 21ZM14.017 21V10H21.017V21M3 21L3 18C3 16.8954 3.89543 16 5 16H8C9.10457 16 10 16.8954 10 18V21C10 22.1046 9.10457 23 8 23H5C3.89543 23 3 22.1046 3 21ZM3 21V10H10V21M3 7V4C3 2.89543 3.89543 2 5 2H8C9.10457 2 10 2.89543 10 4V7H3ZM14.017 7V4C14.017 2.89543 14.9124 2 16.017 2H19.017C20.1216 2 21.017 2.89543 21.017 4V7H14.017Z" opacity="0.1"/></svg>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-800/30 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 relative z-10 italic">
                      "{user.bio || "No bio added yet. Tell us about yourself!"}"
                    </p>
                  </div>
                )}
              </section>

              <section className="p-8 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-[2.5rem] border border-indigo-100/50 dark:border-indigo-900/30">
                <h3 className="flex items-center text-indigo-900 dark:text-indigo-300 font-black text-lg mb-6">
                  <GraduationCap className="mr-3 text-indigo-600" size={24} />
                  Skills I Can Teach
                </h3>
                <div className="flex flex-wrap gap-2.5 mb-6">
                  {(isEditing ? editedUser : user).skillsToTeach.map(skill => (
                    <span key={skill} className="bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl text-sm font-bold text-indigo-700 dark:text-indigo-400 flex items-center shadow-sm border border-indigo-100 dark:border-indigo-800 transition-all hover:scale-105">
                      {skill}
                      {isEditing && (
                        <button onClick={() => removeSkill('teach', skill)} className="ml-3 text-rose-400 hover:text-rose-600 p-0.5 hover:bg-rose-50 dark:hover:bg-rose-900 rounded-md transition-colors">
                          <X size={14} />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      value={newTeachSkill}
                      onChange={(e) => setNewTeachSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill('teach')}
                      placeholder="Add expertise..."
                      className="flex-1 px-5 py-3 bg-white dark:bg-slate-800 border-2 border-indigo-100 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-600 transition-all text-sm text-slate-800 dark:text-white"
                    />
                    <button onClick={() => addSkill('teach')} className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg"><Plus size={24} /></button>
                  </div>
                )}
              </section>
            </div>

            <div className="space-y-10">
               <section className="p-8 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-[2.5rem] border border-emerald-100/50 dark:border-emerald-900/30">
                <h3 className="flex items-center text-emerald-900 dark:text-emerald-300 font-black text-lg mb-6">
                  <BookOpen className="mr-3 text-emerald-600" size={24} />
                  Skills I Want to Learn
                </h3>
                <div className="flex flex-wrap gap-2.5 mb-6">
                  {(isEditing ? editedUser : user).skillsToLearn.map(skill => (
                    <span key={skill} className="bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl text-sm font-bold text-emerald-700 dark:text-emerald-400 flex items-center shadow-sm border border-emerald-100 dark:border-emerald-800 transition-all hover:scale-105">
                      {skill}
                      {isEditing && (
                        <button onClick={() => removeSkill('learn', skill)} className="ml-3 text-rose-400 hover:text-rose-600 p-0.5 hover:bg-rose-50 dark:hover:bg-rose-900 rounded-md transition-colors">
                          <X size={14} />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      value={newLearnSkill}
                      onChange={(e) => setNewLearnSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill('learn')}
                      placeholder="Add a goal..."
                      className="flex-1 px-5 py-3 bg-white dark:bg-slate-800 border-2 border-emerald-100 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-600 transition-all text-sm text-slate-800 dark:text-white"
                    />
                    <button onClick={() => addSkill('learn')} className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg"><Plus size={24} /></button>
                  </div>
                )}
              </section>

              <div className="bg-slate-900 dark:bg-slate-800/80 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <BrainCircuit size={28} className="text-indigo-400 animate-pulse" />
                    <h4 className="text-xl font-black">Sync Protocol</h4>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    Safety Update: You have blocked {user.blockedUserIds.length} users. These settings are encrypted and managed by Gemini security.
                  </p>
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-400/10 w-fit px-4 py-2 rounded-xl border border-emerald-400/20">
                    <CheckCircle size={14} />
                    <span>Security Layer: Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BrainCircuit = ({ size, className }: { size: number, className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 .98 4.96 2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 4.96.46 2.5 2.5 0 0 0 1.98-3 2.5 2.5 0 0 0-.98-4.96 2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 0 1.98-3 2.5 2.5 0 0 0-4.96.46Z"/><path d="M9 10a3 3 0 1 1 6 0"/><path d="M12 13V11"/></svg>
);

export default Profile;
