import Layout from "../components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function getFriends(userId: string) {
  const friends = await prisma.friendship.findMany({
    where: {
      OR: [
        { userId: userId, status: "ACCEPTED" },
        { friendId: userId, status: "ACCEPTED" },
      ],
    },
    include: {
      user: true,
      friend: true,
    },
  })
  return friends
}

export default async function Friends() {
  // TODO: Replace with actual user ID from authentication
  const userId = "user123"
  const friends = await getFriends(userId)

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Friends</h1>
      <form className="mb-6">
        <div className="flex gap-4">
          <Input type="text" placeholder="Search friends by username or email" className="flex-grow" />
          <Button type="submit">Search</Button>
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {friends.map((friendship) => {
          const friend = friendship.userId === userId ? friendship.friend : friendship.user
          return (
            <Card key={friendship.id}>
              <CardHeader>
                <CardTitle>{friend.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{friend.email}</p>
                <Button variant="outline" className="mt-2">
                  Message
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </Layout>
  )
}

