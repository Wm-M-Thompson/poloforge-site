import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({ message: 'Poloforge API active' });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // TODO: Handle email signup logic here
    
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}