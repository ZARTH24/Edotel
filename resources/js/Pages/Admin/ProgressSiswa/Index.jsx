import React from "react";
import Layout from "@/components/Layout/Layout";
import {
    Users,
    Search,
    Filter,
    CheckCircle,
    Clock,
    ChevronRight,
    BarChart3,
    X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Head, Link } from "@inertiajs/react";

export default function ProgressSiswaIndex({ students = [], filters = {}, kelasList = [], stats = {} }) {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Selesai':
                return <Badge className="bg-green-100 text-green-700 border-green-200">Selesai</Badge>;
            case 'Sedang Belajar':
                return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Sedang Belajar</Badge>;
            case 'Belum Mulai':
                return <Badge className="bg-slate-100 text-slate-600 border-slate-200">Belum Mulai</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <>
            <Head title="Progress Siswa" />

            <Layout>
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h2 className="text-3xl font-serif text-slate-900 dark:text-slate-100">
                            Progress Siswa
                        </h2>
                        <p className="text-slate-600 mt-1">
                            Monitor progress pembelajaran seluruh siswa
                        </p>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm text-slate-600">
                                    Total Siswa
                                </CardTitle>
                                <Users className="size-5 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-900">
                                    {stats.total_siswa ?? 0}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm text-slate-600">
                                    Siswa Selesai
                                </CardTitle>
                                <CheckCircle className="size-5 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-green-600">
                                    {stats.selesai ?? 0}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm text-slate-600">
                                    Belum Selesai
                                </CardTitle>
                                <Clock className="size-5 text-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-amber-600">
                                    {stats.belum_selesai ?? 0}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm text-slate-600">
                                    Rata-rata Progress
                                </CardTitle>
                                <BarChart3 className="size-5 text-purple-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-purple-600">
                                    {stats.avg_progress ?? 0}%
                                </div>
                                <Progress value={stats.avg_progress ?? 0} className="h-1 mt-2" />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-slate-900">Filter & Pencarian</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form method="GET" className="flex flex-wrap gap-4">
                                <div className="flex-1 min-w-[200px]">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
                                        <Input
                                            type="text"
                                            name="search"
                                            placeholder="Cari nama atau email..."
                                            defaultValue={filters.search}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="w-[150px]">
                                    <Select name="kelas" defaultValue={filters.kelas || "all"}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Semua Kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Kelas</SelectItem>
                                            {kelasList.map((kelas) => (
                                                <SelectItem key={kelas} value={kelas}>
                                                    {kelas}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="submit" className="bg-gradient-to-r from-amber-500 to-amber-600">
                                    <Filter className="size-4 mr-2" />
                                    Filter
                                </Button>
                                {filters.search && (
                                    <Link href="/elearning/progress-siswa">
                                        <Button type="button" variant="outline">
                                            <X className="size-4 mr-2" />
                                            Reset
                                        </Button>
                                    </Link>
                                )}
                            </form>
                        </CardContent>
                    </Card>

                    {/* Students List - Card Based Layout */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-slate-900">Daftar Siswa ({students.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {students.length === 0 ? (
                                <p className="text-center py-8 text-slate-500">
                                    Tidak ada siswa ditemukan
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {students.map((student, index) => (
                                        <div
                                            key={student.id}
                                            className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                                {/* Student Info */}
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                                        <span className="text-amber-700 font-semibold">
                                                            {(student.name || 'A').charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h4 className="font-semibold text-slate-900">
                                                                {student.name || 'Unknown'}
                                                            </h4>
                                                            {getStatusBadge(student.status)}
                                                        </div>
                                                        <p className="text-sm text-slate-500 mt-1">
                                                            {student.email || '-'}
                                                        </p>
                                                        <div className="flex gap-4 mt-2 text-sm text-slate-600">
                                                            <span>NISN: {student.nisn || '-'}</span>
                                                            <span>Kelas: {student.kelas || '-'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Progress Bars */}
                                                <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
                                                    <div className="text-center min-w-[100px]">
                                                        <p className="text-xs text-slate-500 mb-1">Reception</p>
                                                        <Progress value={student.reception_progress || 0} className="h-2 w-full" />
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {student.reception_completed || 0}/{student.reception_total || 0}
                                                        </p>
                                                    </div>
                                                    <div className="text-center min-w-[100px]">
                                                        <p className="text-xs text-slate-500 mb-1">Reservation</p>
                                                        <Progress value={student.reservation_progress || 0} className="h-2 w-full" />
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {student.reservation_completed || 0}/{student.reservation_total || 0}
                                                        </p>
                                                    </div>
                                                    <div className="text-center min-w-[80px]">
                                                        <p className="text-xs text-slate-500 mb-1">Total</p>
                                                        <div className="text-lg font-bold text-slate-900">
                                                            {student.total_progress || 0}%
                                                        </div>
                                                        <p className="text-xs text-slate-500">
                                                            {student.total_completed || 0}/{student.total_exercises || 0}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Action */}
                                                <div className="flex-shrink-0">
                                                    <Link href={`/elearning/progress-siswa/${student.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            Detail
                                                            <ChevronRight className="size-4 ml-1" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </Layout>
        </>
    );
}
