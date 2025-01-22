import { NextResponse } from 'next/server'
 
export async function GET() {
  return NextResponse.json({ message: 'Hello World' })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    return NextResponse.json({ data: body })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 400 }
    )
  }
}