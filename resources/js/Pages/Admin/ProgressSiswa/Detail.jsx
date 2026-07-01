import React from "react";
import Layout from "@/components/Layout/Layout";
import {
    ClipboardList,
    CalendarCheck,
    CheckCircle,
    Lock,
    Play,
    ArrowLeft,
    User,
    Clock,
    Trophy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Head, Link } from "@inertiajs/react";

export default function ProgressSiswaDetail({ student = {}, receptionExercises = [], reservationExercises = [], stats = {} }) {
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
            <Head title={`Progress ${student.name || 'Siswa'}`} />

            <Layout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <Link href="/elearning/progress-siswa">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="size-4" />
                            </Button>
                        </Link>
                        <div>
                            <h2 className="text-3xl font-serif text-slate-900 dark:text-slate-100">
                                Detail Progress Siswa
                            </h2>
                            <p className="text-slate-600 mt-1">
                                Progress pembelajaran {student.name || 'Unknown'}
                            </p>
                        </div>
                    </div>

                    {/* Student Info Card */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-slate-900 flex items-center gap-2">
                                <User className="size-5" />
                                Informasi Siswa
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm text-slate-500">Nama</p>
                                    <p className="font-medium text-slate-900">{student.name || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Email</p>
                                    <p className="font-medium text-slate-900">{student.email || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">NISN</p>
                                    <p className="font-medium text-slate-900">{student.nisn || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Kelas</p>
                                    <p className="font-medium text-slate-900">{student.kelas || '-'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Overall Progress */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-slate-900 flex items-center gap-2">
                                <Trophy className="size-5 text-amber-500" />
                                Ringkasan Progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Reception Progress */}
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-3 mb-4">
                                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg">
                                            <ClipboardList className="size-6 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium text-slate-900">Reception</p>
                                            <p className="text-sm text-slate-500">
                                                {stats.reception_completed || 0}/{stats.reception_total || 0} selesai
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-4xl font-bold text-blue-600 mb-2">
                                        {stats.reception_progress || 0}%
                                    </div>
                                    <Progress value={stats.reception_progress || 0} className="h-3" />
                                </div>

                                {/* Reservation Progress */}
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-3 mb-4">
                                        <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-lg">
                                            <CalendarCheck className="size-6 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium text-slate-900">Reservation</p>
                                            <p className="text-sm text-slate-500">
                                                {stats.reservation_completed || 0}/{stats.reservation_total || 0} selesai
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-4xl font-bold text-green-600 mb-2">
                                        {stats.reservation_progress || 0}%
                                    </div>
                                    <Progress value={stats.reservation_progress || 0} className="h-3" />
                                </div>

                                {/* Total Progress */}
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-3 mb-4">
                                        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 rounded-lg">
                                            <Trophy className="size-6 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium text-slate-900">Total Progress</p>
                                            <p className="text-sm text-slate-500">
                                                {stats.total_completed || 0}/{stats.total_exercises || 0} selesai
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-4xl font-bold text-amber-600 mb-2">
                                        {stats.total_progress || 0}%
                                    </div>
                                    <Progress value={stats.total_progress || 0} className="h-3" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reception Forms */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-slate-900 flex items-center gap-2">
                                    <ClipboardList className="size-5 text-blue-500" />
                                    Daftar Form Reception
                                </CardTitle>
                                <Badge variant="outline">
                                    {stats.reception_completed || 0}/{stats.reception_total || 0} selesai
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {receptionExercises.map((exercise) => (
                                    <div
                                        key={exercise.id}
                                        className={`flex items-center gap-3 p-4 rounded-lg border ${
                                            exercise.status === 'completed' ? 'bg-green-50 border-green-200' :
                                            exercise.status === 'opened' ? 'bg-amber-50 border-amber-200' :
                                            'bg-slate-50 border-slate-200'
                                        }`}
                                    >
                                        <span className="text-sm font-medium text-slate-600 w-6">
                                            {exercise.order_number || 0}.
                                        </span>
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-700">{exercise.title || 'Unknown'}</p>
                                            {exercise.completed_at && (
                                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Clock className="size-3" />
                                                    {new Date(exercise.completed_at).toLocaleDateString('id-ID', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            )}
                                        </div>
                                        {getStatusBadge(exercise.status)}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reservation Forms */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-slate-900 flex items-center gap-2">
                                    <CalendarCheck className="size-5 text-green-500" />
                                    Daftar Form Reservation
                                </CardTitle>
                                <Badge variant="outline">
                                    {stats.reservation_completed || 0}/{stats.reservation_total || 0} selesai
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {reservationExercises.map((exercise) => (
                                    <div
                                        key={exercise.id}
                                        className={`flex items-center gap-3 p-4 rounded-lg border ${
                                            exercise.status === 'completed' ? 'bg-green-50 border-green-200' :
                                            exercise.status === 'opened' ? 'bg-amber-50 border-amber-200' :
                                            'bg-slate-50 border-slate-200'
                                        }`}
                                    >
                                        <span className="text-sm font-medium text-slate-600 w-6">
                                            {exercise.order_number || 0}.
                                        </span>
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-700">{exercise.title || 'Unknown'}</p>
                                            {exercise.completed_at && (
                                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Clock className="size-3" />
                                                    {new Date(exercise.completed_at).toLocaleDateString('id-ID', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            )}
                                        </div>
                                        {getStatusBadge(exercise.status)}
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
