import Layout from "../components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function getEvents() {
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
    where: { date: { gte: new Date() } },
  })
  return events
}

export default async function Events() {
  const events = await getEvents()

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>{new Date(event.date).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{event.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button className="mt-6">Add New Event</Button>
    </Layout>
  )
}

