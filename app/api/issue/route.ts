import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const issues = await prisma.issue.findMany({
    include: {
      tasks: true,
    },
  })
  return NextResponse.json(issues)
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const issue = await prisma.issue.create({
      data: json,
    })
    const jsonResponse = {
      status: 'success',
      issue,
    }
    return new NextResponse(JSON.stringify(jsonResponse), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    const errorResponse = {
      status: 'error',
      message: error.message,
    }
    return new NextResponse(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
