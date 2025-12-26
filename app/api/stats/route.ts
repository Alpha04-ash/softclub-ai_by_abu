import { NextResponse } from 'next/server';
import { getResults, getUsers } from '@/lib/db';

export async function GET() {
  try {
    const results = getResults();
    const users = getUsers();

    const totalAssessments = results.length;
    const uniqueUsers = new Set(results.map(r => r.username)).size;
    const avgScore = results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
      : 0;

    // Subject breakdown
    const subjectStats = results.reduce((acc, result) => {
      if (!acc[result.subject]) {
        acc[result.subject] = { count: 0, totalScore: 0 };
      }
      acc[result.subject].count++;
      acc[result.subject].totalScore += result.percentage;
      return acc;
    }, {} as Record<string, { count: number; totalScore: number }>);

    const subjectBreakdown = Object.entries(subjectStats).map(([subject, stats]) => ({
      subject,
      count: stats.count,
      avgScore: Math.round(stats.totalScore / stats.count),
    }));

    return NextResponse.json({
      totalAssessments,
      uniqueUsers,
      avgScore,
      totalUsers: users.length,
      subjectBreakdown,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

