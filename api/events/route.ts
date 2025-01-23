import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
      where: { date: { gte: new Date() } },
    })
    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, date } = await request.json()
    const newEvent = await prisma.event.create({
      data: { title, description, date: new Date(date) },
    })
    return NextResponse.json(newEvent, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

