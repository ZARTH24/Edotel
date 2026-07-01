import React from "react";
import { usePage } from "@inertiajs/react";
import { AlertTriangle, Play, CheckCircle, Clock, Users, Wrench } from "lucide-react";

export default function SimulationBanner({ summary }) {
    const { auth } = usePage().props;

    // Only show simulation banner for admin role
    const isAdmin = auth?.user?.role === "admin";
    const isFrontOffice = auth?.user?.role === "front-office";
    const isHousekeeping = auth?.user?.role === "housekeeping";
    const isSiswa = auth?.user?.role === "siswa";

    // Hide banner for non-admin roles
    if (!summary || !isAdmin) return null;

    const {
        total_reservations = 0,
        total_checkins = 0,
        total_checkouts = 0,
        total_cleaning_tasks = 0,
        total_damage_reports = 0,
    } = summary;

    const totalSimulations = total_reservations + total_checkins + total_checkouts + total_cleaning_tasks + total_damage_reports;

    if (totalSimulations === 0) {
        return (
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <Play className="size-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">
                                    🎮 SIMULATION MODE AKTIF
                                </p>
                                <p className="text-xs text-amber-100">
                                    Semua aktivitas disimpan sementara. Data akan dihapus saat logout.
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-6 text-xs">
                            <div className="flex items-center gap-1">
                                <Users className="size-3" />
                                <span>Reservasi: 0</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <CheckCircle className="size-3" />
                                <span>Check-in: 0</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="size-3" />
                                <span>Check-out: 0</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Wrench className="size-3" />
                                <span>Cleaning: 0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Play className="size-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">
                                🎮 SIMULATION MODE - {totalSimulations} Aktivitas DISIMULASIKAN
                            </p>
                            <p className="text-xs text-amber-100">
                                Data simulation hanya untuk latihan. Tidak mengubah database utama.
                            </p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-xs">
                        <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded">
                            <Users className="size-3" />
                            <span>Reservasi: {total_reservations}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded">
                            <CheckCircle className="size-3" />
                            <span>Check-in: {total_checkins}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded">
                            <Clock className="size-3" />
                            <span>Check-out: {total_checkouts}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded">
                            <Wrench className="size-3" />
                            <span>Cleaning: {total_cleaning_tasks}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
