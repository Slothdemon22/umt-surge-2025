'use client'

import { useState, useEffect, JSX } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { isAdminEmail } from '@/lib/admin/config'
import { 
  Users, 
  FileText, 
  Activity, 
  Settings, 
  Shield,
  BarChart3,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  AlertCircle
} from 'lucide-react'

interface AdminDashboardProps {
  userId: string
}

interface User {
  id: string;
  userId: string;
  fullName: string | null;
  email: string | null;
  avatarUrl: string | null;
  role: string;
  department: string | null;
  year: string | null;
  createdAt: string;
  stats: {
    totalJobs: number;
    totalApplications: number;
    totalMessages: number;
  };
}

interface Job {
  id: string;
  title: string;
  type: string;
  description: string;
  status: string;
  rejectionReason: string | null;
  createdAt: string;
  createdBy: {
    id: string;
    fullName: string | null;
    email: string | null;
    avatarUrl: string | null;
  };
  _count: {
    applications: number;
  };
}

interface JobCounts {
  ALL: number;
  PENDING: number;
  APPROVED: number;
  REJECTED: number;
  POSTED: number;
}

export function AdminDashboard({ userId }: AdminDashboardProps) {
  const [users, setUsers] = useState<User[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [jobCounts, setJobCounts] = useState<JobCounts>({
    ALL: 0,
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0,
    POSTED: 0,
  })
  const [loading, setLoading] = useState(true)
  const [jobStatusFilter, setJobStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'POSTED'>('PENDING')
  const [searchTerm, setSearchTerm] = useState('')
  const [rejectionReason, setRejectionReason] = useState<{ [key: string]: string }>({})
  const [processingJobId, setProcessingJobId] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
    fetchJobs()
  }, [jobStatusFilter])

  const fetchUsers = async (): Promise<void> => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchJobs = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/admin/jobs?status=${jobStatusFilter}`)
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs)
        setJobCounts(data.counts)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  }

  const handleJobAction = async (jobId: string, action: 'approve' | 'reject'): Promise<void> => {
    setProcessingJobId(jobId)
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          rejectionReason: action === 'reject' ? rejectionReason[jobId] : undefined,
        }),
      })

      if (response.ok) {
        await fetchJobs()
        setRejectionReason((prev) => ({ ...prev, [jobId]: '' }))
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to process job')
      }
    } catch (error) {
      console.error('Error processing job:', error)
      alert('Failed to process job')
    } finally {
      setProcessingJobId(null)
    }
  }

  const filteredUsers = users.filter((user) =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string): JSX.Element => {
    const variants: { [key: string]: { color: string; icon: JSX.Element } } = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-3 w-3" /> },
      APPROVED: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3 w-3" /> },
      REJECTED: { color: 'bg-red-100 text-red-800', icon: <XCircle className="h-3 w-3" /> },
      POSTED: { color: 'bg-blue-100 text-blue-800', icon: <CheckCircle className="h-3 w-3" /> },
    }
    const variant = variants[status] || variants.PENDING
    return (
      <Badge className={`${variant.color} flex items-center gap-1`}>
        {variant.icon}
        {status}
      </Badge>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              <Shield className="h-8 w-8 text-[#1E3A8A]" />
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage users, files, and system settings
            </p>
          </div>
          <Badge variant="default" className="bg-[#1E3A8A]">
            Administrator
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Jobs</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobCounts.PENDING}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Jobs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobCounts.APPROVED + jobCounts.POSTED}</div>
            <p className="text-xs text-muted-foreground">
              Approved and live
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobCounts.ALL}</div>
            <p className="text-xs text-muted-foreground">
              All jobs created
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="jobs">
            <FileText className="h-4 w-4 mr-2" />
            Job Approvals ({jobCounts.PENDING})
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users ({users.length})
          </TabsTrigger>
        </TabsList>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Job Approval Management</CardTitle>
                  <CardDescription>
                    Review and approve or reject job postings
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {(['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'POSTED'] as const).map((status) => (
                    <Button
                      key={status}
                      variant={jobStatusFilter === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setJobStatusFilter(status)}
                      className="text-xs"
                    >
                      {status} ({jobCounts[status]})
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-sm text-gray-500">Loading...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm">No {jobStatusFilter.toLowerCase()} jobs found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{job.title}</h3>
                            {getStatusBadge(job.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Type: {job.type.replace(/_/g, ' ')}</span>
                            <span>By: {job.createdBy.fullName || job.createdBy.email}</span>
                            <span>Applications: {job._count.applications}</span>
                            <span>Created: {new Date(job.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {job.status === 'PENDING' && (
                        <div className="flex items-center gap-2 pt-2 border-t">
                          <Button
                            size="sm"
                            onClick={() => handleJobAction(job.id, 'approve')}
                            disabled={processingJobId === job.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Input
                            placeholder="Rejection reason (optional)"
                            value={rejectionReason[job.id] || ''}
                            onChange={(e) =>
                              setRejectionReason((prev) => ({ ...prev, [job.id]: e.target.value }))
                            }
                            className="flex-1"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleJobAction(job.id, 'reject')}
                            disabled={processingJobId === job.id}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {job.status === 'REJECTED' && job.rejectionReason && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded">
                          <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                            <p className="text-sm text-red-700">{job.rejectionReason}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    View and manage all registered users
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm">No users found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-semibold">
                          {user.fullName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{user.fullName || 'No name'}</h3>
                            {isAdminEmail(user.email) && (
                              <Badge className="bg-[#1E3A8A]">Admin</Badge>
                            )}
                            <Badge variant="outline">{user.role}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            {user.department && <span>Dept: {user.department}</span>}
                            {user.year && <span>Year: {user.year}</span>}
                            <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-700">Activity</div>
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>Jobs: {user.stats.totalJobs}</div>
                          <div>Applications: {user.stats.totalApplications}</div>
                          <div>Messages: {user.stats.totalMessages}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

