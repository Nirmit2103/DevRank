import Layout from "../components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function getSharedRepos() {
  const repos = await prisma.sharedRepo.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  })
  return repos
}

export default async function Repos() {
  const repos = await getSharedRepos()

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Shared GitHub Repositories</h1>
      <form className="mb-6">
        <div className="flex gap-4">
          <Input type="text" placeholder="GitHub Repository URL" className="flex-grow" />
          <Button type="submit">Share Repository</Button>
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.map((repo) => (
          <Card key={repo.id}>
            <CardHeader>
              <CardTitle>{repo.name}</CardTitle>
              <CardDescription>Shared by {repo.user.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                View Repository
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  )
}

