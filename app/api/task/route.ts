import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { json } from 'stream/consumers'

export async function GET(request: NextRequest) {
  const tasks = await prisma.task.findMany()
  return NextResponse.json(tasks)
}

export async function POST(request: NextRequest) {
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

export async function PUT(request: NextRequest) {
  try {
    const { id, ...taskFields } = await request.json()
    const task = await prisma.task.update({
      where: { id },
      data: taskFields,
    })

    const jsonResponse = {
      status: 'success',
      task,
    }
    return new NextResponse(JSON.stringify(jsonResponse), {
      status: 200,
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
