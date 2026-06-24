import { useEffect, useState } from "react";
import { Search, Calendar, Phone, Mail, MapPin, Plus, Eye, Pencil, Loader2, UserCheck, UserX, LogOut, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout/Layout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import TabsHistoryReservation from "@/components/FrontOffice/TabsHistoryReservation";
import Rooms from "@/components/FrontOffice/Room/Rooms";

export default function Index({
    rooms,
    archivedRooms,
    historyData,
    reservations,
    guests,
    stats,
    filters,
    availableYears,
    months,
}) {
    const STORAGE_KEY = "reservations";

    const [selectedTab, setSelectedTab] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem(STORAGE_KEY) || "reservations";
        }
        return "reservations";
    });

    const [loadingId, setLoadingId] = useState(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, selectedTab);
    }, [selectedTab]);

    const { data, setData, get } = useForm({
        search: "",
        guestSearch: "",
    });

    const handleSearch = (e) => {
        const value = e.target.value;
        setData("search", value);

        get("/Frontoffice", {
            preserveState: true,
            replace: true,
            data: { search: value },
        });
    };

    const handleGuestSearch = (e) => {
        const value = e.target.value;
        setData("guestSearch", value);

        router.get("/Frontoffice", {
            guestSearch: value,
            tab: "guests",
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleAction = (url, id) => {
        setLoadingId(id);
        router.post(url, {}, {
            onFinish: () => setLoadingId(null),
        });
    };

    const handleView = (url, id) => {
        setLoadingId(id);
        router.get(url, {}, {
            onFinish: () => setLoadingId(null),
        });
    };

    const getStatusBadge = (status) => {
        const statusStyles = {
            confirmed: "bg-blue-100 text-blue-700 border-blue-200",
            "checked-in": "bg-green-100 text-green-700 border-green-200",
            "checked-out": "bg-slate-100 text-slate-700 border-slate-200",
            cancelled: "bg-red-100 text-red-700 border-red-200",
        };
        return statusStyles[status] || "bg-slate-100 text-slate-700";
    };

    const getPaymentBadge = (status) => {
        const styles = {
            pending: "bg-amber-100 text-amber-700 border-amber-200",
            partial: "bg-yellow-100 text-yellow-700 border-yellow-200",
            paid: "bg-green-100 text-green-700 border-green-200",
            refunded: "bg-red-100 text-red-700 border-red-200",
        };
        return styles[status] || "bg-slate-100 text-slate-700";
    };

    const getGuestStatusBadge = (status) => {
        const styles = {
            confirmed: "bg-blue-100 text-blue-700",
            "checked-in": "bg-green-100 text-green-700",
            "checked-out": "bg-slate-100 text-slate-700",
            cancelled: "bg-red-100 text-red-700",
        };
        return styles[status] || "bg-slate-100 text-slate-700";
    };

    return (
        <>
            <Head title="Front Office" />

            <Layout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-serif text-slate-900">
                                Front Office
                            </h2>
                            <p className="text-slate-600 mt-1">
                                Guest services and reservations management
                            </p>
                        </div>
                        <Link
                            href={"/Frontoffice/reservation/create"}
                            className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [a]:hover:bg-primary/80 h-8 gap-1.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white p-4 py-5"
                        >
                            <Plus className="size-4 mr-2" />
                            New Reservation
                        </Link>
                    </div>

                    <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                        <TabsList className="grid w-full grid-cols-4 lg:w-auto bg-stone-200 gap-5">
                            <TabsTrigger value="reservations" className="rounded-full">
                                Reservations
                            </TabsTrigger>
                            <TabsTrigger value="rooms" className="rounded-full">
                                Rooms
                            </TabsTrigger>
                            <TabsTrigger value="guests" className="rounded-full">
                                Guests
                            </TabsTrigger>
                            <TabsTrigger value="history" className="rounded-full">
                                History
                            </TabsTrigger>
                        </TabsList>

                        {/* Reservations */}
                        <TabsContent value="reservations" className="space-y-6 mt-6">
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-slate-900">
                                            All Reservations
                                        </CardTitle>
                                        <div className="relative w-64">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
                                            <Input
                                                placeholder="Search reservations..."
                                                className="pl-9"
                                                value={data.search}
                                                onChange={handleSearch}
                                            />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-slate-200">
                                                    <th className="text-left py-3 px-4 text-sm text-slate-600">Reference</th>
                                                    <th className="text-left py-3 px-4 text-sm text-slate-600">Guest</th>
                                                    <th className="text-left py-3 px-4 text-sm text-slate-600">Room</th>
                                                    <th className="text-left py-3 px-4 text-sm text-slate-600">Guests</th>
                                                    <th className="text-left py-3 px-4 text-sm text-slate-600">Check-in</th>
                                                    <th className="text-left py-3 px-4 text-sm text-slate-600">Check-out</th>
                                                    <th className="text-left py-3 px-4 text-sm text-slate-600">Payment</th>
                                                    <th className="text-left py-3 px-4 text-sm text-slate-600">Status</th>
                                                    <th className="text-left py-3 px-4 text-sm text-slate-600">Total</th>
                                                    <th className="text-left py-3 px-4 text-sm text-slate-600">Actions</th>
                                                </tr>
                                            </thead>

                                            {reservations.length > 0 ? (
                                                <tbody>
                                                    {reservations.map((reservation) => (
                                                        <tr key={reservation.id} className="border-b border-slate-100 hover:bg-slate-50">
                                                            <td className="py-3 px-4">
                                                                <span className="text-xs font-mono font-medium text-slate-700">{reservation.booking_reference || `#${reservation.id}`}</span>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <div className="font-medium text-slate-900">{reservation.guest.name}</div>
                                                                <div className="text-sm text-slate-500">{reservation.guest.email}</div>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <div className="font-medium text-slate-900">{reservation.room.number}</div>
                                                                <div className="text-sm text-slate-500 capitalize">{reservation.room.type}</div>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <span className="text-slate-700">{reservation.number_of_guests ?? 1}</span>
                                                            </td>
                                                            <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                                                                {new Date(reservation.check_in).toLocaleDateString()}
                                                            </td>
                                                            <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                                                                {new Date(reservation.check_out).toLocaleDateString()}
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <Badge className={getPaymentBadge(reservation.payment_status)}>
                                                                    {reservation.payment_status}
                                                                </Badge>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <Badge className={getStatusBadge(reservation.status)}>
                                                                    {reservation.status}
                                                                </Badge>
                                                            </td>
                                                            <td className="py-3 px-4 text-slate-700">
                                                                {reservation.total_price_rupiah}
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <div className="flex items-center gap-1">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        disabled={loadingId === reservation.id}
                                                                        onClick={() => handleView(`/Frontoffice/reservations/${reservation.booking_reference || reservation.id}/details`, reservation.id)}
                                                                    >
                                                                        {loadingId === reservation.id ? (
                                                                            <Loader2 className="size-3 animate-spin" />
                                                                        ) : (
                                                                            <Eye className="size-3" />
                                                                        )}
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        disabled={loadingId === reservation.id}
                                                                        onClick={() => handleView(`/Frontoffice/reservations/${reservation.id}/edit`, reservation.id)}
                                                                    >
                                                                        {loadingId === reservation.id ? (
                                                                            <Loader2 className="size-3 animate-spin" />
                                                                        ) : (
                                                                            <Pencil className="size-3" />
                                                                        )}
                                                                    </Button>
                                                                    {reservation.status === "confirmed" && (
                                                                        <>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="border-green-300 text-green-700 hover:bg-green-50"
                                                                                disabled={loadingId === reservation.id}
                                                                                onClick={() => handleAction(`/Frontoffice/reservations/${reservation.id}/checkin`, reservation.id)}
                                                                            >
                                                                                {loadingId === reservation.id ? (
                                                                                    <Loader2 className="size-3 animate-spin" />
                                                                                ) : (
                                                                                    <UserCheck className="size-3" />
                                                                                )}
                                                                            </Button>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="border-red-300 text-red-700 hover:bg-red-50"
                                                                                disabled={loadingId === reservation.id}
                                                                                onClick={() => handleAction(`/Frontoffice/reservations/${reservation.id}/cancel`, reservation.id)}
                                                                            >
                                                                                {loadingId === reservation.id ? (
                                                                                    <Loader2 className="size-3 animate-spin" />
                                                                                ) : (
                                                                                    <UserX className="size-3" />
                                                                                )}
                                                                            </Button>
                                                                        </>
                                                                    )}
                                                                    {reservation.status === "checked-in" && (
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="border-purple-300 text-purple-700 hover:bg-purple-50"
                                                                            disabled={loadingId === reservation.id}
                                                                            onClick={() => handleAction(`/Frontoffice/reservations/${reservation.id}/checkout`, reservation.id)}
                                                                        >
                                                                            {loadingId === reservation.id ? (
                                                                                <Loader2 className="size-3 animate-spin" />
                                                                            ) : (
                                                                                <LogOut className="size-3" />
                                                                            )}
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            ) : (
                                                <tbody>
                                                    <tr>
                                                        <td colSpan={9} className="text-slate-500 text-center py-3">
                                                            There are no reservations yet
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            )}
                                        </table>

                                        {reservations.some(r => r.special_requests) && (
                                            <div className="mt-4 text-xs text-slate-400">
                                                <details className="mt-2">
                                                    <summary className="cursor-pointer text-slate-500 hover:text-slate-700 font-medium">
                                                        Show special requests
                                                    </summary>
                                                    {reservations.filter(r => r.special_requests).map(r => (
                                                        <div key={r.id} className="mt-1 text-slate-600">
                                                            <span className="font-medium">{r.guest.name}</span>: {r.special_requests}
                                                        </div>
                                                    ))}
                                                </details>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Room */}
                        <TabsContent value="rooms" className="space-y-6 mt-6">
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-slate-900">
                                            Room Availability
                                        </CardTitle>
                                        <div>
                                            <Link
                                                href={`/Frontoffice/create/room`}
                                                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900"
                                            >
                                                <Plus className="size-4" />
                                                Add New Room
                                            </Link>
                                        </div>
                                    </div>
                                </CardHeader>

                                <Rooms rooms={rooms} archivedRooms={archivedRooms} />
                            </Card>
                        </TabsContent>

                        {/* Guest */}
                        <TabsContent value="guests" className="space-y-6 mt-6">
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-slate-900">
                                            Guest Directory
                                        </CardTitle>
                                        <div className="relative w-64">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
                                            <Input
                                                placeholder="Search guests..."
                                                className="pl-9"
                                                value={data.guestSearch}
                                                onChange={handleGuestSearch}
                                            />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {guests && guests.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {guests.map((reservation) => (
                                                <div
                                                    key={reservation.id}
                                                    className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <div className="text-lg font-semibold text-slate-900">
                                                                {reservation.guest?.name}
                                                            </div>
                                                            <div className="text-xs text-slate-400 font-mono">
                                                                {reservation.booking_reference || `#${reservation.id}`}
                                                            </div>
                                                            <div className="text-sm text-slate-500 mt-1">
                                                                Room {reservation.room?.number}
                                                            </div>
                                                        </div>
                                                        <Badge className={getGuestStatusBadge(reservation.status)}>
                                                            {reservation.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <Mail className="size-4" />
                                                            {reservation.guest?.email ?? "-"}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <Phone className="size-4" />
                                                            {reservation.guest?.phone}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <MapPin className="size-4" />
                                                            {reservation.guest?.nationality ?? "-"}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <Calendar className="size-4" />
                                                            {reservation.status === "checked-in" ? "Check-out" : reservation.status === "confirmed" ? "Check-in" : reservation.status === "checked-out" ? "Checked out" : "Cancelled"}:{" "}
                                                            {new Date(reservation.status === "checked-in" || reservation.status === "confirmed" ? reservation.check_out : reservation.check_in).toLocaleDateString()}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <Users className="size-4" />
                                                            {reservation.number_of_guests ?? 1} guest(s)
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-slate-500 py-8">
                                            No guests found
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsHistoryReservation
                            reservations={historyData.data}
                            stats={stats}
                            filters={filters}
                            availableYears={availableYears}
                            months={months}
                            pagination={historyData}
                        />
                    </Tabs>
                </div>
            </Layout>
        </>
    );
}
