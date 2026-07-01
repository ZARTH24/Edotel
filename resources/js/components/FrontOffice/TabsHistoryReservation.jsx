import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import {
    Archive,
    Calendar,
    DollarSign,
    LogOut,
    CreditCard,
    Eye,
    TrendingUp,
    Download,
    Search,
    X,
} from "lucide-react";

export default function TabsHistoryReservation({
    reservations,
    filters,
    stats,
    availableYears,
    months,
    pagination,
}) {
    const { auth } = usePage().props;
    const isSiswa = auth?.user?.role === "siswa";

    const hasData = reservations && reservations.length > 0;
    const [selectedYear, setSelectedYear] = useState(filters.year);
    const [selectedMonth, setSelectedMonth] = useState(filters.month);
    const [historySearch, setHistorySearch] = useState(filters.historySearch || "");

    const applyHistoryFilter = (overrides = {}) => {
        const params = {
            year: overrides.year ?? selectedYear,
            month: overrides.month ?? selectedMonth,
            historySearch: overrides.historySearch ?? historySearch,
            tab: "history",
        };
        router.get("/Frontoffice", params, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    };

    const handlePageClick = (url) => {
        if (!url) return;
        const newUrl = new URL(url, window.location.origin);
        newUrl.searchParams.set("tab", "history");
        newUrl.searchParams.set("year", selectedYear);
        newUrl.searchParams.set("month", selectedMonth);
        if (historySearch) newUrl.searchParams.set("historySearch", historySearch);

        router.get(newUrl.toString(), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const onYearChange = (value) => {
        setSelectedYear(value);
        applyHistoryFilter({ year: value });
    };

    const onMonthChange = (value) => {
        setSelectedMonth(value);
        applyHistoryFilter({ month: value });
    };

    const onHistorySearchChange = (e) => {
        const value = e.target.value;
        setHistorySearch(value);
    };

    const onHistorySearchKeyDown = (e) => {
        if (e.key === "Enter") {
            applyHistoryFilter();
        }
    };

    const clearHistorySearch = () => {
        setHistorySearch("");
        applyHistoryFilter({ historySearch: "" });
    };

    const getStatusBadge = (status) => {
        const styles = {
            "checked-out": "bg-green-100 text-green-700 border-green-200",
            pending: "bg-amber-100 text-amber-700 border-amber-200",
            cancelled: "bg-red-100 text-red-700 border-red-200",
        };
        return styles[status] || "bg-slate-100 text-slate-700";
    };

    return (
        <TabsContent value="history" className="space-y-6 mt-6">
            {/* Month & Year Selector */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Archive className="size-5 text-amber-600" />
                                <CardTitle className="text-slate-900">
                                    Reservation History Archive
                                </CardTitle>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="year-select" className="text-sm text-slate-600">Year:</Label>
                                    <Select value={selectedYear} onValueChange={onYearChange}>
                                        <SelectTrigger id="year-select" className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableYears.map((year) => (
                                                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="month-select" className="text-sm text-slate-600">Month:</Label>
                                    <Select value={selectedMonth} onValueChange={onMonthChange}>
                                        <SelectTrigger id="month-select" className="w-36">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {months.map((month) => (
                                                <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
                            <Input
                                placeholder="Search by guest name or room number..."
                                className="pl-9 pr-9"
                                value={historySearch}
                                onChange={onHistorySearchChange}
                                onKeyDown={onHistorySearchKeyDown}
                            />
                            {historySearch && (
                                <button
                                    onClick={clearHistorySearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Monthly Stats - Hide revenue info for siswa */}
            {!isSiswa && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Reservations"
                        value={stats.totalReservations}
                        icon={<Calendar className="size-4 text-blue-600" />}
                        subText={`${months.find((m) => m.value === selectedMonth)?.label} ${selectedYear}`}
                        exportLink={
                            hasData && selectedMonth !== "all"
                                ? `/Frontoffice/reservations/export?year=${selectedYear}&month=${selectedMonth}`
                                : null
                        }
                    />
                    <StatCard
                        title="Total Revenue"
                        value={`Rp ${stats.totalRevenue.toLocaleString("id-ID")}`}
                        icon={<DollarSign className="size-4 text-green-600" />}
                        subText="Monthly earnings"
                    />
                    <StatCard
                        title="Checked Out"
                        value={stats.checkedOut}
                        icon={<LogOut className="size-4 text-purple-600" />}
                        subText="Completed stays"
                    />
                    <StatCard
                        title="Cancelled"
                        value={stats.cancelled}
                        icon={<CreditCard className="size-4 text-red-600" />}
                        subText="Cancellations"
                    />
                </div>
            )}

            {/* Simplified stats for siswa */}
            {isSiswa && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Total Reservations"
                        value={stats.totalReservations}
                        icon={<Calendar className="size-4 text-blue-600" />}
                        subText={`${months.find((m) => m.value === selectedMonth)?.label} ${selectedYear}`}
                    />
                    <StatCard
                        title="Checked Out"
                        value={stats.checkedOut}
                        icon={<LogOut className="size-4 text-purple-600" />}
                        subText="Completed stays"
                    />
                    <StatCard
                        title="Cancelled"
                        value={stats.cancelled}
                        icon={<CreditCard className="size-4 text-red-600" />}
                        subText="Cancellations"
                    />
                </div>
            )}

            {/* History Table*/}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-slate-900">
                        Reservations -{" "}
                        {months.find((m) => m.value === selectedMonth)?.label}{" "}
                        {selectedYear}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {!hasData ? (
                        <div className="text-center py-12">
                            <Archive className="size-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500">
                                No reservations found for this period
                            </p>
                            <p className="text-sm text-slate-400 mt-1">
                                Try selecting a different month or year
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-200">
                                            <th className="text-left py-3 px-4 text-sm text-slate-600">
                                                Reference
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm text-slate-600">
                                                Guest
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm text-slate-600">
                                                Room
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm text-slate-600">
                                                Check-in
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm text-slate-600">
                                                Check-out
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm text-slate-600">
                                                Nights
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm text-slate-600">
                                                Status
                                            </th>
                                            {!isSiswa && (
                                                <th className="text-left py-3 px-4 text-sm text-slate-600">
                                                    Total
                                                </th>
                                            )}
                                            <th className="text-left py-3 px-4 text-sm text-slate-600">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reservations.map((reservation) => {
                                            const checkIn = new Date(
                                                reservation.check_in,
                                            );
                                            const checkOut = new Date(
                                                reservation.check_out,
                                            );
                                            const nights = Math.ceil(
                                                (checkOut - checkIn) /
                                                    (1000 * 60 * 60 * 24),
                                            );

                                            return (
                                                <tr
                                                    key={reservation.id}
                                                    className="border-b border-slate-100 hover:bg-slate-50"
                                                >
                                                    <td className="py-3 px-4">
                                                        <span className="text-xs font-mono text-slate-600">
                                                            {reservation.booking_reference || `#${reservation.id}`}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="font-medium text-slate-900">
                                                            {
                                                                reservation
                                                                    .guest?.name
                                                            }
                                                        </div>
                                                        <div className="text-sm text-slate-500">
                                                            {
                                                                reservation
                                                                    .guest
                                                                    ?.email
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="font-medium text-slate-900">
                                                            {
                                                                reservation.room
                                                                    ?.number
                                                            }
                                                        </div>
                                                        <div className="text-sm text-slate-500 capitalize">
                                                            {
                                                                reservation.room
                                                                    ?.type
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-slate-700">
                                                        {new Date(
                                                            reservation.check_in,
                                                        ).toLocaleDateString(
                                                            "id-ID",
                                                            {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                            },
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4 text-slate-700">
                                                        {new Date(
                                                            reservation.check_out,
                                                        ).toLocaleDateString(
                                                            "id-ID",
                                                            {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                            },
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4 text-slate-700">
                                                        {nights}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <Badge
                                                            className={getStatusBadge(
                                                                reservation.status,
                                                            )}
                                                        >
                                                            {reservation.status}
                                                        </Badge>
                                                    </td>
                                                    {!isSiswa && (
                                                        <td className="py-3 px-4 text-slate-700 font-semibold">
                                                            Rp{" "}
                                                            {Number(
                                                                reservation.total_price,
                                                            ).toLocaleString(
                                                                "id-ID",
                                                            )}
                                                        </td>
                                                    )}
                                                    <td className="py-3 px-4">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                router.get(
                                                                     `/Frontoffice/reservations/${reservation.booking_reference || reservation.id}/details`,
                                                                )
                                                            }
                                                        >
                                                            <Eye className="size-3 mr-1" />{" "}
                                                            View
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {pagination && pagination.links.length > 3 && (
                                <Pagination className="mt-6 border-t border-slate-100 pt-6">
                                    <PaginationContent>
                                        {pagination.links.map((link, index) => {
                                            const isPrev =
                                                link.label.includes("Previous");
                                            const isNext =
                                                link.label.includes("Next");
                                            const isEllipsis =
                                                link.label === "...";
                                            return (
                                                <PaginationItem key={index}>
                                                    {isPrev ? (
                                                        <PaginationPrevious
                                                            onClick={() =>
                                                                handlePageClick(
                                                                    link.url,
                                                                )
                                                            }
                                                            className={
                                                                !link.url
                                                                    ? "pointer-events-none opacity-50"
                                                                    : "cursor-pointer"
                                                            }
                                                        />
                                                    ) : isNext ? (
                                                        <PaginationNext
                                                            onClick={() =>
                                                                handlePageClick(
                                                                    link.url,
                                                                )
                                                            }
                                                            className={
                                                                !link.url
                                                                    ? "pointer-events-none opacity-50"
                                                                    : "cursor-pointer"
                                                            }
                                                        />
                                                    ) : isEllipsis ? (
                                                        <PaginationEllipsis />
                                                    ) : (
                                                        <PaginationLink
                                                            onClick={() =>
                                                                handlePageClick(
                                                                    link.url,
                                                                )
                                                            }
                                                            isActive={
                                                                link.active
                                                            }
                                                            className="cursor-pointer"
                                                        >
                                                            {link.label
                                                                .replace(
                                                                    "&laquo; ",
                                                                    "",
                                                                )
                                                                .replace(
                                                                    " &raquo;",
                                                                    "",
                                                                )}
                                                        </PaginationLink>
                                                    )}
                                                </PaginationItem>
                                            );
                                        })}
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Summary Footer - Hide revenue for siswa */}
            {reservations.length > 0 && !isSiswa && (
                <Card className="border-amber-200 bg-amber-50 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="size-5 text-amber-700" />
                                <span className="text-slate-700">
                                    Summary for{" "}
                                    {
                                        months.find(
                                            (m) => m.value === selectedMonth,
                                        )?.label
                                    }{" "}
                                    {selectedYear}
                                </span>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <div className="text-sm text-slate-600">
                                        Total Bookings
                                    </div>
                                    <div className="text-xl font-semibold text-slate-900">
                                        {stats.totalReservations}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-600">
                                        Total Revenue
                                    </div>
                                    <div className="text-xl font-semibold text-amber-700">
                                        Rp{" "}
                                        {stats.totalRevenue.toLocaleString(
                                            "id-ID",
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-600">
                                        Avg. per Booking
                                    </div>
                                    <div className="text-xl font-semibold text-slate-900">
                                        Rp{" "}
                                        {stats.totalReservations > 0
                                            ? Math.round(
                                                  stats.totalRevenue /
                                                      stats.totalReservations,
                                              ).toLocaleString("id-ID")
                                            : 0}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Simplified Summary for siswa */}
            {reservations.length > 0 && isSiswa && (
                <Card className="border-slate-200 bg-slate-50 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="size-5 text-slate-700" />
                                <span className="text-slate-700">
                                    Summary for{" "}
                                    {
                                        months.find(
                                            (m) => m.value === selectedMonth,
                                        )?.label
                                    }{" "}
                                    {selectedYear}
                                </span>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <div className="text-sm text-slate-600">
                                        Total Bookings
                                    </div>
                                    <div className="text-xl font-semibold text-slate-900">
                                        {stats.totalReservations}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-600">
                                        Checked Out
                                    </div>
                                    <div className="text-xl font-semibold text-green-700">
                                        {stats.checkedOut}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-600">
                                        Cancelled
                                    </div>
                                    <div className="text-xl font-semibold text-red-700">
                                        {stats.cancelled}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </TabsContent>
    );
}

// ==============================================================================
// 2. UPDATE SUB-KOMPONEN STATCARD UNTUK MENERIMA DAN MENAMPILKAN TOMBOL
// ==============================================================================
function StatCard({ title, value, icon, subText, exportLink }) {
    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-slate-600">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                {/* Gunakan flex untuk mensejajarkan value dan tombol */}
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-semibold text-slate-900">
                        {value}
                    </div>

                    {/* Tampilkan tombol HANYA jika exportLink tersedia (bukan null) */}
                    {exportLink && (
                        <a
                            href={exportLink}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-green-600"
                            title="Download CSV untuk bulan ini"
                        >
                            <Download className="size-5" />
                        </a>
                    )}
                </div>
                <p className="text-xs text-slate-500 mt-1">{subText}</p>
            </CardContent>
        </Card>
    );
}
