import { PrismaClient } from '../../../generated/prisma';
import { NextRequest, NextResponse } from 'next/server';
import runpodSdk from 'runpod-sdk';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  const data = await req.json();
  const { requestId, matchId } = data;

  try {
    if (!requestId && !matchId) {
      return NextResponse.json({ message: 'Either requestId or matchId is required' }, { status: 400 });
    }

    // If matchId is provided, fetch the requestId from the database
    let runpodRequestId = requestId;
    if (!runpodRequestId && matchId) {
      const analysisStatus = await prisma.analysisStatus.findUnique({
        where: { matchId },
      });
      
      if (!analysisStatus) {
        return NextResponse.json({ message: 'AnalysisStatus not found for this match' }, { status: 404 });
      }
      
      runpodRequestId = analysisStatus.requestId;
    }

    // Call runpod to get the current status
    const runpod = runpodSdk(process.env.AI_SERVER_API_KEY);
    const endpoint = runpod.endpoint(process.env.ENDPOINT_ID);
    const statusResponse = await endpoint.status(runpodRequestId);

    // Find the AnalysisStatus record by requestId
    const existingStatus = await prisma.analysisStatus.findFirst({
      where: { requestId: runpodRequestId },
    });

    if (!existingStatus) {
      return NextResponse.json({ message: 'AnalysisStatus not found' }, { status: 404 });
    }

    // Check if the status was updated recently (within 4 minutes) to avoid duplicate updates
    const fourMinutesAgo = new Date(Date.now() - 4 * 60 * 1000);
    if (existingStatus.updatedAt > fourMinutesAgo) {
      return NextResponse.json({ 
        success: true, 
        message: 'Status was recently updated, skipping',
        data: existingStatus,
      });
    }

    // Update the AnalysisStatus record
    const updatedStatus = await prisma.analysisStatus.update({
      where: { matchId: existingStatus.matchId },
      data: {
        status: statusResponse.status as 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED',
        delayTime: (statusResponse as any).delayTime ?? null,
        executionTime: (statusResponse as any).executionTime ?? null,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Status updated successfully',
      data: updatedStatus,
      runpodStatus: statusResponse,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error updating status', error: String(error) }, { status: 500 });
  }
}

