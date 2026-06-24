import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await fetch('http://ai.lexrunit.com/chat/patient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'LEXRUNIT-API-KEY': process.env.LEXRUNIT_API_KEY!
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in chat API route:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
} 