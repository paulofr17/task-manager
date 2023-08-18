import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const a = await prisma.task.findMany()
  console.log(a)
  return NextResponse.json({ a })
}

export async function POST(request: Request) {
  try {
    const json = await request.json()

    const task = await prisma.task.create({
      data: json,
    })

    const jsonResponse = {
      status: 'success',
      task,
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
