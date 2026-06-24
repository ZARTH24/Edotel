import Layout from "@/components/Layout/Layout";
import { useState } from "react";
import { ArrowLeft, User, CreditCard, BedDouble } from "lucide-react";
import GuestInformation from "@/components/FrontOffice/Reservation/GuestInformation";
import RoomDates from "@/components/FrontOffice/Reservation/RoomDates";
import ConfirmationReservation from "@/components/FrontOffice/Reservation/ConfirmationReservation";
import { Head, useForm, Link } from "@inertiajs/react";

export default function Reservation({ availableRooms }) {
    const [step, setStep] = useState(1);

    const form = useForm({
        name: "",
        email: "",
        phone: "",
        nationality: "",
        id_type: "passport",
        id_number: "",
        address: "",
        date_of_birth: "",
        check_in: "",
        check_out: "",
        number_of_guests: 1,
        room_id: "",
        miscellaneous: [{ service: "", price: "", qty: "", isCustom: false }],
        special_requests: "",
        payment_method: "cash",
    });

    const handleSubmit = () => {
        form.post("/Frontoffice/reservation");
    };

    return (
        <>
            <Head title="Reservation" />

            <Layout>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href={"/Frontoffice"}
                            variant="outline"
                            className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 border-slate-300"
                        >
                            <ArrowLeft className="size-4" />
                        </Link>
                        <div>
                            <h2 className="text-3xl font-serif text-slate-900">
                                New Reservation
                            </h2>
                            <p className="text-slate-600 mt-1">
                                Create a new guest reservation
                            </p>
                        </div>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center justify-center gap-4">
                        <div
                            className={`flex items-center gap-2 ${step >= 1 ? "text-amber-600" : "text-slate-400"}`}
                        >
                            <div
                                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${step >= 1 ? "border-amber-600 bg-amber-50" : "border-slate-300"}`}
                            >
                                <User className="size-4" />
                            </div>
                            <span className="font-medium">Guest Info</span>
                        </div>
                        <div
                            className={`h-0.5 w-16 ${step >= 2 ? "bg-amber-600" : "bg-slate-300"}`}
                        />
                        <div
                            className={`flex items-center gap-2 ${step >= 2 ? "text-amber-600" : "text-slate-400"}`}
                        >
                            <div
                                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${step >= 2 ? "border-amber-600 bg-amber-50" : "border-slate-300"}`}
                            >
                                <BedDouble className="size-4" />
                            </div>
                            <span className="font-medium">Room & Dates</span>
                        </div>
                        <div
                            className={`h-0.5 w-16 ${step >= 3 ? "bg-amber-600" : "bg-slate-300"}`}
                        />
                        <div
                            className={`flex items-center gap-2 ${step >= 3 ? "text-amber-600" : "text-slate-400"}`}
                        >
                            <div
                                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${step >= 3 ? "border-amber-600 bg-amber-50" : "border-slate-300"}`}
                            >
                                <CreditCard className="size-4" />
                            </div>
                            <span className="font-medium">Confirmation</span>
                        </div>
                    </div>

                    {/* Step 1: Guest Information */}
                    {step === 1 && (
                        <GuestInformation
                            click={() => setStep(2)}
                            form={form}
                        />
                    )}

                    {/* Step 2: Room & Dates */}
                    {step === 2 && (
                        <RoomDates
                            availableRooms={availableRooms}
                            back={() => setStep(1)}
                            conti={() => setStep(3)}
                            form={form}
                        />
                    )}

                    {/* Step 3: Confirmation */}
                    {step === 3 && (
                        <ConfirmationReservation
                            availableRooms={availableRooms}
                            form={form}
                            back={() => setStep(2)}
                            submit={handleSubmit}
                        />
                    )}
                </div>
            </Layout>
        </>
    );
}
