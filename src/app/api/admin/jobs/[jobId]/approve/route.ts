import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { isAdminEmail } from '@/lib/admin/config';

interface ApproveJobBody {
  action: 'approve' | 'reject';
  rejectionReason?: string;
}

/**
 * POST /api/admin/jobs/[jobId]/approve - Approve or reject a job (Admin only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { jobId: string } }
): Promise<NextResponse> {
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

    // Get admin profile for audit trail
    const adminProfile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { id: true, fullName: true },
    });

    const body: ApproveJobBody = await request.json();
    const { action, rejectionReason } = body;

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    // Get the job
    const job = await prisma.job.findUnique({
      where: { id: params.jobId },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Update job based on action
    const updatedJob = await prisma.job.update({
      where: { id: params.jobId },
      data:
        action === 'approve'
          ? {
              status: 'APPROVED',
              approvedAt: new Date(),
              approvedBy: adminProfile?.id || user.id,
              rejectionReason: null,
            }
          : {
              status: 'REJECTED',
              rejectionReason: rejectionReason || 'No reason provided',
              approvedBy: null,
              approvedAt: null,
            },
    });

    // Create notification for job creator
    await prisma.notification.create({
      data: {
        userId: job.createdBy.id,
        type: action === 'approve' ? 'JOB_APPROVED' : 'JOB_REJECTED',
        content:
          action === 'approve'
            ? `Your job "${job.title}" has been approved and is now visible to seekers!`
            : `Your job "${job.title}" was not approved. ${rejectionReason || 'Please review and resubmit.'}`,
      },
    });

    return NextResponse.json({
      success: true,
      job: updatedJob,
      message:
        action === 'approve'
          ? 'Job approved successfully'
          : 'Job rejected successfully',
    });

  } catch (error) {
    console.error('Error updating job status:', error);
    return NextResponse.json(
      { error: 'Failed to update job status' },
      { status: 500 }
    );
  }
}

