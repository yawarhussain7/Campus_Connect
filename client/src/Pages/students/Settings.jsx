// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../../Components/common/Sidebar';
import Header from '../../Components/common/Header';
import {
  User,
  Bell,
  Save,
  Lock,
  Camera,
  Key
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { updateProfile } from '../../api/profile';
import { toast } from 'react-toastify';

export default function Settings() {
  const { user, updateUserState } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('account');

  // Account & Academic State
  const [accountForm, setAccountForm] = useState({
    fullName: '',
    email: '',
    studentId: '',
    profileImage: null
  });

  // Notifications State
  const [preferences, setPreferences] = useState({
    emailDigest: 'weekly',
    systemNotifications: true,
    marketingEmails: false,
  });

  // Security State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setAccountForm(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        studentId: user._id ? user._id.slice(-8).toUpperCase() : 'N/A'
      }));
    }
  }, [user]);

  const handleInputChange = (section, field, value) => {
    if (section === 'account') {
      setAccountForm(prev => ({ ...prev, [field]: value }));
    } else if (section === 'security') {
      setPasswordForm(prev => ({ ...prev, [field]: value }));
    } else {
      setPreferences(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProfile({
        name: accountForm.fullName,
        email: accountForm.email
      });
      if (response.success) {
        updateUserState(response.data);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 font-sans antialiased">
      <Sidebar currentView="settings" />

      <div className="flex-1 xl:pl-64 flex flex-col min-w-0">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <main className="flex-1 p-6 md:p-8 max-w-[1200px] w-full mx-auto space-y-6">
          <div className="border-b border-slate-200 pb-5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Account Settings</h1>
            <p className="text-sm text-slate-500 mt-1">
              Configure your institutional identity matrix, security credentials, and data delivery metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            <div className="lg:col-span-1 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 border-b lg:border-b-0 border-slate-200">
              {[
                { id: 'account', label: 'Academic Profile', icon: User },
                { id: 'security', label: 'Security', icon: Key },
                { id: 'notifications', label: 'Notifications', icon: Bell }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/10'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="lg:col-span-3">
              <form onSubmit={handleSaveChanges} className="space-y-6">
                
                {/* Section: Academic Profile */}
                {activeTab === 'account' && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                      <div className="relative">
                        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center border-2 border-slate-300 overflow-hidden">
                          {accountForm.profileImage ? (
                            <img src={accountForm.profileImage} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <User className="h-8 w-8 text-slate-400" />
                          )}
                        </div>
                        <label className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                          <Camera className="h-3 w-3 text-white" />
                          <input type="file" className="hidden" onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) setAccountForm(prev => ({ ...prev, profileImage: URL.createObjectURL(file) }));
                          }} />
                        </label>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">Profile Image</h3>
                        <p className="text-[11px] text-slate-400">JPG, PNG or GIF (Max 2MB).</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Legal Name</label>
                        <input type="text" value={accountForm.fullName} onChange={(e) => handleInputChange('account', 'fullName', e.target.value)} className="w-full text-xs rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 transition-all font-medium" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Student ID</label>
                        <input type="text" disabled value={accountForm.studentId} className="w-full text-xs rounded-xl px-3.5 py-2.5 bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed font-mono" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Primary Academic Email</label>
                        <input type="email" value={accountForm.email} onChange={(e) => handleInputChange('account', 'email', e.target.value)} className="w-full text-xs rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 transition-all font-medium" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Section: Security */}
                {activeTab === 'security' && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                      <Lock className="h-4 w-4 text-blue-600" />
                      <h2 className="text-sm font-bold text-slate-800">Authentication Security</h2>
                    </div>
                    <div className="space-y-4">
                      {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
                        <div key={field}>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            {field.replace(/([A-Z])/g, ' $1').toUpperCase()}
                          </label>
                          <input 
                            type="password"
                            value={passwordForm[field]}
                            onChange={(e) => handleInputChange('security', field, e.target.value)}
                            className="w-full text-xs rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section: Notifications */}
                {activeTab === 'notifications' && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                      <Bell className="h-4 w-4 text-blue-600" />
                      <h2 className="text-sm font-bold text-slate-800">Communication & Alert Systems</h2>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-xs font-medium text-slate-700">Email Digest</p>
                          <p className="text-[10px] text-slate-400">Receive weekly summary of activity</p>
                        </div>
                        <select
                          value={preferences.emailDigest}
                          onChange={(e) => handleInputChange('preferences', 'emailDigest', e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-xs rounded-xl p-2 outline-none focus:border-blue-500"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="never">Never</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-xs font-medium text-slate-700">System Notifications</p>
                          <p className="text-[10px] text-slate-400">In-app alerts for updates</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.systemNotifications}
                            onChange={(e) => handleInputChange('preferences', 'systemNotifications', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95">
                    <Save className="h-4 w-4" />
                    <span>Commit Settings Payload</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}