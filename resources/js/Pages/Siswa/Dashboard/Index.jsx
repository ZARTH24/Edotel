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
    LayoutDashboard,
    Users,
    Bed,
    Wrench,
    Clock,
    Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Head, Link } from "@inertiajs/react";

export default function SiswaDashboard({ receptionExercises, reservationExercises, stats, unlockStatus }) {
    const getStatusIcon = (status) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="size-4 text-green-500" />;
            case "opened":
                return <Play className="size-4 text-amber-500" />;
            default:
                return <Lock className="size-4 text-slate-400" />;
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "completed":
                return <Badge className="bg-green-100 text-green-700 border-green-200">Selesai</Badge>;
            case "opened":
                return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Sedang Dikerjakan</Badge>;
            default:
                return <Badge className="bg-slate-100 text-slate-600 border-slate-200">Belum Terbuka</Badge>;
        }
    };

    return (
        <>
            <Head title="Dashboard Siswa" />

            <Layout>
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h2 className="text-3xl font-serif text-slate-900 dark:text-slate-100">
                            Dashboard Siswa
                        </h2>
                        <p className="text-slate-600 mt-1">
                            Pantau progress pembelajaran E-Learning Anda
                        </p>
                    </div>

                    {/* Ringkasan Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm text-slate-600">
                                    Total Progress
                                </CardTitle>
                                <Target className="size-5 text-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-900">
                                    {stats.total_progress}%
                                </div>
                                <Progress value={stats.total_progress} className="h-2 mt-2" />
                                <p className="text-xs text-slate-500 mt-1">
                                    {stats.total_completed} dari {stats.total_exercises} latihan selesai
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm text-slate-600">
                                    Form Selesai
                                </CardTitle>
                                <CheckCircle className="size-5 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-green-600">
                                    {stats.total_completed}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Latihan telah diselesaikan
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm text-slate-600">
                                    Form Belum Selesai
                                </CardTitle>
                                <Clock className="size-5 text-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-amber-600">
                                    {stats.total_exercises - stats.total_completed}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Latihan belum selesai
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Progress Reception & Reservation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Reception Progress */}
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg">
                                            <ClipboardList className="size-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-slate-900">
                                                Progress Reception
                                            </CardTitle>
                                            <p className="text-sm text-slate-500">
                                                {stats.reception_completed}/{stats.reception_total} latihan
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-lg px-3 py-1">
                                        {stats.reception_progress}%
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Progress value={stats.reception_progress} className="h-3 mb-4" />
                                <Link href="/elearning/reception">
                                    <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                                        Lanjutkan Reception
                                        <ChevronRight className="size-4 ml-2" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Reservation Progress */}
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-lg">
                                            <CalendarCheck className="size-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-slate-900">
                                                Progress Reservation
                                            </CardTitle>
                                            <p className="text-sm text-slate-500">
                                                {stats.reservation_completed}/{stats.reservation_total} latihan
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-lg px-3 py-1">
                                        {stats.reservation_progress}%
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Progress value={stats.reservation_progress} className="h-3 mb-4" />
                                {stats.reception_progress < 100 ? (
                                    <Button className="w-full" disabled>
                                        <Lock className="size-4 mr-2" />
                                        Selesaikan Reception terlebih dahulu
                                    </Button>
                                ) : (
                                    <Link href="/elearning/reservation">
                                        <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                                            Lanjutkan Reservation
                                            <ChevronRight className="size-4 ml-2" />
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Status Unlock */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-slate-900">
                                    Status Unlock Menu
                                </CardTitle>
                                {stats.all_completed ? (
                                    <Badge className="bg-green-100 text-green-700 border-green-200">
                                        <CheckCircle className="size-3 mr-1" />
                                        Semua Menu Terbuka
                                    </Badge>
                                ) : (
                                    <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                                        <Lock className="size-3 mr-1" />
                                        Menu Terkunci
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className={`flex items-center gap-3 p-4 rounded-lg border ${unlockStatus.front_office === 'unlocked' ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                                    <Users className={`size-6 ${unlockStatus.front_office === 'unlocked' ? 'text-green-500' : 'text-slate-400'}`} />
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-700">Front Office</p>
                                        {unlockStatus.front_office === 'unlocked' ? (
                                            <p className="text-sm text-green-600">Tersedia</p>
                                        ) : (
                                            <p className="text-sm text-slate-500">Selesaikan semua latihan</p>
                                        )}
                                    </div>
                                    {unlockStatus.front_office === 'unlocked' ? (
                                        <CheckCircle className="size-5 text-green-500" />
                                    ) : (
                                        <Lock className="size-5 text-slate-400" />
                                    )}
                                </div>

                                <div className={`flex items-center gap-3 p-4 rounded-lg border ${unlockStatus.housekeeping === 'unlocked' ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                                    <Bed className={`size-6 ${unlockStatus.housekeeping === 'unlocked' ? 'text-green-500' : 'text-slate-400'}`} />
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-700">Housekeeping</p>
                                        {unlockStatus.housekeeping === 'unlocked' ? (
                                            <p className="text-sm text-green-600">Tersedia</p>
                                        ) : (
                                            <p className="text-sm text-slate-500">Selesaikan semua latihan</p>
                                        )}
                                    </div>
                                    {unlockStatus.housekeeping === 'unlocked' ? (
                                        <CheckCircle className="size-5 text-green-500" />
                                    ) : (
                                        <Lock className="size-5 text-slate-400" />
                                    )}
                                </div>

                                <div className={`flex items-center gap-3 p-4 rounded-lg border ${unlockStatus.damage_report === 'unlocked' ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                                    <Wrench className={`size-6 ${unlockStatus.damage_report === 'unlocked' ? 'text-green-500' : 'text-slate-400'}`} />
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-700">Damage Report</p>
                                        {unlockStatus.damage_report === 'unlocked' ? (
                                            <p className="text-sm text-green-600">Tersedia</p>
                                        ) : (
                                            <p className="text-sm text-slate-500">Selesaikan semua latihan</p>
                                        )}
                                    </div>
                                    {unlockStatus.damage_report === 'unlocked' ? (
                                        <CheckCircle className="size-5 text-green-500" />
                                    ) : (
                                        <Lock className="size-5 text-slate-400" />
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Daftar Progress Reception */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-slate-900">Daftar Progress Reception</CardTitle>
                                <Badge variant="outline">{stats.reception_completed}/{stats.reception_total} selesai</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {receptionExercises.map((exercise) => (
                                    <div
                                        key={exercise.id}
                                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                                            exercise.status === 'completed' ? 'bg-green-50 border-green-200' :
                                            exercise.status === 'opened' ? 'bg-amber-50 border-amber-200' :
                                            'bg-slate-50 border-slate-200'
                                        }`}
                                    >
                                        <span className="text-sm font-medium text-slate-600 w-6">
                                            {exercise.order_number}.
                                        </span>
                                        <span className="flex-1 text-sm text-slate-700">
                                            {exercise.title}
                                        </span>
                                        {getStatusIcon(exercise.status)}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Daftar Progress Reservation */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-slate-900">Daftar Progress Reservation</CardTitle>
                                <Badge variant="outline">{stats.reservation_completed}/{stats.reservation_total} selesai</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {reservationExercises.map((exercise) => (
                                    <div
                                        key={exercise.id}
                                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                                            exercise.status === 'completed' ? 'bg-green-50 border-green-200' :
                                            exercise.status === 'opened' ? 'bg-amber-50 border-amber-200' :
                                            'bg-slate-50 border-slate-200'
                                        }`}
                                    >
                                        <span className="text-sm font-medium text-slate-600 w-6">
                                            {exercise.order_number}.
                                        </span>
                                        <span className="flex-1 text-sm text-slate-700">
                                            {exercise.title}
                                        </span>
                                        {getStatusIcon(exercise.status)}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Layout>
        </>
    );
}
