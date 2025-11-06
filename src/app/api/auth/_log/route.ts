import { NextResponse } from 'next/server';

// This is a placeholder for NextAuth's internal logging endpoint
export async function POST() {
  // Simply return success, we don't need to do anything here
  return NextResponse.json({ success: true });
}
