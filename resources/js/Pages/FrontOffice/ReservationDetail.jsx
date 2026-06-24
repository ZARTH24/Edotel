import { useState } from "react";
import Layout from "@/components/Layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    LogIn,
    LogOut,
    XCircle,
    Printer,
    Loader2,
} from "lucide-react";
import { Head, Link, router } from "@inertiajs/react";

export default function ReservationDetail({ reservation, manager }) {
    const [loading, setLoading] = useState(null);

    const handleAction = (url, action) => {
        setLoading(action);
        router.post(
            url,
            {},
            {
                onFinish: () => setLoading(null),
            },
        );
    };

    const handlePrint = () => {
        window.print();
    };

    const actualCheckIn = reservation.checked_in_at
        ? new Date(reservation.checked_in_at)
        : new Date(reservation.check_in);
    const actualCheckOut = reservation.checked_out_at
        ? new Date(reservation.checked_out_at)
        : new Date(reservation.check_out);

    const diffInMs = actualCheckOut - actualCheckIn;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const reservationNights = Math.max(1, Math.ceil(diffInHours / 24));

    const roomSubtotal = reservationNights * reservation.room.price;
    const miscDetails = reservation.misc_details || [];
    const totalMiscPrice = miscDetails.reduce((acc, curr) => {
        const qty = parseInt(curr.qty) || 1;
        const price = parseFloat(curr.price) || 0;
        return acc + price * qty;
    }, 0);

    const getStatusBadge = (status) => {
        const statusStyles = {
            confirmed: "bg-blue-100 text-blue-700 border-blue-200",
            "checked-in": "bg-green-100 text-green-700 border-green-200",
            "checked-out": "bg-slate-100 text-slate-700 border-slate-200",
            cancelled: "bg-red-100 text-red-700 border-red-200",
        };
        return statusStyles[status] || "bg-slate-100";
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

    return (
        <>
            <Head title={`Invoice-${reservation.guest.name}`} />

            <Layout>
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
                    .cancelled-stamp {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) rotate(-15deg);
                        border: 8px double #ef4444;
                        color: #ef4444;
                        font-size: 5rem;
                        font-weight: 900;
                        text-transform: uppercase;
                        padding: 10px 30px;
                        opacity: 0.2;
                        letter-spacing: 10px;
                        border-radius: 10px;
                        pointer-events: none;
                        z-index: 50;
                        user-select: none;
                    }

                    @media print {
                        .cancelled-stamp {
                            -webkit-print-color-adjust: exact;
                            opacity: 0.15;
                        }
                        body * { visibility: hidden; }
                        #printable-report, #printable-report * { visibility: visible; }
                        #printable-report {
                            position: absolute; left: 0; top: 0; width: 100%;
                            border: none !important; box-shadow: none !important;
                            margin: 0; padding: 10px !important;
                        }
                        #printable-report .p-10 { padding: 12px 16px !important; }
                        #printable-report .space-y-10 > * + * { margin-top: 0.5rem !important; }
                        #printable-report .gap-8 { gap: 0.75rem !important; }
                        #printable-report .gap-10 { gap: 0.5rem !important; }
                        #printable-report .pt-16 { padding-top: 1rem !important; }
                        #printable-report .pb-10 { padding-bottom: 0.5rem !important; }
                        #printable-report .text-lg { font-size: 0.85rem !important; }
                        #printable-report .text-2xl { font-size: 1rem !important; }
                        #printable-report img { max-width: 80px !important; }
                        #printable-report .border-b-4 { border-bottom-width: 2px !important; }
                        #printable-report .py-4 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
                        #printable-report .py-3 { padding-top: 0.2rem !important; padding-bottom: 0.2rem !important; }
                        #printable-report .space-y-16 > * + * { margin-top: 2rem !important; }
                        @page { margin: 0; size: auto; }
                        .no-print { display: none !important; }
                    }
                `,
                    }}
                />

                <div className="space-y-6 max-w-4xl mx-auto pb-10">
                    <div className="flex flex-col md:flex-row justify-between items-center no-print bg-white p-4 rounded-lg border border-slate-200 shadow-sm gap-4">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/Frontoffice"
                                className="flex items-center text-sm text-slate-600 hover:text-slate-900"
                            >
                                <ArrowLeft className="size-4 mr-2" /> Back
                            </Link>
                            <Badge
                                className={`${getStatusBadge(reservation.status)} text-xs uppercase px-3 py-1`}
                            >
                                {reservation.status}
                            </Badge>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {reservation.status === "confirmed" && (
                                <>
                                    <Button
                                        className="bg-green-600 hover:bg-green-700"
                                        disabled={loading !== null}
                                        onClick={() =>
                                            handleAction(
                                                `/Frontoffice/reservations/${reservation.id}/checkin`,
                                                "checkin",
                                            )
                                        }
                                    >
                                        {loading === "checkin" ? (
                                            <Loader2 className="size-4 mr-2 animate-spin" />
                                        ) : (
                                            <LogIn className="size-4 mr-2" />
                                        )}
                                        Check-in
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        disabled={loading !== null}
                                        onClick={() =>
                                            handleAction(
                                                `/Frontoffice/reservations/${reservation.id}/cancel`,
                                                "cancel",
                                            )
                                        }
                                    >
                                        {loading === "cancel" ? (
                                            <Loader2 className="size-4 mr-2 animate-spin" />
                                        ) : (
                                            <XCircle className="size-4 mr-2" />
                                        )}
                                        Cancel
                                    </Button>
                                </>
                            )}

                            {reservation.status === "checked-in" && (
                                <Button
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={loading !== null}
                                    onClick={() =>
                                        handleAction(
                                            `/Frontoffice/reservations/${reservation.id}/checkout`,
                                            "checkout",
                                        )
                                    }
                                >
                                    {loading === "checkout" ? (
                                        <Loader2 className="size-4 mr-2 animate-spin" />
                                    ) : (
                                        <LogOut className="size-4 mr-2" />
                                    )}
                                    Check-out
                                </Button>
                            )}

                            {reservation.status === "checked-out" && (
                                <Button
                                    variant="outline"
                                    onClick={handlePrint}
                                    className="border-slate-300 shadow-sm"
                                >
                                    <Printer className="size-4 mr-2" /> Download
                                    PDF / Invoice
                                </Button>
                            )}
                        </div>
                    </div>

                    <div
                        id="printable-report"
                        className="bg-white border border-slate-200 shadow-lg rounded-xl overflow-hidden relative"
                    >
                        {reservation.status === "cancelled" && (
                            <div className="cancelled-stamp">CANCELLED</div>
                        )}

                        <div className="p-10 border-b-4 border-slate-900 flex justify-between items-center bg-slate-50">
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-3 rounded-lg">
                                    <img
                                        src="/assets/image/logo.png"
                                        alt="EDOTEL SMKN 2 Gorontalo"
                                        className="w-80 md:w-20 lg:w-40 object-contain"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm text-amber-600 font-semibold tracking-[0.2em] uppercase">
                                        SMKN 2 Gorontalo
                                    </p>
                                </div>
                            </div>
                            <div className="text-right text-sm text-slate-500">
                                <p>
                                    Jl. Diponegoro, Kel. Limba U2. Kota
                                    Gorontalo
                                </p>
                                <p>Phone: (+62) 8981119988</p>
                                <p>www.edotelsmkn2gorontalo.com</p>
                            </div>
                        </div>

                        <div className="p-10 space-y-10">
                            {/* Booking Reference */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-xs text-slate-400 uppercase tracking-wider">
                                        Booking Reference
                                    </span>
                                    <p className="text-lg font-bold text-slate-900">
                                        {reservation.booking_reference ||
                                            `#${reservation.id}`}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider">
                                        Created At
                                    </span>
                                    <p className="text-sm font-medium text-slate-700">
                                        {new Date(
                                            reservation.created_at,
                                        ).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Guest & Stay Info */}
                            <div className="grid grid-cols-2 gap-8 text-sm">
                                <div className="space-y-4">
                                    <h3 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] border-b pb-1">
                                        Guest Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                        <span className="text-slate-500">
                                            Name
                                        </span>
                                        <span className="font-semibold text-slate-900 capitalize">
                                            : {reservation.guest.name}
                                        </span>
                                        <span className="text-slate-500">
                                            ID Type
                                        </span>
                                        <span className="text-slate-700">
                                            : {reservation.guest.id_type ?? "-"}
                                        </span>
                                        <span className="text-slate-500">
                                            ID Number
                                        </span>
                                        <span className="text-slate-700">
                                            : {reservation.guest.id_number}
                                        </span>
                                        <span className="text-slate-500">
                                            Date of Birth
                                        </span>
                                        <span className="text-slate-700">
                                            :{" "}
                                            {reservation.guest.date_of_birth
                                                ? new Date(
                                                      reservation.guest
                                                          .date_of_birth,
                                                  ).toLocaleDateString("id-ID")
                                                : "-"}
                                        </span>
                                        <span className="text-slate-500">
                                            Nationality
                                        </span>
                                        <span className="text-slate-700">
                                            :{" "}
                                            {reservation.guest.nationality ??
                                                "-"}
                                        </span>
                                        <span className="text-slate-500">
                                            Contact
                                        </span>
                                        <span className="text-slate-700">
                                            : {reservation.guest.phone}
                                        </span>
                                        <span className="text-slate-500">
                                            Email
                                        </span>
                                        <span className="text-slate-700">
                                            : {reservation.guest.email ?? "-"}
                                        </span>
                                        <span className="text-slate-500">
                                            Address
                                        </span>
                                        <span className="text-slate-700">
                                            : {reservation.guest.address ?? "-"}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] border-b pb-1">
                                        Stay Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                        <span className="text-slate-500">
                                            Room
                                        </span>
                                        <span className="font-semibold text-slate-900">
                                            : {reservation.room.number} (
                                            {reservation.room.type})
                                        </span>
                                        <span className="text-slate-500">
                                            Floor
                                        </span>
                                        <span className="text-slate-700">
                                            : {reservation.room.floor}
                                        </span>
                                        <span className="text-slate-500">
                                            Check-in
                                        </span>
                                        <span className="text-slate-700">
                                            :{" "}
                                            {new Date(
                                                reservation.check_in,
                                            ).toLocaleDateString("id-ID")}
                                        </span>
                                        <span className="text-slate-500">
                                            Check-out
                                        </span>
                                        <span className="text-slate-700">
                                            :{" "}
                                            {new Date(
                                                reservation.check_out,
                                            ).toLocaleDateString("id-ID")}
                                        </span>
                                        <span className="text-slate-500">
                                            Guests
                                        </span>
                                        <span className="text-slate-700">
                                            :{" "}
                                            {reservation.number_of_guests ?? 1}
                                        </span>
                                        <span className="text-slate-500">
                                            Payment
                                        </span>
                                        <span className="text-slate-700">
                                            <Badge
                                                className={getPaymentBadge(
                                                    reservation.payment_status,
                                                )}
                                            >
                                                {reservation.payment_status}
                                            </Badge>
                                        </span>
                                        {reservation.checked_in_at && (
                                            <>
                                                <span className="text-slate-500">
                                                    Checked-in at
                                                </span>
                                                <span className="text-slate-700">
                                                    :{" "}
                                                    {new Date(
                                                        reservation.checked_in_at,
                                                    ).toLocaleString("id-ID")}
                                                </span>
                                            </>
                                        )}
                                        {reservation.checked_out_at && (
                                            <>
                                                <span className="text-slate-500">
                                                    Checked-out at
                                                </span>
                                                <span className="text-slate-700">
                                                    :{" "}
                                                    {new Date(
                                                        reservation.checked_out_at,
                                                    ).toLocaleString("id-ID")}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {reservation.special_requests && (
                                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                            <p className="text-xs text-amber-700 font-semibold uppercase tracking-wider mb-1">
                                                Special Requests
                                            </p>
                                            <p className="text-sm text-amber-900">
                                                {reservation.special_requests}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {reservation.room.features?.length > 0 && (
                                <div className="text-sm">
                                    <h3 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] border-b pb-1 mb-3">
                                        Room Features
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {reservation.room.features.map(
                                            (feature, i) => (
                                                <span
                                                    key={i}
                                                    className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700"
                                                >
                                                    {feature}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Billing Table */}
                            <div className="mt-6">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b-2 border-slate-200 text-slate-500">
                                            <th className="py-3 text-left">
                                                Description
                                            </th>
                                            <th className="py-3 text-center">
                                                Unit / Nights
                                            </th>
                                            <th className="py-3 text-right">
                                                Price
                                            </th>
                                            <th className="py-3 text-right">
                                                Amount
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr className="text-slate-700">
                                            <td className="py-4 font-medium">
                                                Room Charge:{" "}
                                                {reservation.room.type}
                                            </td>
                                            <td className="py-4 text-center">
                                                {reservationNights}
                                            </td>
                                            <td className="py-4 text-right">
                                                {reservation.room.price_rupiah}
                                            </td>
                                            <td className="py-4 text-right font-medium">
                                                Rp{" "}
                                                {roomSubtotal.toLocaleString(
                                                    "id-ID",
                                                )}
                                            </td>
                                        </tr>
                                        {miscDetails.map((item, idx) => {
                                            const itemQty =
                                                parseInt(item.qty) || 1;
                                            const itemPrice =
                                                parseFloat(item.price) || 0;
                                            const itemAmount =
                                                itemPrice * itemQty;

                                            return (
                                                <tr
                                                    key={idx}
                                                    className="text-slate-600"
                                                >
                                                    <td className="py-4 pl-2 capitalize">
                                                        Additional Service:{" "}
                                                        {item.service}
                                                    </td>
                                                    <td className="py-4 text-center">
                                                        {itemQty}
                                                    </td>
                                                    <td className="py-4 text-right">
                                                        Rp{" "}
                                                        {itemPrice.toLocaleString(
                                                            "id-ID",
                                                        )}
                                                    </td>
                                                    <td className="py-4 text-right font-medium">
                                                        Rp{" "}
                                                        {itemAmount.toLocaleString(
                                                            "id-ID",
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Total */}
                            <div className="flex justify-end pt-6">
                                <div className="w-full md:w-1/2 space-y-3">
                                    <div className="flex justify-between text-sm text-slate-500">
                                        <span>Subtotal</span>
                                        <span>
                                            Rp{" "}
                                            {(
                                                roomSubtotal + totalMiscPrice
                                            ).toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t-2 border-slate-900">
                                        <span className="text-lg font-bold text-slate-900">
                                            GRAND TOTAL
                                        </span>
                                        <span className="text-2xl font-bold text-slate-900">
                                            Rp{" "}
                                            {(
                                                roomSubtotal + totalMiscPrice
                                            ).toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-right text-slate-400 italic mt-2">
                                        Payment:{" "}
                                        {reservation.payment_method?.toUpperCase()}{" "}
                                        &mdash;{" "}
                                        {reservation.payment_status?.toUpperCase()}
                                    </p>
                                </div>
                            </div>

                            {/* Signatures */}
                            <div className="grid grid-cols-2 gap-10 pt-16 pb-10 text-center text-sm">
                                <div className="space-y-16">
                                    <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">
                                        Guest Signature
                                    </p>
                                    <div className="border-t border-slate-300 w-48 mx-auto">
                                        <p className="text-slate-900 font-medium capitalize">
                                            {reservation.guest.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-16">
                                    <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">
                                        Manager Hotel
                                    </p>
                                    <div className="border-t border-slate-300 w-48 mx-auto">
                                        <p className="text-slate-900 font-medium capitalize">
                                            {manager?.name ?? "Administrator"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 p-4 text-center text-white text-[10px] uppercase tracking-[0.3em]">
                            Thank You For Staying With Us
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
