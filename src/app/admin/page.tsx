import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { AdminDashboard } from './AdminDashboard'
import { isAdminEmail } from '@/lib/admin/config'

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is admin using hardcoded email list
  if (!isAdminEmail(user.email)) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <AdminDashboard userId={user.id} />
    </div>
  )
}



