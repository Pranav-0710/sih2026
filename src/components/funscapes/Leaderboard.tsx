"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Crown } from "lucide-react"

const leaderboardData = [
  { rank: 1, name: "Arjun Kumar", points: 1250, games: 6, achievements: 12, avatar: "🏆" },
  { rank: 2, name: "Priya Singh", points: 1180, games: 5, achievements: 10, avatar: "🥈" },
  { rank: 3, name: "Rahul Sharma", points: 1050, games: 4, achievements: 8, avatar: "🥉" },
  { rank: 4, name: "Anita Devi", points: 920, games: 4, achievements: 7, avatar: "🌟" },
  { rank: 5, name: "Vikash Mahto", points: 850, games: 3, achievements: 6, avatar: "⭐" },
  { rank: 6, name: "Sunita Kumari", points: 780, games: 3, achievements: 5, avatar: "🎯" },
  { rank: 7, name: "Deepak Oraon", points: 720, games: 2, achievements: 4, avatar: "🎮" },
  { rank: 8, name: "Kavita Munda", points: 650, games: 2, achievements: 3, avatar: "🏅" },
]

export function Leaderboard() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <Award className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      return `bg-gradient-to-r ${
        rank === 1
          ? "from-yellow-400 to-yellow-600"
          : rank === 2
            ? "from-gray-300 to-gray-500"
            : "from-amber-400 to-amber-600"
      } text-white`
    }
    return "bg-muted text-muted-foreground"
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8 text-primary" />
          Leaderboard
        </CardTitle>
        <CardDescription>Top explorers of Jharkhand's virtual heritage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboardData.map((player) => (
            <div
              key={player.rank}
              className={`flex items-center gap-4 p-4 rounded-lg transition-all hover:shadow-md ${
                player.rank <= 3
                  ? "bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20"
                  : "bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Badge className={`${getRankBadge(player.rank)} min-w-[2rem] h-8 flex items-center justify-center`}>
                  #{player.rank}
                </Badge>
                {getRankIcon(player.rank)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{player.avatar}</span>
                  <h3 className="font-semibold text-lg truncate">{player.name}</h3>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-primary text-lg">{player.points}</div>
                  <div className="text-muted-foreground">Points</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-secondary">{player.games}</div>
                  <div className="text-muted-foreground">Games</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-accent">{player.achievements}</div>
                  <div className="text-muted-foreground">Badges</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            Complete games to earn points and climb the leaderboard!
            <br />
            Discover the rich heritage of Jharkhand while competing with fellow explorers.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}