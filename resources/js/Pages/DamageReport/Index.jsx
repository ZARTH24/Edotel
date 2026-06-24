import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Wrench,
    Clock,
    User,
    Calendar,
    WalletMinimal,
    Archive,
    DollarSign,
    TrendingUp,
    Eye,
    Download,
} from "lucide-react";
import CreateMaintenance from "@/components/DamageReport/CreateMaintenance";
import CompletedMaintenance from "@/components/DamageReport/CompletedMaintenance";
import { Head, router } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function Index({
    maintenances,
    rooms,
    historyMaintenances, // Data pagination history dari controller
    historyStats, // Data statistik history
    filters, // Filter aktif (year, month)
    availableYears,
    months,
}) {
    const [selectedTab, setSelectedTab] = useState("alldamage");
    const [selectedYear, setSelectedYear] = useState(
        filters?.year || new Date().getFullYear().toString(),
    );
    const [selectedMonth, setSelectedMonth] = useState(filters?.month || "all");

    const activeMaintenances = maintenances.filter(
        (m) => m.status === "pending" || m.status === "in-progress",
    );

    // Fungsi Handle Filter History
    const handleFilterChange = (year, month) => {
        router.get(
            "/Damagereport",
            { year, month, tab: "historydamage" },
            { preserveState: true, replace: true, preserveScroll: true },
        );
    };

    const handleApprove = (taskId) => {
        router.post(`/Damagereport/${taskId}/approve`);
    };

    const getPriorityBadge = (priority) => {
        const styles = {
            low: "bg-blue-100 text-blue-700 border-blue-200",
            medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
            high: "bg-red-100 text-red-700 border-red-200",
        };
        return styles[priority] || "bg-slate-100";
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: "bg-orange-100 text-orange-700 border-orange-200",
            "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
            completed: "bg-green-100 text-green-700 border-green-200",
            cancelled: "bg-slate-100 text-slate-700 border-slate-200",
        };
        return styles[status] || "bg-slate-100";
    };

    return (
        <>
            <Head title="Demage Report" />
            <Layout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-serif text-slate-900">
                                Maintenance Requests
                            </h2>
                            <p className="text-slate-600 mt-1">
                                Track and manage room maintenance
                            </p>
                        </div>
                        <CreateMaintenance rooms={rooms} />
                    </div>

                    {/* Stats Aktif */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* ... Stats Card Pending, In Progress, Completed (Sama seperti kode Anda) ... */}
                    </div>

                    <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                        <TabsList className="grid w-full grid-cols-2 lg:w-auto bg-stone-200 gap-5">
                            <TabsTrigger
                                value="alldamage"
                                className="rounded-full"
                            >
                                New Damage Report
                            </TabsTrigger>
                            <TabsTrigger
                                value="history"
                                className="rounded-full"
                            >
                                History
                            </TabsTrigger>
                        </TabsList>

                        {/* CONTENT: NEW DAMAGE */}
                        <TabsContent
                            value="alldamage"
                            className="space-y-6 mt-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm text-slate-600">
                                            Pending
                                        </CardTitle>
                                        <Clock className="size-4 text-orange-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-semibold text-slate-900">
                                            {
                                                maintenances.filter(
                                                    (m) =>
                                                        m.status === "pending",
                                                ).length
                                            }
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Awaiting assignment
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm text-slate-600">
                                            In Progress
                                        </CardTitle>
                                        <Wrench className="size-4 text-blue-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-semibold text-slate-900">
                                            {
                                                maintenances.filter(
                                                    (m) =>
                                                        m.status ===
                                                        "in-progress",
                                                ).length
                                            }
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Being worked on
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="border-slate-200 shadow-sm pt-7">
                                <CardContent>
                                    <div className="space-y-4">
                                        {activeMaintenances.length === 0 ? (
                                            <p className="text-center text-slate-500 py-8">
                                                No maintenance requests
                                            </p>
                                        ) : (
                                            activeMaintenances.map(
                                                (m, index) => (
                                                    <div
                                                        key={index}
                                                        className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                                                    >
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    {m.room_id ? (
                                                                        <span className="text-lg font-semibold text-slate-900">
                                                                            Room{" "}
                                                                            {
                                                                                m
                                                                                    .room
                                                                                    .number
                                                                            }
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-lg font-semibold text-slate-900">
                                                                            {
                                                                                m.ruangan
                                                                            }
                                                                        </span>
                                                                    )}

                                                                    <Badge
                                                                        className={getPriorityBadge(
                                                                            m.priority,
                                                                        )}
                                                                    >
                                                                        {
                                                                            m.priority
                                                                        }
                                                                    </Badge>
                                                                    <Badge
                                                                        className={getStatusBadge(
                                                                            m.status,
                                                                        )}
                                                                    >
                                                                        {
                                                                            m.status
                                                                        }
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-slate-700 mb-3">
                                                                    {m.issue}
                                                                </p>

                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                                                    <div className="flex items-center gap-2 text-slate-600">
                                                                        <User className="size-3" />
                                                                        Reported
                                                                        by:{" "}
                                                                        <span className="text-slate-900">
                                                                            {
                                                                                m.reported_by
                                                                            }
                                                                        </span>
                                                                    </div>

                                                                    {m.started_at ===
                                                                    null ? (
                                                                        <div className="flex items-center gap-2 text-slate-600">
                                                                            <Calendar className="size-3" />
                                                                            {
                                                                                m.reported_at
                                                                            }
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex items-center gap-2 text-slate-600">
                                                                            <DropdownMenu>
                                                                                <DropdownMenuTrigger
                                                                                    asChild
                                                                                >
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        className="flex gap-2"
                                                                                    >
                                                                                        <Calendar className="size-4" />
                                                                                        View
                                                                                        Dates
                                                                                    </Button>
                                                                                </DropdownMenuTrigger>

                                                                                <DropdownMenuContent
                                                                                    align="start"
                                                                                    className="w-56"
                                                                                >
                                                                                    <DropdownMenuItem>
                                                                                        <span className="font-medium">
                                                                                            Reported:
                                                                                        </span>
                                                                                        <span className="ml-auto text-xs text-slate-500">
                                                                                            {m.reported_at ??
                                                                                                "-"}
                                                                                        </span>
                                                                                    </DropdownMenuItem>

                                                                                    <DropdownMenuItem>
                                                                                        <span className="font-medium">
                                                                                            Started:
                                                                                        </span>
                                                                                        <span className="ml-auto text-xs text-slate-500">
                                                                                            {m.started_at ??
                                                                                                "-"}
                                                                                        </span>
                                                                                    </DropdownMenuItem>

                                                                                    <DropdownMenuItem>
                                                                                        <span className="font-medium">
                                                                                            Completed:
                                                                                        </span>
                                                                                        <span className="ml-auto text-xs text-slate-500">
                                                                                            {m.completed_at ??
                                                                                                "-"}
                                                                                        </span>
                                                                                    </DropdownMenuItem>
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>
                                                                        </div>
                                                                    )}

                                                                    {m.assigned_to && (
                                                                        <div className="flex items-center gap-2 text-slate-600">
                                                                            <Wrench className="size-3" />
                                                                            Assigned:{" "}
                                                                            <span className="text-slate-900">
                                                                                {
                                                                                    m
                                                                                        .assign
                                                                                        .name
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )}

                                                                    {m.estimated_cost && (
                                                                        <div className="flex items-center gap-2 text-slate-600">
                                                                            <WalletMinimal className="size-4" />
                                                                            {
                                                                                m.estimated_rupiah
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {m.status ===
                                                                    "completed" &&
                                                                    m.resolution_notes && (
                                                                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                                                                            <div className="text-sm text-green-900">
                                                                                <strong>
                                                                                    Solution:{" "}
                                                                                </strong>
                                                                                {
                                                                                    m.resolution_notes
                                                                                }
                                                                            </div>
                                                                            {m.actual_cost && (
                                                                                <div className="text-sm text-green-700 mt-1">
                                                                                    Actual
                                                                                    cost:{" "}
                                                                                    {
                                                                                        m.actual_rupiah
                                                                                    }
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                            </div>

                                                            <div className="ml-4">
                                                                {m.status ===
                                                                    "pending" && (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                                                        onClick={() => {
                                                                            handleApprove(
                                                                                m.id,
                                                                            );
                                                                        }}
                                                                    >
                                                                        Approve
                                                                    </Button>
                                                                )}
                                                                {m.status ===
                                                                    "in-progress" && (
                                                                    <CompletedMaintenance
                                                                        id={
                                                                            m.id
                                                                        }
                                                                        estimated_cost={
                                                                            m.estimated_cost
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ),
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="history" className="space-y-6 mt-6">
                            {/* 1. History Filter Card (Tetap Sama) */}
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-2">
                                            <Wrench className="size-5 text-amber-600" />
                                            <CardTitle className="text-slate-900">
                                                Maintenance History Archive
                                            </CardTitle>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <Label
                                                    htmlFor="year-select"
                                                    className="text-sm text-slate-600"
                                                >
                                                    Year:
                                                </Label>
                                                <Select
                                                    value={selectedYear}
                                                    onValueChange={(v) => {
                                                        setSelectedYear(v);
                                                        handleFilterChange(
                                                            v,
                                                            selectedMonth,
                                                        );
                                                    }}
                                                >
                                                    <SelectTrigger
                                                        id="year-select"
                                                        className="w-32"
                                                    >
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {availableYears?.map(
                                                            (year) => (
                                                                <SelectItem
                                                                    key={year}
                                                                    value={year.toString()}
                                                                >
                                                                    {year}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Label
                                                    htmlFor="month-select"
                                                    className="text-sm text-slate-600"
                                                >
                                                    Month:
                                                </Label>
                                                <Select
                                                    value={selectedMonth}
                                                    onValueChange={(v) => {
                                                        setSelectedMonth(v);
                                                        handleFilterChange(
                                                            selectedYear,
                                                            v,
                                                        );
                                                    }}
                                                >
                                                    <SelectTrigger
                                                        id="month-select"
                                                        className="w-36"
                                                    >
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {months?.map(
                                                            (month) => (
                                                                <SelectItem
                                                                    key={
                                                                        month.value
                                                                    }
                                                                    value={
                                                                        month.value
                                                                    }
                                                                >
                                                                    {
                                                                        month.label
                                                                    }
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>

                            {/* 2. History Stats (Tetap Sama) */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <StatCard
                                    title="Total Requests"
                                    value={historyStats?.totalRequests || 0}
                                    icon={
                                        <Archive className="size-4 text-slate-600" />
                                    }
                                    subText="Completed and cancelled"
                                    exportLink={
                                        historyMaintenances?.data?.length > 0 && selectedMonth !== "all"
                                            ? `/Damagereport/export?year=${selectedYear}&month=${selectedMonth}`
                                            : null
                                    }
                                />
                                <StatCard
                                    title="Total Cost"
                                    value={`Rp ${historyStats?.totalCost.toLocaleString("id-ID") || 0}`}
                                    icon={
                                        <DollarSign className="size-4 text-emerald-600" />
                                    }
                                    subText="Actual expenditure"
                                />
                                <StatCard
                                    title="Average Cost"
                                    value={`Rp ${historyStats?.avgCost.toLocaleString("id-ID") || 0}`}
                                    icon={
                                        <TrendingUp className="size-4 text-blue-600" />
                                    }
                                    subText="Per request"
                                />
                            </div>

                            {/* 3. History List Card (Menggantikan Table) */}
                            <Card className="border-slate-200 shadow-sm">
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        {!historyMaintenances ||
                                        historyMaintenances.data.length ===
                                            0 ? (
                                            <p className="text-center text-slate-500 py-8">
                                                No maintenance history found for
                                                this period
                                            </p>
                                        ) : (
                                            historyMaintenances.data.map(
                                                (m, index) => (
                                                    <div
                                                        key={index}
                                                        className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                                                    >
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    {m.room_id ? (
                                                                        <span className="text-lg font-semibold text-slate-900">
                                                                            Room{" "}
                                                                            {
                                                                                m
                                                                                    .room
                                                                                    .number
                                                                            }
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-lg font-semibold text-slate-900">
                                                                            {
                                                                                m.ruangan
                                                                            }
                                                                        </span>
                                                                    )}

                                                                    <Badge
                                                                        className={getPriorityBadge(
                                                                            m.priority,
                                                                        )}
                                                                    >
                                                                        {
                                                                            m.priority
                                                                        }
                                                                    </Badge>
                                                                    <Badge
                                                                        className={getStatusBadge(
                                                                            m.status,
                                                                        )}
                                                                    >
                                                                        {
                                                                            m.status
                                                                        }
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-slate-700 mb-3">
                                                                    {m.issue}
                                                                </p>

                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                                                    <div className="flex items-center gap-2 text-slate-600">
                                                                        <User className="size-3" />
                                                                        Reported
                                                                        by:{" "}
                                                                        <span className="text-slate-900">
                                                                            {
                                                                                m.reported_by
                                                                            }
                                                                        </span>
                                                                    </div>

                                                                    {m.started_at ===
                                                                    null ? (
                                                                        <div className="flex items-center gap-2 text-slate-600">
                                                                            <Calendar className="size-3" />
                                                                            {
                                                                                m.reported_at
                                                                            }
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex items-center gap-2 text-slate-600">
                                                                            <DropdownMenu>
                                                                                <DropdownMenuTrigger
                                                                                    asChild
                                                                                >
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        className="flex gap-2"
                                                                                    >
                                                                                        <Calendar className="size-4" />
                                                                                        View
                                                                                        Dates
                                                                                    </Button>
                                                                                </DropdownMenuTrigger>

                                                                                <DropdownMenuContent
                                                                                    align="start"
                                                                                    className="w-56"
                                                                                >
                                                                                    <DropdownMenuItem>
                                                                                        <span className="font-medium">
                                                                                            Reported:
                                                                                        </span>
                                                                                        <span className="ml-auto text-xs text-slate-500">
                                                                                            {m.reported_at ??
                                                                                                "-"}
                                                                                        </span>
                                                                                    </DropdownMenuItem>

                                                                                    <DropdownMenuItem>
                                                                                        <span className="font-medium">
                                                                                            Started:
                                                                                        </span>
                                                                                        <span className="ml-auto text-xs text-slate-500">
                                                                                            {m.started_at ??
                                                                                                "-"}
                                                                                        </span>
                                                                                    </DropdownMenuItem>

                                                                                    <DropdownMenuItem>
                                                                                        <span className="font-medium">
                                                                                            Completed:
                                                                                        </span>
                                                                                        <span className="ml-auto text-xs text-slate-500">
                                                                                            {m.completed_at ??
                                                                                                "-"}
                                                                                        </span>
                                                                                    </DropdownMenuItem>
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>
                                                                        </div>
                                                                    )}

                                                                    {m.assigned_to && (
                                                                        <div className="flex items-center gap-2 text-slate-600">
                                                                            <Wrench className="size-3" />
                                                                            Assigned:{" "}
                                                                            <span className="text-slate-900">
                                                                                {
                                                                                    m
                                                                                        .assign
                                                                                        .name
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )}

                                                                    {m.estimated_cost && (
                                                                        <div className="flex items-center gap-2 text-slate-600">
                                                                            <WalletMinimal className="size-4" />
                                                                            {
                                                                                m.estimated_rupiah
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {m.status ===
                                                                    "completed" &&
                                                                    m.resolution_notes && (
                                                                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                                                                            <div className="text-sm text-green-900">
                                                                                <strong>
                                                                                    Solution:{" "}
                                                                                </strong>
                                                                                {
                                                                                    m.resolution_notes
                                                                                }
                                                                            </div>
                                                                            {m.actual_cost && (
                                                                                <div className="text-sm text-green-700 mt-1">
                                                                                    Actual
                                                                                    cost:{" "}
                                                                                    {
                                                                                        m.actual_rupiah
                                                                                    }
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                            </div>

                                                            <div className="ml-4">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="flex gap-2"
                                                                    onClick={() => {
                                                                        router.get(
                                                                            `/Damagereport/${m.id}/details`,
                                                                        );
                                                                    }}
                                                                >
                                                                    <Eye className="size-4" />
                                                                    View
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ),
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </Layout>
        </>
    );
}

// Sub-komponen StatCard
function StatCard({ title, value, icon, subText, exportLink }) {
    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-slate-600">
                    {title}
                </CardTitle>
                <div className="flex items-center gap-2">
                    {exportLink && (
                        <a
                            href={exportLink}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-green-600"
                            title="Download XLSX"
                        >
                            <Download className="size-5" />
                        </a>
                    )}
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="text-3xl font-semibold text-slate-900">
                        {value}
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">{subText}</p>
            </CardContent>
        </Card>
    );
}
