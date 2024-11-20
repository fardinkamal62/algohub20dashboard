'use client'

import React, { useState } from 'react'
import { Search, Users, HelpCircle, X, Check, BugIcon as QuestionMark } from 'lucide-react'
import Image from "next/image";

import teamData from '../../teams.json'
import currentWeekData from '../../week-1-data.json'

export default function AdminDashboard() {
    const [teams, setTeams] = useState(teamData)
    const [, setWeekData] = useState(currentWeekData)
    const [searchTerm, setSearchTerm] = useState('')
    const [attendancePopup, setAttendancePopup] = useState<{ isOpen: boolean; teamId: number | null }>({ isOpen: false, teamId: null })
    const [questionsModal, setQuestionsModal] = useState<{ isOpen: boolean; teamId: number | null }>({ isOpen: false, teamId: null })

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value
        setSearchTerm(term)
        const filteredTeams = teamData.filter(team =>
            team.team.toLowerCase().includes(term.toLowerCase())
        )
        setTeams(filteredTeams)
    }

    const handleAttendance = (teamId: number) => {
        setAttendancePopup({ isOpen: true, teamId })
    }

    const handleQuestions = (teamId: number) => {
        setQuestionsModal({ isOpen: true, teamId })
    }

    const handleQuestionResponse = (responseTeamId: number, response: 'couldn\'t answer' | 'answered' | 'answer unknown') => {
        setWeekData(prevWeekData => prevWeekData.map(week => {
            if (week.team === questionsModal.teamId) {
                return {
                    ...week,
                    questions: week.questions.map(question => {
                        if (question.team === responseTeamId) {
                            return {
                                ...question,
                                score: response === 'couldn\'t answer' ? -1 : response === 'answered' ? 1 : 0
                            }
                        }
                        return question
                    })
                }
            }
            return week
        }))
    }

    const handleAttendanceChange = (teamId: number, memberId: number, present: boolean) => {
        setTeams(prevTeams => prevTeams.map(team =>
            team.id === teamId
                ? { ...team, members: team.members.map((member, index) =>
                        index === memberId ? { ...member, present } : member
                    )}
                : team
        ))
    }

    const closeAttendancePopup = () => {
        setAttendancePopup({ isOpen: false, teamId: null })
    }

    const closeQuestionsModal = () => {
        setQuestionsModal({ isOpen: false, teamId: null })
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <header className="mb-8 text-center">
                    <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        <div className={'flex justify-center mb-5'}>
                            <Image src="/algohub-logo.jpeg" alt="Algohub Logo" width={100} height={100}
                                   className={'rounded-full aspect-square object-cover'}/>
                        </div>
                        Admin Dashboard
                    </h1>
                </header>

                <div className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden">
                    <div className="p-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search teams..."
                                className="w-full pl-10 pr-4 py-2 border border-muted rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        </div>
                    </div>

                    <table className="w-full">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="px-6 py-3 text-left text-xl font-medium text-muted-foreground uppercase tracking-wider">Team Name</th>
                            <th className="px-6 py-3 text-center text-xl font-medium text-muted-foreground uppercase tracking-wider">Members</th>
                            <th className="px-6 py-3 text-right text-xl font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-muted">
                        {teams.map((team) => (
                            <tr key={team.id} className={'hover:bg-gray-50 '}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-card-foreground">{team.team}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground text-center">{team.members.map(m => { return m.name}).join(', ')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground text-right">
                                    <button
                                        onClick={() => handleAttendance(team.id)}
                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-primary-foreground bg-primary hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mr-2"
                                    >
                                        <Users className="h-4 w-4 mr-1" />
                                        Attendance
                                    </button>
                                    <button
                                        onClick={() => handleQuestions(team.id)}
                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md bg-black text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                    >
                                        <HelpCircle className="h-4 w-4 mr-1" />
                                        Questions
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {attendancePopup.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white text-black rounded-lg shadow-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Attendance</h2>
                            <button onClick={closeAttendancePopup} className="text-muted-foreground hover:text-card-foreground">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        {teams.find(team => team.id === attendancePopup.teamId)?.members.map((member, index) => (
                            <div key={index} className="flex items-center justify-between py-2">
                                <span>{member.name}</span>
                                <div>
                                    <button
                                        onClick={() => handleAttendanceChange(attendancePopup.teamId!, index, true)}
                                        className={`px-2 py-1 rounded-l-md ${member.present ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        <Check className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleAttendanceChange(attendancePopup.teamId!, index, false)}
                                        className={`px-2 py-1 rounded-r-md ${!member.present ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {questionsModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white text-black rounded-lg shadow-lg p-6 w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Questions for {teams.find(team => team.id === questionsModal.teamId)?.team}</h2>
                            <button onClick={closeQuestionsModal} className="text-muted-foreground hover:text-card-foreground">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {teams.filter(team => team.id !== questionsModal.teamId).map(team => (
                                <div key={team.id} className="flex items-center justify-between py-2">
                                    <span className="font-medium">{team.team}</span>
                                    <div>
                                        <button
                                            onClick={() => handleQuestionResponse(team.id, 'answered')}
                                            className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium ${currentWeekData?.filter((t) => t.team === questionsModal.teamId )[0].questions.filter(q => q.team == team.id)[0].score == 1 ? 'text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500' : null} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                                        >
                                            <Check className="h-4 w-4 mr-1"/>
                                            Answered
                                        </button>
                                        <button
                                            onClick={() => handleQuestionResponse(team.id, 'couldn\'t answer')}
                                            className={`inline-flex items-center px-3 py-1 text-xs font-medium ${currentWeekData?.filter((t) => t.team === questionsModal.teamId )[0].questions.filter(q => q.team == team.id)[0].score == -1 ? 'text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500' : null} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                                        >
                                            <X className="h-4 w-4 mr-1"/>
                                            Couldn&#39;t Answer
                                        </button>
                                        <button
                                            onClick={() => handleQuestionResponse(team.id, 'answer unknown')}
                                            className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium ${currentWeekData?.filter((t) => t.team === questionsModal.teamId )[0].questions.filter(q => q.team == team.id)[0].score == 0 ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:ring-yellow-500' : null} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                                        >
                                            <QuestionMark className="h-4 w-4 mr-1"/>
                                            Answer Unknown
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
