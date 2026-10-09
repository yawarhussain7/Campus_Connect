// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../../Components/common/Sidebar';
import Header from '../../Components/common/Header';
import ModernSelect from '../../Components/common/ModernSelect';
import {
  User,
  Bell,
  Save,
  Lock,
  Camera,
  Key,
  Loader2,
  Mail,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { updateProfile, uploadProfileImage, avatarUrl } from '../../api/profile';
import { ResendVerificationEmail } from '../../api/auth';
import { toast } from 'react-toastify';

export default function Settings() {
  const { user, updateUserState } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('account');

  // Account & Academic State
  // `profileImage` is what the avatar box previews (the saved avatar URL or a
  // local blob URL); `avatarFile` is the freshly picked File that gets uploaded.
  const [accountForm, setAccountForm] = useState({
    fullName: '',
    email: '',
    studentId: '',
    profileImage: null,
    avatarFile: null
  });

  const [saving, setSaving] = useState(false);

  // Drives the "Resend verification email" button in the account tab. The
  // address travels in the body, since this endpoint is shared with the
  // post-signup screen where no session exists.
  const [resendingEmail, setResendingEmail] = useState(false);

  // Emails a fresh verification link to the signed-in user. The old link (if
  // any) is invalidated server-side, since a new token overwrites it.
  const handleResendVerification = async () => {
    setResendingEmail(true);

    try {
      const response = await ResendVerificationEmail(user?.email);

      if (response.success) {
        toast.success(response.message || 'Verification email sent — check your inbox.');
      } else {
        toast.error(response.message || 'Could not send the verification email.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || 'Could not send the verification email.');
    } finally {
      setResendingEmail(false);
    }
  };

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

  // A picked image is previewed immediately; the File itself is kept so the
  // save handler can upload it as multipart/form-data.
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAccountForm((prev) => {
      if (prev.profileImage?.startsWith('blob:')) {
        URL.revokeObjectURL(prev.profileImage);
      }

      return {
        ...prev,
        profileImage: URL.createObjectURL(file),
        avatarFile: file
      };
    });
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { fullName, email, avatarFile } = accountForm;

      let response;

      if (avatarFile) {
        // Multipart, so the picture itself reaches the server.
        const formData = new FormData();
        formData.append('name', fullName);
        formData.append('email', email);
        formData.append('avatar', avatarFile);

        response = await uploadProfileImage(formData);
      } else {
        response = await updateProfile({ name: fullName, email });
      }

      if (response.success) {
        updateUserState(response.data);
        setAccountForm((prev) => ({ ...prev, avatarFile: null }));
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Prefer the freshly picked picture, otherwise show the saved avatar.
  const avatarPreview = accountForm.profileImage || avatarUrl(user?.avatar);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 font-sans antialiased">
      <Sidebar currentView="settings" />

      <div className="flex-1 xl:pl-64 flex flex-col min-w-0">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1200px] w-full mx-auto space-y-4">
          <div className="border-b border-slate-200 pb-5">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Account Settings</h1>
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
              <form onSubmit={handleSaveChanges} className="space-y-4">
                
                {/* Section: Academic Profile */}
                {activeTab === 'account' && (
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                      <div className="relative">
                        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center border-2 border-slate-300 overflow-hidden">
                          {avatarPreview ? (
                            <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <User className="h-8 w-8 text-slate-400" />
                          )}
                        </div>
                        <label className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                          <Camera className="h-3 w-3 text-white" />
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                      <div>
                        <h3 className="text-[13px] font-semibold text-slate-800">Profile Image</h3>
                        <p className="text-[11px] text-slate-400">JPG, PNG or GIF (Max 2MB).</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-[0.07em] mb-1.5">Full Legal Name</label>
                        <input type="text" value={accountForm.fullName} onChange={(e) => handleInputChange('account', 'fullName', e.target.value)} className="w-full text-xs rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 transition-all font-medium" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-[0.07em] mb-1.5">Student ID</label>
                        <input type="text" disabled value={accountForm.studentId} className="w-full text-xs rounded-xl px-3.5 py-2.5 bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed font-mono" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-[0.07em] mb-1.5">Primary Academic Email</label>
                        <input type="email" value={accountForm.email} onChange={(e) => handleInputChange('account', 'email', e.target.value)} className="w-full text-xs rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 transition-all font-medium" />
                      </div>

                      {/* Email verification status. `isEmailVerified` arrives with
                          the profile payload; unverified accounts can request a
                          fresh link without leaving this page. */}
                      <div className="md:col-span-2 flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="flex items-center gap-3">
                          {user?.isEmailVerified ? (
                            <>
                              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100">
                                <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
                              </span>
                              <div>
                                <p className="text-xs font-semibold text-slate-800">Email verified</p>
                                <p className="text-[11px] text-slate-400">Your address is confirmed — no action needed.</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-100">
                                <ShieldAlert className="h-4.5 w-4.5 text-amber-600" />
                              </span>
                              <div>
                                <p className="text-xs font-semibold text-slate-800">Email not verified</p>
                                <p className="text-[11px] text-slate-400">Check your inbox for the verification link.</p>
                              </div>
                            </>
                          )}
                        </div>

                        {!user?.isEmailVerified && (
                          <button
                            type="button"
                            onClick={handleResendVerification}
                            disabled={resendingEmail}
                            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-[11px] font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {resendingEmail ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Mail className="h-3.5 w-3.5" />
                            )}
                            {resendingEmail ? 'Sending…' : 'Resend link'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Section: Security */}
                {activeTab === 'security' && (
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                      <Lock className="h-4 w-4 text-blue-600" />
                      <h2 className="text-[13px] font-semibold text-slate-800">Authentication Security</h2>
                    </div>
                    <div className="space-y-4">
                      {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
                        <div key={field}>
                          <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-[0.07em] mb-1.5">
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
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                      <Bell className="h-4 w-4 text-blue-600" />
                      <h2 className="text-[13px] font-semibold text-slate-800">Communication & Alert Systems</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2">
                          <div>
                            <p className="text-xs font-medium text-slate-700">Email Digest</p>
                            <p className="text-[10px] text-slate-400">Receive weekly summary of activity</p>
                          </div>
                          <ModernSelect
                            value={preferences.emailDigest}
                            onChange={(value) => handleInputChange('preferences', 'emailDigest', value)}
                            options={[
                              { value: 'daily', label: 'Daily' },
                              { value: 'weekly', label: 'Weekly' },
                              { value: 'never', label: 'Never' }
                            ]}
                            placeholder="Select frequency"
                            className="w-32"
                          />
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
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    <span>{saving ? 'Saving…' : 'Commit Settings Payload'}</span>
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