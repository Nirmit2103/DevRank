import Layout from "./components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function getUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      githubStats: true,
      codeforcesStats: true,
      leetcodeStats: true,
    },
  })
  return user
}

async function getUserRank(userId: string) {
  const userRank = await prisma.user.count({
    where: {
      score: {
        gt: (await prisma.user.findUnique({ where: { id: userId } }))?.score,
      },
    },
  })
  return userRank + 1
}

export default async function Home() {
  // TODO: Replace with actual user ID from authentication
  const userId = "user123"
  const userData = await getUserData(userId)
  const userRank = await getUserRank(userId)

  if (!userData) {
    return <div>User not found</div>
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Welcome, {userData.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>GitHub Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total Repositories: {userData.githubStats?.totalRepos}</p>
            <p>Total Stars: {userData.githubStats?.totalStars}</p>
            <p>Total Contributions: {userData.githubStats?.totalContributions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Coding Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="codeforces">
              <TabsList>
                <TabsTrigger value="codeforces">Codeforces</TabsTrigger>
                <TabsTrigger value="leetcode">LeetCode</TabsTrigger>
              </TabsList>
              <TabsContent value="codeforces">
                <p>Codeforces Rating: {userData.codeforcesStats?.rating}</p>
                <p>Problems Solved: {userData.codeforcesStats?.problemsSolved}</p>
              </TabsContent>
              <TabsContent value="leetcode">
                <p>LeetCode Rating: {userData.leetcodeStats?.rating}</p>
                <p>Problems Solved: {userData.leetcodeStats?.problemsSolved}</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>College Rank</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your current rank: {userRank}</p>
        </CardContent>
      </Card>
    </Layout>
  )
}

