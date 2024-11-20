import React from 'react'
import {ArrowDown, ArrowUp, Minus} from 'lucide-react'

import Image from "next/image";

import leaderboardData from './teams.json'

const ScoreChange = ({current, previous}: { current: number; previous: number }) => {
    const difference = current - previous
    let color = 'text-gray-500'
    let Icon = Minus

    if (difference > 0) {
        color = 'text-green-500'
        Icon = ArrowUp
    } else if (difference < 0) {
        color = 'text-red-500'
        Icon = ArrowDown
    }

    return (
        <div className={`flex items-center justify-end ${color}`}>
            <Icon className="w-4 h-4 mr-1"/>
            <span>{Math.abs(difference)}</span>
        </div>
    )
}

export default function LeaderboardDashboard() {
    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <header className="mb-8 text-center">
                    <div className="flex justify-center">
                        <Image src="/algohub-logo.jpeg" alt="Algohub Logo" width={100} height={100}
                               className={'rounded-full aspect-square object-cover'}/>
                    </div>
                    <h1 className="text-4xl font-bold text-primary mt-5">
                        Leaderboard
                    </h1>
                </header>
                <div className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden">
                    <table className="w-full">
                        <thead>
                        <tr className="bg-muted">
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Rank</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Team</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Current
                                Score
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Change</th>
                        </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-muted">
                        {leaderboardData.map((team, index) => (
                            <tr key={team.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-card-foreground">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">{team.team}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground text-right">{team.currentScore}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground text-right">
                                    <ScoreChange current={team.currentScore} previous={team.previousScore}/>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

        {/*  Footer  */}

            <footer className="mt-8 text-center text-muted-foreground">
                <p>Made with ❤️ by <a href="https://github.com/fardinkamal62" className="underline" target={'_blank'}>Fardin Kamal</a></p>
            </footer>
        </div>
    )
}
