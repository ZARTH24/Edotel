import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useRef } from "react";

// Tambahkan isEdit dan reservation ke props
export default function RoomDates({
    availableRooms,
    back,
    conti,
    form,
    isEdit,
    reservation,
}) {
    const [availableRoomsState, setAvailableRoomsState] =
        React.useState(availableRooms);

    function isRoomAvailable(roomId, checkIn, checkOut) {
        // PENTING: Jika sedang edit dan kamar yang dipilih adalah kamar awal, anggap tersedia
        if (isEdit && String(roomId) === String(reservation?.room_id)) {
            return true;
        }

        if (!checkIn || !checkOut) return true;

        const selectedRoom = availableRoomsState.find(
            (r) => String(r.id) === String(roomId),
        );
        if (!selectedRoom) return false;

        return !selectedRoom.reservations?.some((r) => {
            // Abaikan pengecekan terhadap ID reservasi yang sedang kita edit sendiri
            if (isEdit && r.id === reservation.id) return false;

            const rCheckIn = new Date(r.check_in);
            const rCheckOut = new Date(r.check_out);
            const selCheckIn = new Date(checkIn);
            const selCheckOut = new Date(checkOut);

            return (
                (rCheckIn < selCheckOut && rCheckIn >= selCheckIn) ||
                (rCheckOut > selCheckIn && rCheckOut <= selCheckOut) ||
                (selCheckIn <= rCheckIn && selCheckOut >= rCheckOut)
            );
        });
    }

    const checkInRef = useRef(null);
    const checkOutRef = useRef(null);
    const guestsRef = useRef(null);
    const specialRef = useRef(null);

    useEffect(() => {
        if (form.errors.check_in) {
            checkInRef.current?.focus();
        } else if (form.errors.check_out) {
            checkOutRef.current?.focus();
        } else if (form.errors.number_of_guests) {
            guestsRef.current?.focus();
        } else if (form.errors.special_requests) {
            specialRef.current?.focus();
        }
    }, [form.errors]);

    const calculateNights = () => {
        if (!form.data.check_in || !form.data.check_out) return 0;
        const start = new Date(form.data.check_in);
        const end = new Date(form.data.check_out);
        const nights = Math.ceil(
            (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
        );
        return nights > 0 ? nights : 0;
    };

    useEffect(() => {
        if (!form.data.check_in || !form.data.check_out) return;

        // Tambahkan parameter exclude_reservation_id saat edit agar kamar sendiri muncul sebagai 'available'
        let url = `/Frontoffice/available-rooms?check_in=${form.data.check_in}&check_out=${form.data.check_out}`;
        if (isEdit && reservation?.id) {
            url += `&exclude_reservation_id=${reservation.id}`;
        }

        fetch(url)
            .then((res) => res.json())
            .then((data) => setAvailableRoomsState(data));
    }, [form.data.check_in, form.data.check_out]);

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle className="text-slate-900">
                    {isEdit
                        ? "Update Stay Details"
                        : "Room Selection & Stay Details"}
                </CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                    Choose room and specify check-in/out dates
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="check-in">
                            Check-in Date{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            ref={checkInRef}
                            id="check-in"
                            type="date"
                            // Jika edit, jangan batasi 'min' hari ini agar tanggal lama tidak hilang/error
                            min={
                                isEdit
                                    ? ""
                                    : new Date().toISOString().split("T")[0]
                            }
                            value={form.data.check_in}
                            onChange={(e) => {
                                form.setData("check_in", e.target.value);
                                form.clearErrors("check_in");
                            }}
                            className={
                                form.errors.check_in &&
                                "border-red-500 focus-visible:ring-red-500"
                            }
                        />
                        {form.errors.check_in && (
                            <p className="text-red-500 text-sm">
                                {form.errors.check_in}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="check-out">
                            Check-out Date{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            ref={checkOutRef}
                            id="check-out"
                            type="date"
                            min={
                                form.data.check_in ||
                                (isEdit
                                    ? ""
                                    : new Date().toISOString().split("T")[0])
                            }
                            value={form.data.check_out}
                            onChange={(e) => {
                                form.setData("check_out", e.target.value);
                                form.clearErrors("check_out");
                            }}
                            className={
                                form.errors.check_out &&
                                "border-red-500 focus-visible:ring-red-500"
                            }
                        />
                        {form.errors.check_out && (
                            <p className="text-red-500 text-sm">
                                {form.errors.check_out}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="num-guests">Number of Guests</Label>
                        <Input
                            ref={guestsRef}
                            id="num-guests"
                            type="number"
                            value={form.data.number_of_guests}
                            onChange={(e) => {
                                form.setData(
                                    "number_of_guests",
                                    e.target.value,
                                );
                                form.clearErrors("number_of_guests");
                            }}
                            className={
                                form.errors.number_of_guests &&
                                "border-red-500 focus-visible:ring-red-500"
                            }
                        />
                        {form.errors.number_of_guests && (
                            <p className="text-red-500 text-sm">
                                {form.errors.number_of_guests}
                            </p>
                        )}
                    </div>
                </div>
                {calculateNights() > 0 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">
                            <Calendar className="size-4 inline mr-1" />
                            Total stay:{" "}
                            <strong>
                                {calculateNights()} night
                                {calculateNights() !== 1 ? "s" : ""}
                            </strong>
                        </p>
                    </div>
                )}
                <div className="space-y-3">
                    <Label>
                        Select Room <span className="text-red-500">*</span>
                    </Label>
                    {availableRoomsState.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {availableRoomsState.map((room) => (
                                <div
                                    key={room.id}
                                    onClick={() => {
                                        form.setData("room_id", room.id);
                                        form.setData("selected_room", room);
                                    }}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        String(form.data.room_id) ===
                                        String(room.id)
                                            ? "border-amber-500 bg-amber-50"
                                            : "border-slate-200 hover:border-amber-300"
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-lg font-semibold text-slate-900">
                                            Room {room.number}
                                        </div>
                                        <Badge className="bg-green-100 text-green-700 border-green-200">
                                            available
                                        </Badge>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">
                                                Type:
                                            </span>
                                            <span className="capitalize font-medium">
                                                {room.type}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-600">
                                                Floor:
                                            </span>
                                            <span className="text-slate-900">
                                                {room.floor}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-600">
                                                Price:
                                            </span>
                                            <span className="text-amber-600 font-semibold">
                                                {room.price_rupiah}/night
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-slate-200">
                                        <div className="text-xs text-slate-500 mb-1">
                                            Features:
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {room.features
                                                .slice(0, 3)
                                                .map((feature, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700"
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                            {room.features.length > 3 && (
                                                <span className="text-xs text-slate-500">
                                                    +{room.features.length - 3}{" "}
                                                    more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-slate-500 py-8 italic">
                            No rooms available for selected dates
                        </p>
                    )}
                </div>

                {/* Bagian Miscellaneous & Special Requests (Sama seperti sebelumnya) */}
                {/* Bagian Miscellaneous & Special Requests */}
                <div className="space-y-4 pt-6 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Badge
                                variant="outline"
                                className="bg-amber-50 text-amber-700 border-amber-200 uppercase tracking-wider text-[10px]"
                            >
                                Optional
                            </Badge>
                            <Label className="text-base font-semibold text-slate-800">
                                Additional Services (Miscellaneous)
                            </Label>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                form.setData("miscellaneous", [
                                    ...form.data.miscellaneous,
                                    {
                                        service: "",
                                        price: 0,
                                        qty: 1,
                                        isCustom: false,
                                    },
                                ]);
                            }}
                            className="border-amber-300 text-amber-700 hover:bg-amber-50"
                        >
                            <Plus className="size-4 mr-1" />
                            Add Service
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {form.data.miscellaneous.map((item, index) => {
                            const isServiceSelected = item.service !== "";
                            const rowSubtotal =
                                (parseFloat(item.price) || 0) *
                                (parseInt(item.qty) || 1);

                            // Helper error
                            const serviceErr =
                                form.errors[`miscellaneous.${index}.service`];
                            const qtyErr =
                                form.errors[`miscellaneous.${index}.qty`];
                            const priceErr =
                                form.errors[`miscellaneous.${index}.price`];

                            return (
                                <div
                                    key={index}
                                    className="p-3 border border-slate-100 rounded-lg bg-slate-50/50"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                                        {/* 1. Nama Layanan */}
                                        <div
                                            className={
                                                isServiceSelected
                                                    ? "md:col-span-5"
                                                    : "md:col-span-11"
                                            }
                                        >
                                            {item.isCustom ? (
                                                <div className="relative flex items-center">
                                                    <Input
                                                        placeholder="Type custom service name..."
                                                        className={`bg-white border-amber-300 focus-visible:ring-amber-500 pr-10 ${serviceErr ? "border-red-500" : ""}`}
                                                        value={item.service}
                                                        autoFocus
                                                        onChange={(e) => {
                                                            const newMisc = [
                                                                ...form.data
                                                                    .miscellaneous,
                                                            ];
                                                            newMisc[
                                                                index
                                                            ].service =
                                                                e.target.value;
                                                            form.setData(
                                                                "miscellaneous",
                                                                newMisc,
                                                            );
                                                            // Menghilangkan error saat mulai input
                                                            form.clearErrors(
                                                                `miscellaneous.${index}.service`,
                                                            );
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newMisc = [
                                                                ...form.data
                                                                    .miscellaneous,
                                                            ];
                                                            newMisc[
                                                                index
                                                            ].isCustom = false;
                                                            newMisc[
                                                                index
                                                            ].service = "";
                                                            form.setData(
                                                                "miscellaneous",
                                                                newMisc,
                                                            );
                                                        }}
                                                        className="absolute right-2 text-slate-400 hover:text-slate-600"
                                                    >
                                                        <span className="text-[10px]">
                                                            Back
                                                        </span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <Select
                                                    value={item.service}
                                                    onValueChange={(val) => {
                                                        const newMisc = [
                                                            ...form.data
                                                                .miscellaneous,
                                                        ];
                                                        if (val === "Other") {
                                                            newMisc[
                                                                index
                                                            ].isCustom = true;
                                                            newMisc[
                                                                index
                                                            ].service = "";
                                                        } else {
                                                            newMisc[
                                                                index
                                                            ].service = val;
                                                        }
                                                        form.setData(
                                                            "miscellaneous",
                                                            newMisc,
                                                        );
                                                        form.clearErrors(
                                                            `miscellaneous.${index}.service`,
                                                        );
                                                    }}
                                                >
                                                    <SelectTrigger
                                                        className={`bg-white border-slate-200 ${serviceErr ? "border-red-500" : ""}`}
                                                    >
                                                        <SelectValue placeholder="Select Service" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Extra Bed">
                                                            Extra Bed
                                                        </SelectItem>
                                                        <SelectItem value="Breakfast">
                                                            Additional Breakfast
                                                        </SelectItem>
                                                        <SelectItem value="Other">
                                                            Other / Custom
                                                            Request...
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                            {serviceErr && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {serviceErr}
                                                </p>
                                            )}
                                        </div>

                                        {/* 2 & 3. Quantity & Price */}
                                        {isServiceSelected && (
                                            <>
                                                <div className="md:col-span-2">
                                                    <Input
                                                        type="number"
                                                        className={
                                                            qtyErr
                                                                ? "border-red-500"
                                                                : ""
                                                        }
                                                        value={item.qty}
                                                        onChange={(e) => {
                                                            const newMisc = [
                                                                ...form.data
                                                                    .miscellaneous,
                                                            ];
                                                            newMisc[index].qty =
                                                                e.target.value;
                                                            form.setData(
                                                                "miscellaneous",
                                                                newMisc,
                                                            );
                                                            form.clearErrors(
                                                                `miscellaneous.${index}.qty`,
                                                            );
                                                        }}
                                                        placeholder="Quantity"
                                                    />
                                                    {qtyErr && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {qtyErr}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="md:col-span-4 relative">
                                                    <span className="absolute left-3 top-2.5 text-xs text-slate-400">
                                                        Rp
                                                    </span>
                                                    <Input
                                                        type="text"
                                                        className={`pl-9 ${priceErr ? "border-red-500" : ""}`}
                                                        value={item.price}
                                                        onChange={(e) => {
                                                            const newMisc = [
                                                                ...form.data
                                                                    .miscellaneous,
                                                            ];
                                                            newMisc[
                                                                index
                                                            ].price =
                                                                e.target.value;
                                                            form.setData(
                                                                "miscellaneous",
                                                                newMisc,
                                                            );
                                                            form.clearErrors(
                                                                `miscellaneous.${index}.price`,
                                                            );
                                                        }}
                                                    />
                                                    {priceErr && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {priceErr}
                                                        </p>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {/* 4. Delete */}
                                        <div className="md:col-span-1 flex justify-end">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    const newMisc =
                                                        form.data.miscellaneous.filter(
                                                            (_, i) =>
                                                                i !== index,
                                                        );
                                                    form.setData(
                                                        "miscellaneous",
                                                        newMisc,
                                                    );
                                                }}
                                            >
                                                <Trash2 className="size-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>

                                    {isServiceSelected && (
                                        <div className="mt-2 text-right">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                                                Line Subtotal: Rp{" "}
                                                {rowSubtotal.toLocaleString(
                                                    "id-ID",
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-between gap-3 pt-6 border-t">
                    <Button variant="outline" onClick={back}>
                        Back
                    </Button>
                    <Button
                        onClick={() => {
                            // Kirim flag is_edit agar backend membolehkan tanggal masa lalu
                            form.transform((data) => ({
                                ...data,
                                is_edit: isEdit,
                            }));

                            // 2. Jalankan request post
                            form.post("/Frontoffice/validate-room", {
                                onSuccess: () => conti(),
                                onError: (errors) => console.error(errors),
                            });
                        }}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-8"
                        disabled={
                            !form.data.room_id ||
                            !form.data.check_in ||
                            !form.data.check_out ||
                            calculateNights() <= 0 ||
                            !isRoomAvailable(
                                form.data.room_id,
                                form.data.check_in,
                                form.data.check_out,
                            )
                        }
                    >
                        Continue to Payment
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
