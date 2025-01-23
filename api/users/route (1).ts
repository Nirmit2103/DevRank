import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        githubStats: true,
        codeforcesStats: true,
        leetcodeStats: true,
      },
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, college } = await request.json()
    const newUser = await prisma.user.create({
      data: { name, email, college },
    })
    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

