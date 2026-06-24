import Layout from "@/components/Layout/Layout";
import React, { useState } from "react";
import { ArrowLeft, User, CreditCard, BedDouble } from "lucide-react";
import { useForm, Head, Link } from "@inertiajs/react";
import GuestInformation from "@/components/FrontOffice/Reservation/GuestInformation";
import RoomDates from "@/components/FrontOffice/Reservation/RoomDates";
import ConfirmationReservation from "@/components/FrontOffice/Reservation/ConfirmationReservation";

export default function EditReservation({ availableRooms, reservation }) {
    const [step, setStep] = useState(1);

    const form = useForm({
        // Data Tamu (Guest)
        name: reservation.guest?.name || "",
        email: reservation.guest?.email || "",
        phone: reservation.guest?.phone || "",
        nationality: reservation.guest?.nationality || "",
        id_type: reservation.guest?.id_type || "passport",
        id_number: reservation.guest?.id_number || "",
        address: reservation.guest?.address || "",
        date_of_birth: reservation.guest?.date_of_birth || "",

        // Data Reservasi (Dates) - Sanitasi format YYYY-MM-DD
        check_in: reservation.check_in
            ? reservation.check_in.substring(0, 10)
            : "",
        check_out: reservation.check_out
            ? reservation.check_out.substring(0, 10)
            : "",

        // Kamar & Tamu
        number_of_guests: reservation.number_of_guests || 1,
        // Konversi ke string agar match dengan value pada mapping di RoomDates
        room_id: reservation.room_id ? String(reservation.room_id) : "",

        // Miscellaneous (Layanan Tambahan)
        miscellaneous:
            reservation.misc_details?.length > 0
                ? reservation.misc_details
                : [{ service: "", price: 0, qty: 1, isCustom: false }],

        special_requests: reservation.special_requests || "",
        payment_method: reservation.payment_method || "cash",

        // Simpan object room asli untuk kebutuhan preview di Step 3 jika diperlukan
        selected_room: reservation.room || null,
    });
    console.log(reservation.id);

    const handleSubmit = () => {
        // Mengirimkan update ke endpoint Laravel menggunakan method PUT
        form.put(`/Frontoffice/reservations/${reservation.id}`, {
            onSuccess: () => {
                // Opsional: tambahkan notifikasi sukses di sini
            },
        });
    };

    return (
        <>
            <Head title={`Edit Reservation - ${reservation.guest?.name}`} />

            <Layout>
                <div className="space-y-6">
                    {/* Header Section */}
                    <div className="flex items-center gap-4">
                        <Link
                            href={"/Frontoffice"}
                            className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border bg-background h-8 px-2.5 border-slate-300 hover:bg-muted"
                        >
                            <ArrowLeft className="size-4" />
                        </Link>
                        <div>
                            <h2 className="text-3xl font-serif text-slate-900">
                                Edit Reservation
                            </h2>
                            <p className="text-slate-600 mt-1">
                                Modifying reservation **#RES-{reservation.id}**
                                for {reservation.guest?.name}
                            </p>
                        </div>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center justify-center gap-4 py-4">
                        <StepItem
                            stepNumber={1}
                            currentStep={step}
                            label="Guest Info"
                            icon={<User className="size-4" />}
                        />
                        <StepDivider active={step >= 2} />
                        <StepItem
                            stepNumber={2}
                            currentStep={step}
                            label="Room & Dates"
                            icon={<BedDouble className="size-4" />}
                        />
                        <StepDivider active={step >= 3} />
                        <StepItem
                            stepNumber={3}
                            currentStep={step}
                            label="Confirmation"
                            icon={<CreditCard className="size-4" />}
                        />
                    </div>

                    {/* Multi-step Content */}
                    <div className="mt-8">
                        {step === 1 && (
                            <GuestInformation
                                click={() => setStep(2)}
                                form={form}
                                isEdit={true}
                            />
                        )}

                        {step === 2 && (
                            <RoomDates
                                availableRooms={availableRooms}
                                back={() => setStep(1)}
                                conti={() => setStep(3)}
                                form={form}
                                isEdit={true}
                                reservation={reservation} // Kirim data asli untuk pengecekan exclude_id
                            />
                        )}

                        {step === 3 && (
                            <ConfirmationReservation
                                availableRooms={availableRooms}
                                form={form}
                                back={() => setStep(2)}
                                submit={handleSubmit}
                                isEdit={true}
                            />
                        )}
                    </div>
                </div>
            </Layout>
        </>
    );
}

/**
 * Sub-komponen UI untuk Step Indicator agar kode utama lebih bersih
 */
function StepItem({ stepNumber, currentStep, label, icon }) {
    const isActive = currentStep >= stepNumber;
    return (
        <div
            className={`flex items-center gap-2 ${isActive ? "text-amber-600" : "text-slate-400"}`}
        >
            <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                    isActive
                        ? "border-amber-600 bg-amber-50"
                        : "border-slate-300 bg-white"
                }`}
            >
                {icon}
            </div>
            <span className="font-medium text-sm">{label}</span>
        </div>
    );
}

function StepDivider({ active }) {
    return (
        <div
            className={`h-0.5 w-12 sm:w-16 transition-colors ${active ? "bg-amber-600" : "bg-slate-300"}`}
        />
    );
}
