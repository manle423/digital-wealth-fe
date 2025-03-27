import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const hasToken = cookieStore.has('accessToken');
  
  if (!hasToken) {
    return NextResponse.json({ isAuthenticated: false });
  }
  
  return NextResponse.json({ isAuthenticated: true });
}