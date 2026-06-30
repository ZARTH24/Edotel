import React from "react";
import Layout from "@/components/Layout/Layout";
import {
    ClipboardList,
    CalendarCheck,
    BookOpen,
    Trophy,
    CheckCircle,
    Lock,
    Play,
    ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Head, Link } from "@inertiajs/react";

export default function ELearningIndex({ receptionExercises, reservationExercises, stats }) {
    return (
        <>
            <Head title="E-Learning" />

            <Layout>
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h2 className="text-3xl font-serif text-slate-900 dark:text-slate-100">
                            E-Learning
                        </h2>
                        <p className="text-slate-600 mt-1">
                            Latihan pengisian formulir hotel
                        </p>
                    </div>

                    {/* Overall Progress */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-slate-900">
                                    Overall Progress
                                </CardTitle>
                                <Badge variant="outline" className="text-lg px-4 py-1">
                                    {stats.total_progress}%
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-600">
                                            {stats.total_completed} of {stats.total_exercises} exercises completed
                                        </span>
                                        <span className="text-slate-600">
                                            {stats.remaining} remaining
                                        </span>
                                    </div>
                                    <Progress value={stats.total_progress} className="h-3" />
                                </div>

                                {stats.all_completed ? (
                                    <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <CheckCircle className="size-6 text-green-500" />
                                        <div>
                                            <p className="font-medium text-green-700">
                                                Selamat! Anda telah menyelesaikan seluruh latihan.
                                            </p>
                                            <p className="text-sm text-green-600">
                                                Sekarang Anda dapat mengakses Front Office, Housekeeping, dan Damage Report.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                        <Lock className="size-6 text-amber-500" />
                                        <div>
                                            <p className="font-medium text-amber-700">
                                                Selesaikan seluruh latihan untuk membuka menu lainnya.
                                            </p>
                                            <p className="text-sm text-amber-600">
                                                Lanjutkan latihan Reception dan Reservation.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Reception Card */}
                        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg">
                                            <ClipboardList className="size-6 text-white" />
                                        </div>
                                        <CardTitle className="text-slate-900">
                                            Reception
                                        </CardTitle>
                                    </div>
                                    <Badge variant="outline">
                                        {stats.reception_completed}/{stats.reception_total}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-600">Progress</span>
                                        <span className="text-slate-600">
                                            {stats.reception_progress}%
                                        </span>
                                    </div>
                                    <Progress value={stats.reception_progress} className="h-2" />
                                </div>

                                <p className="text-sm text-slate-500">
                                    Formulir yang berkaitan dengan proses reception hotel.
                                </p>

                                <div className="space-y-2">
                                    {receptionExercises.slice(0, 3).map((exercise) => (
                                        <div
                                            key={exercise.id}
                                            className="flex items-center justify-between p-2 bg-slate-50 rounded-lg"
                                        >
                                            <span className="text-sm text-slate-700">
                                                {exercise.order_number}. {exercise.title}
                                            </span>
                                            {exercise.status === "completed" ? (
                                                <CheckCircle className="size-4 text-green-500" />
                                            ) : exercise.status === "opened" ? (
                                                <Play className="size-4 text-amber-500" />
                                            ) : (
                                                <Lock className="size-4 text-slate-400" />
                                            )}
                                        </div>
                                    ))}
                                    {receptionExercises.length > 3 && (
                                        <p className="text-xs text-slate-400 text-center">
                                            +{receptionExercises.length - 3} more
                                        </p>
                                    )}
                                </div>

                                <Link href="/elearning/reception">
                                    <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                                        Mulai Reception
                                        <ChevronRight className="size-4 ml-2" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Reservation Card */}
                        <Card className={`border-slate-200 shadow-sm hover:shadow-md transition-shadow ${!stats.all_completed && stats.reception_progress < 100 ? 'opacity-60' : ''}`}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-lg">
                                            <CalendarCheck className="size-6 text-white" />
                                        </div>
                                        <CardTitle className="text-slate-900">
                                            Reservation
                                        </CardTitle>
                                    </div>
                                    <Badge variant="outline">
                                        {stats.reservation_completed}/{stats.reservation_total}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-600">Progress</span>
                                        <span className="text-slate-600">
                                            {stats.reservation_progress}%
                                        </span>
                                    </div>
                                    <Progress value={stats.reservation_progress} className="h-2" />
                                </div>

                                <p className="text-sm text-slate-500">
                                    Formulir yang berkaitan dengan proses reservasi hotel.
                                </p>

                                <div className="space-y-2">
                                    {reservationExercises.slice(0, 3).map((exercise) => (
                                        <div
                                            key={exercise.id}
                                            className="flex items-center justify-between p-2 bg-slate-50 rounded-lg"
                                        >
                                            <span className="text-sm text-slate-700">
                                                {exercise.order_number}. {exercise.title}
                                            </span>
                                            {exercise.status === "completed" ? (
                                                <CheckCircle className="size-4 text-green-500" />
                                            ) : exercise.status === "opened" ? (
                                                <Play className="size-4 text-amber-500" />
                                            ) : (
                                                <Lock className="size-4 text-slate-400" />
                                            )}
                                        </div>
                                    ))}
                                    {reservationExercises.length > 3 && (
                                        <p className="text-xs text-slate-400 text-center">
                                            +{reservationExercises.length - 3} more
                                        </p>
                                    )}
                                </div>

                                {stats.reception_progress < 100 ? (
                                    <Button className="w-full" disabled>
                                        <Lock className="size-4 mr-2" />
                                        Selesaikan Reception terlebih dahulu
                                    </Button>
                                ) : (
                                    <Link href="/elearning/reservation">
                                        <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                                            Mulai Reservation
                                            <ChevronRight className="size-4 ml-2" />
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Layout>
        </>
    );
}
