import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { isAdminEmail } from '@/lib/admin/config';

type JobStatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'POSTED';

/**
 * GET /api/admin/jobs - Fetch all jobs with filters (Admin only)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin using hardcoded email list
    if (!isAdminEmail(user.email)) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Get status filter from query params
    const { searchParams } = new URL(request.url);
    const statusFilter = (searchParams.get('status') || 'ALL') as JobStatusFilter;

    // Build where clause based on filter
    const whereClause =
      statusFilter === 'ALL'
        ? {}
        : { status: statusFilter };

    // Fetch jobs with creator info
    const jobs = await prisma.job.findMany({
      where: whereClause,
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            role: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get counts for each status
    const statusCounts = await prisma.job.groupBy({
      by: ['status'],
      _count: true,
    });

    const counts = {
      ALL: jobs.length,
      PENDING: statusCounts.find((s) => s.status === 'PENDING')?._count || 0,
      APPROVED: statusCounts.find((s) => s.status === 'APPROVED')?._count || 0,
      REJECTED: statusCounts.find((s) => s.status === 'REJECTED')?._count || 0,
      POSTED: statusCounts.find((s) => s.status === 'POSTED')?._count || 0,
    };

    return NextResponse.json({ 
      jobs,
      counts,
      currentFilter: statusFilter,
    });

  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

