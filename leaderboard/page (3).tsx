import Layout from "../components/layout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function getLeaderboard() {
  const leaderboard = await prisma.user.findMany({
    orderBy: { score: "desc" },
    take: 10,
    select: {
      id: true,
      name: true,
      college: true,
      score: true,
    },
  })
  return leaderboard.map((entry, index) => ({ ...entry, rank: index + 1 }))
}

export default async function Leaderboard() {
  const leaderboardData = await getLeaderboard()

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">College Rank Leaderboard</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>College</TableHead>
            <TableHead>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboardData.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.rank}</TableCell>
              <TableCell>{entry.name}</TableCell>
              <TableCell>{entry.college}</TableCell>
              <TableCell>{entry.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Layout>
  )
}

