import React from "react";
import Layout from "@/components/Layout/Layout";
import {
    BedDouble,
    Calendar,
    Clock,
    DollarSign,
    TrendingUp,
    Users,
    Users2,
    ClipboardList,
    CalendarCheck,
    Trophy,
    BookOpen,
    Lock,
    CheckCircle,
    BarChart3,
    ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Head, Link, usePage } from "@inertiajs/react";

export default function Dashboard({ rooms, elearningStats, studentStats }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user?.role === "admin";
    const isSiswa = auth.user?.role === "siswa";
    const isFrontOffice = auth.user?.role === "front-office";
    const isHousekeeping = auth.user?.role === "housekeeping";
    // Hitung occupancy
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
    const occupancyRate =
        totalRooms > 0
            ? Number(((occupiedRooms / totalRooms) * 100).toFixed(0))
            : 0;

    // Tanggal hari ini
    const todayStr = new Date().toISOString().split("T")[0];

    const todayCheckIns = rooms
        .flatMap((r) => r.reservations)
        .filter((res) => res.check_in?.startsWith(todayStr)).length;

    const todayCheckOuts = rooms
        .flatMap((r) => r.reservations)
        .filter((res) => res.checked_out_at?.startsWith(todayStr)).length;

    // Total revenue (hanya yang checked-out)
    const totalRevenue = rooms
        .flatMap((r) => r.reservations)
        .filter((res) => res.status === "checked-out")
        .reduce((sum, res) => sum + Number(res.total_price), 0);

    // Format ke Rupiah
    const totalRevenueRupiah = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(totalRevenue);

    // Dashboard stats
    const stats = [
        {
            title: "Occupancy Rate",
            value: `${occupancyRate}%`,
            description: `${occupiedRooms}/${totalRooms} rooms occupied`,
            icon: BedDouble,
            color: "from-blue-500 to-blue-600",
        },
        {
            title: "Today Check-ins",
            value: todayCheckIns.toString(),
            description: `${todayCheckOuts} check-outs today`,
            icon: Calendar,
            color: "from-green-500 to-green-600",
        },
        {
            title: "Revenue (Month)",
            value: totalRevenueRupiah,
            description: "+12% from last month",
            icon: DollarSign,
            color: "from-amber-500 to-amber-600",
        },
        {
            title: "Active Guests",
            value: occupiedRooms.toString(),
            description: `${
                rooms
                    .flatMap((r) => r.reservations)
                    .filter((res) => res.status === "confirmed").length
            } upcoming`,
            icon: Users,
            color: "from-purple-500 to-purple-600",
        },
    ];

    // E-Learning Stats
    const eLearningCards = [
        {
            title: "Reception Progress",
            value: `${elearningStats?.reception_progress ?? 0}%`,
            description: `${elearningStats?.reception_completed ?? 0}/${elearningStats?.reception_total ?? 0} exercises`,
            icon: ClipboardList,
            color: "from-blue-500 to-blue-600",
            href: "/elearning/reception",
        },
        {
            title: "Reservation Progress",
            value: `${elearningStats?.reservation_progress ?? 0}%`,
            description: `${elearningStats?.reservation_completed ?? 0}/${elearningStats?.reservation_total ?? 0} exercises`,
            icon: CalendarCheck,
            color: "from-green-500 to-green-600",
            href: "/elearning/reservation",
        },
        {
            title: "Total Progress",
            value: `${elearningStats?.total_progress ?? 0}%`,
            description: `${elearningStats?.total_completed ?? 0}/${elearningStats?.total_exercises ?? 0} exercises`,
            icon: Trophy,
            color: "from-amber-500 to-amber-600",
            href: "/elearning",
        },
        {
            title: "Remaining",
            value: `${elearningStats?.remaining ?? 0}`,
            description: "exercises left",
            icon: BookOpen,
            color: "from-purple-500 to-purple-600",
            href: "/elearning",
        },
    ];

    const recentActivity = rooms
        .flatMap((r) => {
            const activities = [];

            // RESERVATION EVENTS
            r.reservations.forEach((res) => {
                if (res.created_at)
                    activities.push({
                        timestamp: new Date(res.created_at),
                        action: "New Reservation",
                        detail: `${res.guest.name} - Room ${r.number}`,
                    });
                if (res.checked_in_at)
                    activities.push({
                        timestamp: new Date(res.checked_in_at),
                        action: "Check-in completed",
                        detail: `${res.guest.name} - Room ${r.number}`,
                    });
                if (res.checked_out_at)
                    activities.push({
                        timestamp: new Date(res.checked_out_at),
                        action: "Check-out completed",
                        detail: `${res.guest.name} - Room ${r.number}`,
                    });
            });

            // MAINTENANCE EVENTS
            r.maintenance_tasks?.forEach((m) => {
                if (m.created_at)
                    activities.push({
                        timestamp: new Date(m.created_at),
                        action: "Maintenance reported",
                        detail: `Room ${r.number} - ${m.issue}`,
                    });
                if (m.started_at)
                    activities.push({
                        timestamp: new Date(m.started_at),
                        action: "Maintenance started",
                        detail: `Room ${r.number} - ${m.issue}`,
                    });
                if (m.completed_at)
                    activities.push({
                        timestamp: new Date(m.completed_at),
                        action: "Maintenance completed",
                        detail: `Room ${r.number} - ${m.issue}`,
                    });
            });

            return activities;
        })
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 15);

    const colSize = Math.ceil(recentActivity.length / 3);
    const columns = [
        recentActivity.slice(0, colSize),
        recentActivity.slice(colSize, colSize * 2),
        recentActivity.slice(colSize * 2),
    ];

    return (
        <>
            <Head title="Dashboard" />

            <Layout>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-3xl font-serif text-slate-900 dark:text-slate-100">Dashboard</h2>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">Welcome to Grand Luxury Hotel Management</p>
                    </div>

                    {/* Student Monitoring Section - Admin Only */}
                    {isAdmin && studentStats && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                                    Monitoring Siswa
                                </h3>
                                <Link
                                    href="/elearning/progress-siswa"
                                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                                >
                                    Lihat Detail →
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm text-slate-600">
                                            Total Siswa
                                        </CardTitle>
                                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                                            <Users className="size-4 text-white" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-slate-900">
                                            {studentStats.total_siswa}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Siswa terdaftar
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm text-slate-600">
                                            Siswa Selesai
                                        </CardTitle>
                                        <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg">
                                            <CheckCircle className="size-4 text-white" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-green-600">
                                            {studentStats.siswa_selesai}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Telah menyelesaikan E-Learning
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm text-slate-600">
                                            Belum Selesai
                                        </CardTitle>
                                        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-2 rounded-lg">
                                            <Clock className="size-4 text-white" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-amber-600">
                                            {studentStats.siswa_belum_selesai}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Masih dalam pembelajaran
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm text-slate-600">
                                            Rata-rata Progress
                                        </CardTitle>
                                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
                                            <BarChart3 className="size-4 text-white" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-purple-600">
                                            {studentStats.avg_total_progress}%
                                        </div>
                                        <div className="mt-2 w-full bg-slate-100 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all"
                                                style={{ width: `${studentStats.avg_total_progress}%` }}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Quick Progress Overview */}
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-slate-900">
                                            Overview Progress Siswa
                                        </CardTitle>
                                        <Link href="/elearning/progress-siswa">
                                            <Button variant="outline" size="sm">
                                                Lihat Semua Siswa
                                                <ChevronRight className="size-4 ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                                            <p className="text-sm text-slate-600 mb-2">Reception Completion</p>
                                            <div className="text-3xl font-bold text-blue-600">
                                                {studentStats.avg_reception_progress}%
                                            </div>
                                            <Progress value={studentStats.avg_reception_progress} className="h-2 mt-2" />
                                        </div>
                                        <div className="text-center p-4 bg-green-50 rounded-lg">
                                            <p className="text-sm text-slate-600 mb-2">Reservation Completion</p>
                                            <div className="text-3xl font-bold text-green-600">
                                                {studentStats.avg_reservation_progress}%
                                            </div>
                                            <Progress value={studentStats.avg_reservation_progress} className="h-2 mt-2" />
                                        </div>
                                        <div className="text-center p-4 bg-amber-50 rounded-lg">
                                            <p className="text-sm text-slate-600 mb-2">Total Completion</p>
                                            <div className="text-3xl font-bold text-amber-600">
                                                {studentStats.avg_total_progress}%
                                            </div>
                                            <Progress value={studentStats.avg_total_progress} className="h-2 mt-2" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* E-Learning Progress Section - hanya untuk Siswa */}
                    {isSiswa ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {eLearningCards.map((card) => (
                                <Link key={card.title} href={card.href}>
                                    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                                            <CardTitle className="text-sm text-slate-600">
                                                {card.title}
                                            </CardTitle>
                                            <div
                                                className={`bg-gradient-to-br ${card.color} p-2 rounded-lg`}
                                            >
                                                <card.icon className="size-4 text-white" />
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-semibold text-slate-900">
                                                {card.value}
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {card.description}
                                            </p>
                                            {/* Progress Bar */}
                                            <div className="mt-3 w-full bg-slate-100 rounded-full h-2">
                                                <div
                                                    className={`bg-gradient-to-r ${card.color} h-2 rounded-full transition-all`}
                                                    style={{
                                                        width: card.value,
                                                    }}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : null}

                    {/* Hotel Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                        {stats.map((stat) => (
                            <Card
                                key={stat.title}
                                className="border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm text-slate-600">
                                        {stat.title}
                                    </CardTitle>
                                    <div
                                        className={`bg-gradient-to-br ${stat.color} p-2 rounded-lg`}
                                    >
                                        <stat.icon className="size-4 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-semibold text-slate-900">
                                        {stat.value}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {stat.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                        {/* Room Status Overview */}
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-slate-900">
                                    Room Status Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-green-500" />
                                            <span className="text-slate-700">
                                                Available
                                            </span>
                                        </div>
                                        <span className="font-semibold text-slate-900">
                                            {
                                                rooms.filter(
                                                    (r) =>
                                                        r.status ===
                                                        "available",
                                                ).length
                                            }{" "}
                                            rooms
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-red-500" />
                                            <span className="text-slate-700">
                                                Occupied
                                            </span>
                                        </div>
                                        <span className="font-semibold text-slate-900">
                                            {
                                                rooms.filter(
                                                    (r) =>
                                                        r.status === "occupied",
                                                ).length
                                            }{" "}
                                            rooms
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                            <span className="text-slate-700">
                                                Cleaning
                                            </span>
                                        </div>
                                        <span className="font-semibold text-slate-900">
                                            {
                                                rooms.filter(
                                                    (r) =>
                                                        r.status === "cleaning",
                                                ).length
                                            }{" "}
                                            rooms
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-orange-500" />
                                            <span className="text-slate-700">
                                                Maintenance
                                            </span>
                                        </div>
                                        <span className="font-semibold text-slate-900">
                                            {
                                                rooms.filter(
                                                    (r) =>
                                                        r.status ===
                                                        "maintenance",
                                                ).length
                                            }{" "}
                                            rooms
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                                            <span className="text-slate-700">
                                                Reserved
                                            </span>
                                        </div>
                                        <span className="font-semibold text-slate-900">
                                            {
                                                rooms.filter(
                                                    (r) =>
                                                        r.status === "reserved",
                                                ).length
                                            }{" "}
                                            rooms
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Housekeeping Status */}
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-slate-900">
                                    Housekeeping Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        "pending",
                                        "in-progress",
                                        "completed",
                                    ].map((status) => {
                                        // hitung jumlah room yang punya cleaningTask dengan status tertentu
                                        const count = rooms.filter((room) =>
                                            room.cleaning_tasks?.some(
                                                (task) =>
                                                    task.status === status,
                                            ),
                                        ).length;

                                        const statusConfig = {
                                            pending: {
                                                className: "bg-red-50 border-red-200 text-red-600",
                                                icon: Clock,
                                                label: "Pending Tasks",
                                            },
                                            "in-progress": {
                                                className: "bg-yellow-50 border-yellow-200 text-yellow-600",
                                                icon: TrendingUp,
                                                label: "In Progress",
                                            },
                                            completed: {
                                                className: "bg-green-50 border-green-200 text-green-600",
                                                icon: BedDouble,
                                                label: "Completed Today",
                                            },
                                        };

                                        const { className, icon: StatusIcon, label } =
                                            statusConfig[status];

                                        return (
                                            <div
                                                key={status}
                                                className={`flex items-center justify-between p-3 ${className} rounded-lg border`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <StatusIcon
                                                        className={`size-5 ${className}`}
                                                    />
                                                    <span className="text-slate-700">
                                                        {label}
                                                    </span>
                                                </div>
                                                <span className={`font-semibold ${className}`}
                                                >
                                                    {count}{" "}
                                                    {count > 1
                                                        ? "rooms"
                                                        : "room"}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-slate-900">
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentActivity.length > 0 ? (
                                <div className="grid grid-cols-3 gap-6">
                                    {columns.map((col, i) => (
                                        <div key={i} className="space-y-3">
                                            {col.map((act, index) => (
                                                <div
                                                    key={index}
                                                    className={`flex items-start gap-4 pb-3 border-b border-slate-100 ${
                                                        index === col.length - 1
                                                            ? "last:border-0"
                                                            : ""
                                                    }`}
                                                >
                                                    {/* Kolom tanggal & jam */}
                                                    <div className="flex flex-col items-start min-w-[80px]">
                                                        {/* Tanggal tetap kiri */}
                                                        <span className="text-sm font-semibold text-slate-400">
                                                            {new Date(
                                                                act.timestamp,
                                                            ).toLocaleDateString(
                                                                "id-ID",
                                                                {
                                                                    day: "2-digit",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                },
                                                            )}
                                                        </span>

                                                        {/* Jam di tengah */}
                                                        <span className="text-xs text-slate-500 mt-1 w-full text-center">
                                                            {new Date(
                                                                act.timestamp,
                                                            ).toLocaleTimeString(
                                                                "id-ID",
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                    hour12: false,
                                                                },
                                                            )}
                                                        </span>
                                                    </div>

                                                    {/* Detail aktivitas */}
                                                    <div className="flex-1">
                                                        <div className="text-slate-900 font-medium">
                                                            {act.action}
                                                        </div>
                                                        <div className="text-sm text-slate-500">
                                                            {act.detail}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-slate-500 py-8">
                                    No Recent Activity
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </Layout>
        </>
    );
}
