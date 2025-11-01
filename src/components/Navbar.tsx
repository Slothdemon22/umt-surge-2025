'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { LogoutButton } from './auth/LogoutButton'
import { RoleSwitcher } from './RoleSwitcher'

export function Navbar() {
  const { user, loading } = useAuth()

  return (
    <nav style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold" style={{ color: 'var(--primary)' }}>
              CampusConnect
            </Link>
            {user && (
              <div className="hidden md:flex gap-4 items-center">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium transition-colors"
                  style={{ color: 'var(--foreground-muted)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--foreground-muted)'}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="text-sm font-medium transition-colors"
                  style={{ color: 'var(--foreground-muted)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--foreground-muted)'}
                >
                  Profile
                </Link>
                <RoleSwitcher className="ml-4" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {loading ? (
              <div className="h-8 w-8 animate-pulse rounded-full" style={{ background: 'var(--border)' }}></div>
            ) : user ? (
              <>
                <span className="hidden sm:inline text-sm" style={{ color: 'var(--foreground-muted)' }}>
                  {user.email}
                </span>
                <LogoutButton />
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                  style={{ color: 'var(--foreground)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--border-light)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="btn-gradient rounded-lg px-4 py-2 text-sm font-medium text-white"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

