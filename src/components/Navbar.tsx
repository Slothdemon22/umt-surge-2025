'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { LogoutButton } from './auth/LogoutButton'
import { RoleSwitcher } from './RoleSwitcher'
import NotificationCenter from './NotificationCenter'
import Cookies from 'js-cookie'
import { 
  Sparkles, Menu, X, LayoutDashboard, Briefcase, FileText, 
  Bookmark, Video, User, Search, PlusCircle, LogOut, Shield
} from 'lucide-react'

export function Navbar() {
  const { user, loading } = useAuth()
  const [activeRole, setActiveRole] = useState<'SEEKER' | 'FINDER' | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Get active role from cookie
    const role = Cookies.get('campusconnect_active_role') as 'SEEKER' | 'FINDER' | undefined
    setActiveRole(role || null)

    // Set active link based on current path
    if (typeof window !== 'undefined') {
      setActiveLink(window.location.pathname)
    }

    // Check if user is admin
    if (user) {
      checkAdminStatus()
    }

    // Listen for role changes
    const handleRoleChange = (): void => {
      const newRole = Cookies.get('campusconnect_active_role') as 'SEEKER' | 'FINDER' | undefined
      setActiveRole(newRole || null)
    }

    window.addEventListener('roleChanged', handleRoleChange)
    return () => window.removeEventListener('roleChanged', handleRoleChange)
  }, [user])

  const checkAdminStatus = async (): Promise<void> => {
    try {
      const response = await fetch('/api/admin/check')
      if (response.ok) {
        const data = await response.json()
        setIsAdmin(data.isAdmin)
      }
    } catch (error) {
      // User is not admin
      setIsAdmin(false)
    }
  }

  const NavLink = ({ href, children, icon: Icon, onClick }: { 
    href: string; 
    children: React.ReactNode; 
    icon?: React.ComponentType<{ className?: string }>; 
    onClick?: () => void;
  }): React.ReactElement => {
    const isActive = activeLink === href
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          isActive 
            ? 'bg-[#1E3A8A] text-white' 
            : 'hover:bg-gray-100'
        }`}
        style={{ color: isActive ? 'white' : 'var(--foreground)' }}
      >
        {Icon && <Icon className="w-4 h-4" />}
        {children}
      </Link>
    )
  }

  return (
    <nav className="sticky top-0 z-50 glass-card shadow-md" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#1E3A8A] to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-[#1E3A8A] to-blue-600 bg-clip-text text-transparent">
                CampusConnect
              </span>
            </Link>

            {/* Desktop Navigation */}
            {user && (
              <div className="hidden lg:flex gap-1 items-center">
                <NavLink href="/dashboard" icon={LayoutDashboard}>
                  Dashboard
                </NavLink>
                <NavLink href="/jobs" icon={Search}>
                  Browse
                </NavLink>
                
                {activeRole === 'FINDER' && (
                  <>
                    <NavLink href="/my-jobs" icon={Briefcase}>
                      My Jobs
                    </NavLink>
                    <NavLink href="/drafts" icon={FileText}>
                      Drafts
                    </NavLink>
                  </>
                )}
                
                {activeRole === 'SEEKER' && (
                  <>
                    <NavLink href="/my-applications" icon={FileText}>
                      Applications
                    </NavLink>
                    <NavLink href="/resume-tips">
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        <span>Resume Tips</span>
                      </div>
                    </NavLink>
                  </>
                )}
                
                <NavLink href="/saved-jobs" icon={Bookmark}>
                  Saved
                </NavLink>
                
                <NavLink href="/video-calls" icon={Video}>
                  Calls
                </NavLink>
                
                <NavLink href="/profile" icon={User}>
                  Profile
                </NavLink>

                {isAdmin && (
                  <NavLink href="/admin" icon={Shield}>
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      <span className="font-bold">Admin</span>
                    </div>
                  </NavLink>
                )}
              </div>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="flex gap-2">
                <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200"></div>
                <div className="h-8 w-20 animate-pulse rounded-lg bg-gray-200"></div>
              </div>
            ) : user ? (
              <>
                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-3">
                  <RoleSwitcher />
                  <NotificationCenter />
                  <div className="hidden xl:flex flex-col items-end">
                    <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>
                      {user.email?.split('@')[0]}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                      {activeRole === 'SEEKER' ? '🔍 Finding Work' : '📝 Posting Jobs'}
                    </span>
                  </div>
                  <LogoutButton />
                </div>

                {/* Mobile menu button */}
                <button
                  className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-all active:scale-95"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6" style={{ color: 'var(--foreground)' }} />
                  ) : (
                    <Menu className="w-6 h-6" style={{ color: 'var(--foreground)' }} />
                  )}
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="glass-card rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                  style={{ color: 'var(--foreground)' }}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="btn-gradient rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {user && mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-1 border-t animate-in slide-in-from-top duration-200" style={{ borderColor: 'var(--border)' }}>
            {/* User Info Section */}
            <div className="px-4 py-3 mb-2 rounded-xl" style={{ background: 'rgba(30, 58, 138, 0.05)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#1E3A8A] to-blue-600 flex items-center justify-center text-white font-bold">
                  {user.email?.[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                    {user.email?.split('@')[0]}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium">
                <span className={`px-2 py-1 rounded-full ${
                  activeRole === 'SEEKER' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {activeRole === 'SEEKER' ? '🔍 Finding Work' : '📝 Posting Jobs'}
                </span>
              </div>
            </div>

            {/* Role Switcher */}
            <div className="px-4 py-2">
              <RoleSwitcher />
            </div>

            <div className="h-px" style={{ background: 'var(--border)' }}></div>

            {/* Navigation Links */}
            <div className="space-y-1 px-2">
              <NavLink 
                href="/dashboard" 
                icon={LayoutDashboard}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </NavLink>
              
              <NavLink 
                href="/jobs" 
                icon={Search}
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Jobs
              </NavLink>
              
              {activeRole === 'FINDER' && (
                <>
                  <NavLink 
                    href="/my-jobs" 
                    icon={Briefcase}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Jobs
                  </NavLink>
                  <NavLink 
                    href="/drafts" 
                    icon={FileText}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Drafts
                  </NavLink>
                  <Link
                    href="/jobs/create"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all bg-[#1E3A8A] text-white hover:bg-blue-700"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Post New Job
                  </Link>
                </>
              )}
              
              {activeRole === 'SEEKER' && (
                <NavLink 
                  href="/my-applications" 
                  icon={FileText}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Applications
                </NavLink>
              )}
              
              <NavLink 
                href="/saved-jobs" 
                icon={Bookmark}
                onClick={() => setMobileMenuOpen(false)}
              >
                Saved Jobs
              </NavLink>
              
              <NavLink 
                href="/video-calls" 
                icon={Video}
                onClick={() => setMobileMenuOpen(false)}
              >
                Video Calls
              </NavLink>
              
              <NavLink 
                href="/profile" 
                icon={User}
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </NavLink>

              {isAdmin && (
                <NavLink 
                  href="/admin" 
                  icon={Shield}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span className="font-bold">Admin Panel</span>
                  </div>
                </NavLink>
              )}
            </div>

            <div className="h-px" style={{ background: 'var(--border)' }}></div>

            {/* Notifications and Logout */}
            <div className="px-2 space-y-2">
              <div className="px-2">
                <NotificationCenter />
              </div>
              <div className="px-1">
                <LogoutButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

