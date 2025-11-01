'use client'

import { useActiveRole } from '@/hooks/useActiveRole'
import { Search, Briefcase, Plus, Users, BookmarkIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface DashboardClientProps {
  profile: {
    id: string
    fullName: string | null
    avatarUrl: string | null
    department: string | null
    role: string
    skills: string[]
    interests: string[]
  }
  serverActiveRole?: 'SEEKER' | 'FINDER'
}

export function DashboardClient({ profile, serverActiveRole }: DashboardClientProps) {
  const { activeRole, isLoading } = useActiveRole(serverActiveRole || profile.role as 'SEEKER' | 'FINDER')
  const router = useRouter()

  // Remove the infinite loop - don't sync here
  // The RoleSwitcher will handle page reload

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="glass-card p-8 h-32"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 h-24"></div>
          <div className="glass-card p-6 h-24"></div>
          <div className="glass-card p-6 h-24"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="glass-card p-8">
        <div className="flex items-start gap-6">
          {profile.avatarUrl && (
            <img 
              src={profile.avatarUrl} 
              alt={profile.fullName || 'Profile'} 
              className="h-20 w-20 rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
              Welcome back, {profile.fullName}
            </h2>
            <p className="text-lg flex items-center gap-2" style={{ color: 'var(--foreground-muted)' }}>
              {activeRole === 'SEEKER' ? (
                <>
                  <Search className="h-5 w-5" />
                  <span>Finding Work Mode</span>
                </>
              ) : (
                <>
                  <Briefcase className="h-5 w-5" />
                  <span>Posting Jobs Mode</span>
                </>
              )}
              <span className="mx-2">•</span>
              <span>{profile.department || 'No department set'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Seeker Mode Dashboard */}
      {activeRole === 'SEEKER' && (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 hover:scale-105 transition-transform">
              <div>
                <p className="text-sm mb-2" style={{ color: 'var(--foreground-muted)' }}>
                  Applications Sent
                </p>
                <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>0</p>
              </div>
            </div>
            <div className="glass-card p-6 hover:scale-105 transition-transform">
              <div>
                <p className="text-sm mb-2" style={{ color: 'var(--foreground-muted)' }}>
                  Saved Jobs
                </p>
                <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>0</p>
              </div>
            </div>
            <div className="glass-card p-6 hover:scale-105 transition-transform">
              <div>
                <p className="text-sm mb-2" style={{ color: 'var(--foreground-muted)' }}>
                  Profile Views
                </p>
                <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>0</p>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg" style={{ background: 'rgba(37, 99, 235, 0.1)' }}>
                  <Search className="h-6 w-6" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--foreground)' }}>
                    Browse Opportunities
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--foreground-muted)' }}>
                    Find projects, internships, and collaborations that match your skills
                  </p>
                  <Link href="/jobs" className="btn-gradient inline-block px-6 py-2 text-sm">
                    Explore Jobs
                  </Link>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg" style={{ background: 'rgba(37, 99, 235, 0.1)' }}>
                  <BookmarkIcon className="h-6 w-6" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--foreground)' }}>
                    Saved Jobs
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--foreground-muted)' }}>
                    Review and apply to jobs you've bookmarked
                  </p>
                  <Link href="/bookmarks" className="btn-gradient inline-block px-6 py-2 text-sm">
                    View Saved
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Finder Mode Dashboard */}
      {activeRole === 'FINDER' && (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 hover:scale-105 transition-transform">
              <div>
                <p className="text-sm mb-2" style={{ color: 'var(--foreground-muted)' }}>
                  Active Jobs
                </p>
                <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>0</p>
              </div>
            </div>
            <div className="glass-card p-6 hover:scale-105 transition-transform">
              <div>
                <p className="text-sm mb-2" style={{ color: 'var(--foreground-muted)' }}>
                  Applications Received
                </p>
                <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>0</p>
              </div>
            </div>
            <div className="glass-card p-6 hover:scale-105 transition-transform">
              <div>
                <p className="text-sm mb-2" style={{ color: 'var(--foreground-muted)' }}>
                  Total Views
                </p>
                <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>0</p>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg" style={{ background: 'rgba(37, 99, 235, 0.1)' }}>
                  <Plus className="h-6 w-6" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--foreground)' }}>
                    Post a New Job
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--foreground-muted)' }}>
                    Create a new opportunity and find talented collaborators
                  </p>
                  <Link href="/jobs/create" className="btn-gradient inline-block px-6 py-2 text-sm">
                    Create Job
                  </Link>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg" style={{ background: 'rgba(37, 99, 235, 0.1)' }}>
                  <Users className="h-6 w-6" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--foreground)' }}>
                    Manage Applications
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--foreground-muted)' }}>
                    Review and respond to applications from candidates
                  </p>
                  <Link href="/applications" className="btn-gradient inline-block px-6 py-2 text-sm">
                    View Applications
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* My Jobs */}
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                Your Posted Jobs
              </h3>
              <Link href="/jobs/create" className="btn-gradient px-4 py-2 text-sm">
                Post New Job
              </Link>
            </div>
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--foreground-muted)', opacity: 0.5 }} />
              <p className="text-lg mb-2" style={{ color: 'var(--foreground)' }}>
                No jobs posted yet
              </p>
              <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                Create your first job posting to find talented collaborators
              </p>
            </div>
          </div>
        </>
      )}

      {/* Profile Summary - Shown in both modes */}
      <div className="glass-card p-8">
        <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
          Your Profile
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
              Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.skills.length > 0 ? (
                profile.skills.map((skill) => (
                  <span 
                    key={skill} 
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent)' }}
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                  No skills added yet
                </p>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
              Interests
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.interests.length > 0 ? (
                profile.interests.map((interest) => (
                  <span 
                    key={interest} 
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent)' }}
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                  No interests added yet
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
          <Link href="/profile" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
            Edit Profile →
          </Link>
        </div>
      </div>
    </div>
  )
}

