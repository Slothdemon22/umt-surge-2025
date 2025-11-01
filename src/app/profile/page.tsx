import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Profile
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your account information
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-2xl font-bold">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user.email}</h2>
                <p className="text-sm text-gray-600">
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">User ID</label>
                <p className="mt-1 text-xs font-mono text-gray-600 break-all">
                  {user.id}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Last Sign In
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {user.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleString()
                    : 'N/A'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Account Status
                </label>
                <span className="mt-1 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 text-left">
                Change Password
              </button>
              <button className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 text-left">
                Update Email
              </button>
              <button className="w-full rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 text-left">
                Delete Account
              </button>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Note: These actions are placeholders. Implement them based on your needs.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}


