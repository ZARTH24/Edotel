import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, router } from "@inertiajs/react";
import { Edit, Trash2, Archive, RotateCcw } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Room({ rooms, archivedRooms }) {
    const [showArchived, setShowArchived] = useState(false);

    const getRoomStatusBadge = (status) => {
        const statusStyles = {
            available: "bg-green-100 text-green-700 border-green-200",
            occupied: "bg-red-100 text-red-700 border-red-200",
            cleaning: "bg-yellow-100 text-yellow-700 border-yellow-200",
            maintenance: "bg-orange-100 text-orange-700 border-orange-200",
            reserved: "bg-blue-100 text-blue-700 border-blue-200",
        };
        return statusStyles[status] || "bg-slate-100 text-slate-700";
    };

    const getArchivedRooms = () => {
        if (!archivedRooms) return [];
        return Array.isArray(archivedRooms) ? archivedRooms : [];
    };

    const archived = getArchivedRooms();

    return (
        <>
            <CardContent>
                {rooms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {rooms.map((room) => (
                            <div
                                key={room.id}
                                className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-all bg-white flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="text-xl font-semibold text-slate-900 leading-none">
                                                Room {room.number}
                                            </div>
                                            <div>
                                                <Badge
                                                    className={`${getRoomStatusBadge(room.status)} font-normal`}
                                                >
                                                    {room.status}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 flex-shrink-0">
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-slate-600 hover:text-blue-600 border-slate-200 shadow-sm"
                                            >
                                                <Link
                                                    href={`/Frontoffice/editroom/${room.id}`}
                                                >
                                                    <Edit className="size-3.5" />
                                                </Link>
                                            </Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-slate-600 hover:text-red-600 border-slate-200 shadow-sm"
                                                    >
                                                        <Archive className="size-3.5" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Archive Room {room.number}?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This room will be archived and hidden from the active list. All related data (reservations, cleaning tasks, maintenance reports) will be preserved.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            variant="destructive"
                                                            onClick={() =>
                                                                router.delete(
                                                                    `/Frontoffice/room/${room.id}`,
                                                                )
                                                            }
                                                        >
                                                            Archive
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-600">Type:</span>
                                            <span className="text-slate-900 capitalize">{room.type}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-600">Floor:</span>
                                            <span className="text-slate-900">{room.floor}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-600">Price:</span>
                                            <span className="text-slate-900 font-semibold">{room.price_rupiah}/night</span>
                                        </div>
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-slate-200">
                                        <div className="text-xs text-slate-500">Features:</div>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {room.features.map((feature, idf) => (
                                                <span key={idf} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-slate-500 py-8">
                        No rooms added yet
                    </p>
                )}

                {archived.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-slate-200">
                        <button
                            onClick={() => setShowArchived(!showArchived)}
                            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            <Archive className="size-4" />
                            Archived Rooms ({archived.length})
                            <span className="text-xs">{showArchived ? "▲" : "▼"}</span>
                        </button>

                        {showArchived && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                                {archived.map((room) => (
                                    <div
                                        key={room.id}
                                        className="p-4 border border-slate-300 rounded-lg bg-slate-50 flex flex-col justify-between opacity-75"
                                    >
                                        <div>
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="text-xl font-semibold text-slate-500 leading-none line-through">
                                                        Room {room.number}
                                                    </div>
                                                    <div>
                                                        <Badge className="bg-slate-200 text-slate-500 font-normal">
                                                            Archived
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 text-xs border-green-300 text-green-700 hover:bg-green-50"
                                                    onClick={() =>
                                                        router.post(
                                                            `/Frontoffice/room/${room.id}/restore`,
                                                        )
                                                    }
                                                >
                                                    <RotateCcw className="size-3 mr-1" />
                                                    Restore
                                                </Button>
                                            </div>

                                            <div className="space-y-2 text-sm text-slate-400">
                                                <div className="flex items-center justify-between">
                                                    <span>Type:</span>
                                                    <span className="capitalize">{room.type}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span>Floor:</span>
                                                    <span>{room.floor}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span>Price:</span>
                                                    <span>{room.price_rupiah}/night</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </>
    );
}
