import Layout from "@/components/Layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, CheckCircle2, AlertTriangle } from "lucide-react";
import { Head, Link } from "@inertiajs/react";

export default function Detail({ maintenance, manager }) {
    const handlePrint = () => {
        window.print();
    };

    const getStatusBadge = (status) => {
        const statusStyles = {
            pending: "bg-amber-100 text-amber-700 border-amber-200",
            "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
            completed: "bg-green-100 text-green-700 border-green-200",
            cancelled: "bg-red-100 text-red-700 border-red-200",
        };
        return statusStyles[status] || "bg-slate-100";
    };

    return (
        <>
            <Head title={`Maintenance-Report-${maintenance.id}`} />

            <Layout>
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
                    @media print {
                        body * { visibility: hidden; }
                        #printable-report, #printable-report * { visibility: visible; }
                        #printable-report {
                            position: absolute; left: 0; top: 0; width: 100%;
                            border: none !important; box-shadow: none !important;
                            margin: 0; padding: 20px;
                        }
                        .no-print { display: none !important; }
                    }
                `,
                    }}
                />

                <div className="space-y-6 max-w-4xl mx-auto pb-10">
                    {/* Action Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center no-print bg-white p-4 rounded-lg border border-slate-200 shadow-sm gap-4">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/Damagereport"
                                className="flex items-center text-sm text-slate-600 hover:text-slate-900"
                            >
                                <ArrowLeft className="size-4 mr-2" /> Back
                            </Link>
                            <Badge
                                className={`${getStatusBadge(maintenance.status)} uppercase px-3 py-1`}
                            >
                                {maintenance.status}
                            </Badge>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handlePrint}
                                className="border-slate-300"
                            >
                                <Printer className="size-4 mr-2" /> Print Report
                            </Button>
                        </div>
                    </div>

                    {/* Area Laporan */}
                    <div
                        id="printable-report"
                        className="bg-white border border-slate-200 shadow-lg rounded-xl overflow-hidden"
                    >
                        {/* Header Edotel */}
                        <div className="p-6 border-b-4 border-slate-900 bg-slate-50">
                            <div className="flex justify-between items-start">
                                <div className="text-center">
                                    <img
                                        src="/assets/image/logo.png"
                                        alt="EDOTEL SMKN 2 Gorontalo"
                                        className="w-36 object-contain mx-auto"
                                    />
                                    <p className="text-xs text-amber-600 font-semibold uppercase tracking-widest">
                                        Maintenance Report
                                    </p>
                                </div>
                                <div className="text-right text-xs text-slate-500">
                                    <p>Report ID: #MNT-{maintenance.id}</p>
                                    <p>
                                        Date Generated:{" "}
                                        {new Date().toLocaleDateString("id-ID")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 space-y-10">
                            {/* Info Kerusakan & Pelapor */}
                            <div className="grid grid-cols-2 gap-8 text-sm">
                                <div className="space-y-4">
                                    <h3 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] border-b pb-1">
                                        Issue Details
                                    </h3>
                                    <div className="grid grid-cols-1 gap-y-2">
                                        <div>
                                            <span className="text-slate-500 block text-[10px] uppercase">
                                                Location / Room
                                            </span>
                                            <span className="font-semibold text-slate-900">
                                                {maintenance.room_id
                                                    ? `Room ${maintenance.room.number} (${maintenance.room.type})`
                                                    : maintenance.ruangan}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block text-[10px] uppercase">
                                                Issue Description
                                            </span>
                                            <span className="text-slate-700 font-medium">
                                                {maintenance.issue}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] border-b pb-1">
                                        Report Log
                                    </h3>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                        <span className="text-slate-500">
                                            Reported By
                                        </span>
                                        <span className="text-slate-900 font-medium">
                                            : {maintenance.reported_by}
                                        </span>

                                        <span className="text-slate-500">
                                            Reported Date
                                        </span>
                                        <span className="text-slate-700">
                                            : {maintenance.reported_at || "-"}
                                        </span>

                                        <span className="text-slate-500">
                                            Completed Date
                                        </span>
                                        <span className="text-slate-700">
                                            : {maintenance.completed_at || "-"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Rincian Biaya & Resolusi */}
                            <div className="mt-6 border rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 border-b">
                                        <tr className="text-slate-500 font-bold">
                                            <th className="py-3 px-4 text-left">
                                                Description
                                            </th>
                                            <th className="py-3 px-4 text-right font-mono">
                                                Estimated Cost
                                            </th>
                                            <th className="py-3 px-4 text-right font-mono">
                                                Actual Cost
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr>
                                            <td className="py-6 px-4">
                                                <div className="font-medium text-slate-900 mb-1">
                                                    Maintenance & Repair Work
                                                </div>
                                                <div className="text-xs text-slate-500 italic">
                                                    Notes:{" "}
                                                    {maintenance.resolution_notes ||
                                                        "No specific notes provided."}
                                                </div>
                                            </td>
                                            <td className="py-6 px-4 text-right text-slate-400 font-mono italic">
                                                {maintenance.estimated_rupiah}
                                            </td>
                                            <td className="py-6 px-4 text-right text-emerald-700 font-bold font-mono text-lg">
                                                {maintenance.actual_rupiah ||
                                                    "Rp 0"}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Final Status Summary */}
                            <div className="flex justify-end pt-6">
                                <div className="w-full md:w-1/2 p-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                Total Expenditure
                                            </p>
                                            <p className="text-3xl font-black text-slate-900 font-mono">
                                                {maintenance.actual_rupiah ||
                                                    "Rp 0"}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <Badge
                                                className={getStatusBadge(
                                                    maintenance.status,
                                                )}
                                            >
                                                {maintenance.status ===
                                                "completed" ? (
                                                    <CheckCircle2 className="size-3 mr-1" />
                                                ) : (
                                                    <AlertTriangle className="size-3 mr-1" />
                                                )}
                                                {maintenance.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tanda Tangan */}
                            <div className="grid grid-cols-2 gap-10 pt-16 pb-10 text-center text-sm">
                                <div className="space-y-16">
                                    <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">
                                        Technician / Reporter
                                    </p>
                                    <div className="border-t border-slate-300 w-48 mx-auto">
                                        <p className="text-slate-900 font-medium capitalize">
                                            {maintenance.reported_by}
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
                            Safety & Quality Priority
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
