import React from 'react'
import { motion } from 'framer-motion'
import { 
  User, Bell, Shield, Globe, Moon, CreditCard, 
  ChevronRight, Camera, Mail, Phone, Lock, 
  Trash2, LogOut, ArrowLeft, Save
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

const SettingsPage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { settings, updateSetting, toggleSetting } = useSettings()

  const sections = [
    {
      title: 'Personal Information',
      icon: User,
      color: 'text-blue-500 bg-blue-50',
      items: [
        { label: 'Full Name', value: user?.name || 'Nikolas G.', type: 'text' },
        { label: 'Email Address', value: user?.email || 'nikolas.g@fleet.com', type: 'text' },
        { label: 'Phone Number', value: '+45 20 48 19 22', type: 'text' },
      ]
    },
    {
      title: 'Preferences',
      icon: Bell,
      color: 'text-amber-500 bg-amber-50',
      items: [
        { label: 'Email Notifications', value: settings.showActionRequired, type: 'toggle', key: 'showActionRequired' },
        { label: 'Map Hover Cards', value: settings.enableHoverCards, type: 'toggle', key: 'enableHoverCards' },
        { 
          label: 'System Theme', 
          value: settings.theme === 'dark' ? 'Dark Mode' : 'Light Mode', 
          type: 'theme-toggle',
          current: settings.theme 
        },
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      color: 'text-emerald-500 bg-emerald-50',
      items: [
        { label: 'Two-Factor Auth', value: 'Enabled', type: 'status' },
        { label: 'Last Password Change', value: '3 months ago', type: 'text' },
      ]
    }
  ]

  return (
    <div className="flex h-screen w-screen bg-soft-bg overflow-hidden">
      <Sidebar activeTab="Settings" setActiveTab={() => {}} />
      
      <main className="flex-1 flex flex-col gap-6 overflow-hidden p-4">
        <TopBar />
        
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto pb-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate(-1)}
                  className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-premium border border-white hover:bg-slate-50 transition-all"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-500" />
                </button>
                <div>
                  <h2 className="text-3xl font-bold text-tech-slate">Account Settings</h2>
                  <p className="text-sm text-slate-400 font-medium">Manage your profile and platform preferences</p>
                </div>
              </div>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-100 flex items-center gap-2 hover:bg-blue-700 transition-all">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>

            <div className="grid grid-cols-12 gap-8">
              {/* Left Side: Avatar & Quick Actions */}
              <div className="col-span-4 space-y-6">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-white flex flex-col items-center text-center">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white mb-6">
                      <img src={user?.photo || "https://i.pravatar.cc/150?u=nikolas"} alt="" className="w-full h-full object-cover" />
                    </div>
                    <button className="absolute bottom-6 right-0 w-10 h-10 bg-blue-600 text-white rounded-xl shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-tech-slate mb-1">{user?.name || 'Nikolas G.'}</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-6">{user?.role?.name || 'Fleet Director'}</p>
                  
                  <div className="w-full pt-6 border-t border-slate-50 space-y-3">
                    <button className="w-full p-4 rounded-2xl bg-slate-50 text-slate-600 text-xs font-bold flex items-center gap-3 hover:bg-slate-100 transition-all">
                      <Mail className="w-4 h-4 text-blue-500" />
                      Change Email
                    </button>
                    <button className="w-full p-4 rounded-2xl bg-slate-50 text-slate-600 text-xs font-bold flex items-center gap-3 hover:bg-slate-100 transition-all">
                      <Lock className="w-4 h-4 text-amber-500" />
                      Reset Password
                    </button>
                  </div>
                </div>

                <div className="bg-red-50 rounded-[2.5rem] p-8 border border-red-100">
                  <h4 className="text-sm font-bold text-red-600 mb-2">Danger Zone</h4>
                  <p className="text-[11px] text-red-400 font-medium mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                  <button className="w-full py-4 rounded-2xl bg-white text-red-600 text-xs font-black uppercase tracking-widest shadow-sm hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>

              {/* Right Side: Detailed Settings */}
              <div className="col-span-8 space-y-8">
                {sections.map((section, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-white"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${section.color}`}>
                        <section.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-tech-slate">{section.title}</h3>
                    </div>

                    <div className="space-y-4">
                      {section.items.map((item, i) => (
                        <div 
                          key={i} 
                          onClick={() => {
                            if (item.type === 'toggle') toggleSetting(item.key)
                            if (item.type === 'theme-toggle') updateSetting('theme', item.current === 'dark' ? 'light' : 'dark')
                          }}
                          className={`flex items-center justify-between p-5 rounded-2xl bg-slate-50/50 border border-white hover:bg-white hover:shadow-sm transition-all group ${item.type.includes('toggle') ? 'cursor-pointer' : ''}`}
                        >
                          <div className="flex items-center gap-4">
                            {item.type === 'theme-toggle' && (
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.current === 'dark' ? 'bg-indigo-500 text-white' : 'bg-amber-100 text-amber-600'}`}>
                                {item.current === 'dark' ? <Moon className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                              </div>
                            )}
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                              <p className="text-sm font-bold text-tech-slate">{item.value}</p>
                            </div>
                          </div>
                          
                          {item.type === 'toggle' ? (
                            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${item.value ? 'bg-blue-600' : 'bg-slate-200'}`}>
                              <motion.div 
                                animate={{ x: item.value ? 24 : 0 }}
                                className="w-4 h-4 bg-white rounded-full shadow-sm" 
                              />
                            </div>
                          ) : item.type === 'theme-toggle' ? (
                            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${item.current === 'dark' ? 'bg-indigo-600' : 'bg-amber-500'}`}>
                              <motion.div 
                                animate={{ x: item.current === 'dark' ? 24 : 0 }}
                                className="w-4 h-4 bg-white rounded-full shadow-sm" 
                              />
                            </div>
                          ) : (
                            <button className="p-2 text-slate-300 group-hover:text-blue-500 transition-colors">
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default SettingsPage
