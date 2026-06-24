import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    BedDouble,
    User,
    Wallet,
    PlusCircle,
    CheckCircle2,
    RefreshCcw,
} from "lucide-react";
import React from "react";

// Tambahkan prop isEdit
export default function ConfirmationReservation({
    form,
    back,
    submit,
    isEdit,
}) {
    const selectedRoom = form.data.selected_room;

    const calculateNights = () => {
        if (!form.data.check_in || !form.data.check_out) return 0;
        const start = new Date(form.data.check_in);
        const end = new Date(form.data.check_out);
        const nights = Math.ceil(
            (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
        );
        return nights > 0 ? nights : 0;
    };

    const nights = calculateNights();

    // Gunakan price dari data form atau selected room object
    const roomPrice = selectedRoom?.price || 0;
    const roomSubtotal = roomPrice * nights;

    const totalMiscPrice = form.data.miscellaneous.reduce((acc, curr) => {
        const qty = parseInt(curr.qty) || 1;
        const price = parseFloat(curr.price) || 0;
        return acc + price * qty;
    }, 0);

    const totalPrice = roomSubtotal + totalMiscPrice;

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader
                className={`border-b border-slate-50 ${isEdit ? "bg-blue-50/50" : "bg-slate-50/50"}`}
            >
                <CardTitle className="text-slate-900 flex items-center gap-2">
                    {isEdit ? (
                        <RefreshCcw className="size-5 text-blue-600" />
                    ) : (
                        <CheckCircle2 className="size-5 text-green-600" />
                    )}
                    {isEdit ? "Update Confirmation" : "Reservation Summary"}
                </CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                    {isEdit
                        ? "Review the changes before updating this reservation"
                        : "Please review all details before confirming the booking"}
                </p>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                {/* Bagian Guest & Stay Details (Tetap sama namun data dipastikan aman) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-900 mb-3 border-b pb-2">
                            <User className="size-4 text-amber-600" />
                            <span className="font-semibold">Guest Details</span>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Name:</span>
                                <span className="text-slate-900 font-medium">
                                    {form.data.name}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Email:</span>
                                <span className="text-slate-900 font-medium">
                                    {form.data.email || "-"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Phone:</span>
                                <span className="text-slate-900">
                                    {form.data.phone}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">
                                    Nationality:
                                </span>
                                <span className="text-slate-900 font-medium">
                                    {form.data.nationality || "-"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">ID:</span>
                                <span className="text-slate-900 uppercase font-mono text-xs">
                                    {form.data.id_type?.replace("_", " ")} -{" "}
                                    {form.data.id_number}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-900 mb-3 border-b pb-2">
                            <BedDouble className="size-4 text-amber-600" />
                            <span className="font-semibold">Stay Details</span>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Room:</span>
                                <span className="text-slate-900 font-medium">
                                    {selectedRoom?.number}{" "}
                                    <span className="capitalize">
                                        ({selectedRoom?.type})
                                    </span>
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">
                                    Check-in:
                                </span>
                                <span className="text-slate-900">
                                    {new Date(
                                        form.data.check_in,
                                    ).toLocaleDateString("id-ID")}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">
                                    Check-out:
                                </span>
                                <span className="text-slate-900">
                                    {new Date(
                                        form.data.check_out,
                                    ).toLocaleDateString("id-ID")}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Period:</span>
                                <span className="text-slate-900 font-medium">
                                    {nights} Night(s)
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Guests:</span>
                                <span className="text-slate-900">
                                    {form.data.number_of_guests}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Services (Miscellaneous) */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2 text-slate-900 mb-3">
                        <PlusCircle className="size-4 text-amber-600" />
                        <span className="font-semibold text-sm">
                            Additional Services
                        </span>
                    </div>

                    <div className="space-y-3">
                        {form.data.miscellaneous.some((m) => m.service) ? (
                            form.data.miscellaneous.map(
                                (misc, idx) =>
                                    misc.service && (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between bg-white p-2 rounded border border-slate-100 text-sm"
                                        >
                                            <span className="text-slate-700">
                                                {misc.service}{" "}
                                                <Badge
                                                    variant="outline"
                                                    className="ml-1 text-[10px]"
                                                >
                                                    x{misc.qty}
                                                </Badge>
                                            </span>
                                            <span className="font-mono text-xs">
                                                Rp{" "}
                                                {(
                                                    (parseFloat(misc.price) ||
                                                        0) *
                                                    (parseInt(misc.qty) || 1)
                                                ).toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                    ),
                            )
                        ) : (
                            <p className="text-xs text-slate-400 italic">
                                No additional services
                            </p>
                        )}
                    </div>
                </div>

                {/* Payment & Total Section */}
                <div
                    className={`p-4 rounded-lg border ${isEdit ? "bg-blue-50 border-blue-200" : "bg-amber-50 border-amber-200"}`}
                >
                    <div className="space-y-2 mb-4 border-b border-slate-200 pb-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">
                                Room Subtotal:
                            </span>
                            <span className="text-slate-900 font-mono">
                                Rp {roomSubtotal.toLocaleString("id-ID")}
                            </span>
                        </div>
                        {totalMiscPrice > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">
                                    Add-ons Subtotal:
                                </span>
                                <span className="text-slate-900 font-mono">
                                    + Rp{" "}
                                    {totalMiscPrice.toLocaleString("id-ID")}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <span className="text-lg font-bold text-slate-900 uppercase">
                            Grand Total
                        </span>
                        <span
                            className={`text-2xl font-bold font-mono ${isEdit ? "text-blue-700" : "text-amber-700"}`}
                        >
                            Rp {totalPrice.toLocaleString("id-ID")}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase text-slate-500">
                            Payment Method
                        </Label>
                        <Select
                            value={form.data.payment_method}
                            onValueChange={(val) =>
                                form.setData("payment_method", val)
                            }
                        >
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="transfer">
                                    Transfer
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between gap-3 pt-2">
                    <Button variant="outline" onClick={back}>
                        Back
                    </Button>
                    <Button
                        className={`px-10 shadow-md transition-all active:scale-95 ${
                            isEdit
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-green-600 hover:bg-green-700"
                        }`}
                        onClick={submit}
                        disabled={form.processing}
                    >
                        {form.processing
                            ? "Processing..."
                            : isEdit
                              ? "Update Reservation"
                              : "Confirm Reservation"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
