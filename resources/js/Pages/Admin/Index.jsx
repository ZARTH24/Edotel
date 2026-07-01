import { useEffect, useState } from "react";
import {
    Search,
    Plus,
    Mail,
    Phone,
    Edit,
    Trash2,
    X,
    AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout/Layout";
import { Head, Link, router, useForm } from "@inertiajs/react";
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Index({ users }) {
    // Alias data users menjadi nama pagination agar singkron dengan kode bawah Anda
    const pagination = users;

    const { data, setData, get } = useForm({ search: "" });

    const handleSearch = (e) => {
        const value = e.target.value;
        setData("search", value);

        router.get(
            "/User/daftarUser",
            { search: value },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    // Fungsi untuk menangani klik navigasi halaman
    const handlePageClick = (url) => {
        router.get(
            url,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const getRoleBadgeColor = (role) => {
        const styles = {
            admin: "bg-rose-100 text-rose-700 border-rose-200",
            "front-office": "bg-blue-100 text-blue-700 border-blue-200",
            housekeeping: "bg-teal-100 text-teal-700 border-teal-200",
            siswa: "bg-amber-100 text-amber-700 border-amber-200",
        };
        return styles[role] || "bg-slate-100 text-slate-700";
    };

    const formatRoleLabel = (role) => {
        const labels = {
            admin: "Administrator",
            "front-office": "Front Office Staff",
            housekeeping: "Housekeeping Staff",
            siswa: "Siswa",
        };
        return labels[role] || role;
    };

    //  const handleDelete = (id, name) => {
    //      if (confirm(`Are you sure you want to delete ${name}?`)) {
    //          router.delete(`/User/${id}`);
    //      }
    //  };

    const [userToDelete, setUserToDelete] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fungsi saat tombol sampah diklik
    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setIsModalOpen(true);
    };

    // Fungsi eksekusi hapus yang sebenarnya (Inertia Delete)
    const confirmDelete = () => {
        if (userToDelete) {
            router.delete(`/User/${userToDelete.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setUserToDelete(null);
                },
                preserveScroll: true, // Menjaga posisi scroll tabel tetap di tempat semula
            });
        }
    };

    return (
        <>
            <Head title="List Users" />

            <Layout>
                <div className="space-y-6 max-w-6xl mx-auto">
                    {/* Header Bagian Atas */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-serif text-slate-900">
                                Staff Directory
                            </h2>
                            <p className="text-slate-600 mt-1">
                                Manage user accounts, system roles, and
                                permissions
                            </p>
                        </div>
                        <Link
                            href="/User/create"
                            className="group/button inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium text-sm transition-all h-10 px-4 shadow-sm"
                        >
                            <Plus className="size-4 mr-2" />
                            Add New User
                        </Link>
                    </div>

                    {/* Kontainer Utama Tabel */}
                    <Card className="border-slate-200 shadow-lg overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-stone-50 to-stone-100/80 border-b border-slate-200">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                                <CardTitle className="text-lg text-slate-950 font-serif">
                                    All Registered Personnel
                                </CardTitle>
                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
                                    <Input
                                        placeholder="Search by name or email..."
                                        className="pl-9 bg-white border-slate-200 focus-visible:ring-amber-500"
                                        value={data.search}
                                        onChange={handleSearch}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-xs tracking-wider font-semibold uppercase">
                                            <th className="py-4 px-6">
                                                Staff Member
                                            </th>
                                            <th className="py-4 px-6">
                                                Role Assignment
                                            </th>
                                            <th className="py-4 px-6">
                                                Contact Details
                                            </th>
                                            <th className="py-4 px-6 text-center w-[120px]">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {pagination.data &&
                                        pagination.data.length > 0 ? (
                                            pagination.data.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    className="hover:bg-slate-50/80 transition-colors"
                                                >
                                                    {/* Kolom Informasi User & Avatar */}
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-sm font-serif font-medium shadow-sm flex-shrink-0">
                                                                {user.name
                                                                    ? user.name
                                                                          .trim()
                                                                          .split(
                                                                              /\s+/,
                                                                          )
                                                                          .map(
                                                                              (
                                                                                  n,
                                                                              ) =>
                                                                                  n[0],
                                                                          )
                                                                          .join(
                                                                              "",
                                                                          )
                                                                          .toUpperCase()
                                                                          .substring(
                                                                              0,
                                                                              2,
                                                                          )
                                                                    : "??"}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-slate-900">
                                                                    {user.name}
                                                                </div>
                                                                <div className="text-xs text-slate-400">
                                                                    Joined{" "}
                                                                    {new Date(
                                                                        user.created_at,
                                                                    ).toLocaleDateString(
                                                                        "id-ID",
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Kolom Akses / Role */}
                                                    <td className="py-4 px-6 align-middle">
                                                        <Badge
                                                            className={`${getRoleBadgeColor(user.role)} font-normal px-2.5 py-0.5 border`}
                                                        >
                                                            {formatRoleLabel(
                                                                user.role,
                                                            )}
                                                        </Badge>
                                                    </td>

                                                    {/* Kolom Kontak */}
                                                    <td className="py-4 px-6 text-sm text-slate-600">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-1.5">
                                                                <Mail className="size-3.5 text-slate-400" />
                                                                <span>
                                                                    {user.email}
                                                                </span>
                                                            </div>
                                                            {user.phone && (
                                                                <div className="flex items-center gap-1.5">
                                                                    <Phone className="size-3.5 text-slate-400" />
                                                                    <span>
                                                                        {
                                                                            user.phone
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Kolom Tombol Aksi */}
                                                    <td className="py-4 px-6 align-middle">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-slate-600 hover:text-amber-600 border-slate-200"
                                                                onClick={() =>
                                                                    router.get(
                                                                        `/User/${user.id}/edit`,
                                                                    )
                                                                }
                                                            >
                                                                <Edit className="size-3.5" />
                                                            </Button>

                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:border-red-200 border-slate-200"
                                                                onClick={() =>
                                                                    handleDeleteClick(
                                                                        user,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="py-12 text-center text-slate-400 text-sm"
                                                >
                                                    No registered staff found
                                                    matching current criteria.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* KOMPONEN PAGINATION AMAN DAN FIX CRASH */}
                            {pagination && pagination.links.length > 3 && (
                                <div className="p-4 border-t border-slate-100 bg-slate-50/30">
                                    <Pagination>
                                        <PaginationContent>
                                            {pagination.links.map(
                                                (link, index) => {
                                                    const isPrev =
                                                        link.label
                                                            .toLowerCase()
                                                            .includes(
                                                                "previous",
                                                            ) ||
                                                        link.label.includes(
                                                            "«",
                                                        );
                                                    const isNext =
                                                        link.label
                                                            .toLowerCase()
                                                            .includes("next") ||
                                                        link.label.includes(
                                                            "»",
                                                        );
                                                    const isEllipsis =
                                                        link.label === "...";

                                                    return (
                                                        <PaginationItem
                                                            key={index}
                                                        >
                                                            {isPrev ? (
                                                                <PaginationPrevious
                                                                    onClick={() =>
                                                                        link.url &&
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
                                                                        link.url &&
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
                                                                        link.url &&
                                                                        handlePageClick(
                                                                            link.url,
                                                                        )
                                                                    }
                                                                    isActive={
                                                                        link.active
                                                                    }
                                                                    className={
                                                                        !link.url
                                                                            ? "pointer-events-none opacity-50"
                                                                            : "cursor-pointer"
                                                                    }
                                                                >
                                                                    {link.label
                                                                        .replace(
                                                                            /&laquo;\s*/g,
                                                                            "",
                                                                        )
                                                                        .replace(
                                                                            /\s*&raquo;/g,
                                                                            "",
                                                                        )
                                                                        .replace(
                                                                            /«\s*/g,
                                                                            "",
                                                                        )
                                                                        .replace(
                                                                            /\s*»/g,
                                                                            "",
                                                                        )}
                                                                </PaginationLink>
                                                            )}
                                                        </PaginationItem>
                                                    );
                                                },
                                            )}
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <AlertDialogContent className="w-[99vw] max-w-md rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl overflow-hidden">
                        {/* Close button */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Content */}
                        <div className="px-6 pt-8 pb-6">
                            <div className="flex flex-col items-center text-center">
                                {/* Icon */}
                                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mb-5">
                                    <Trash2 className="w-11 h-11 text-red-600" />
                                </div>

                                {/* Title */}
                                <AlertDialogTitle className="text-2xl font-semibold text-slate-900">
                                    Delete
                                </AlertDialogTitle>

                                {/* Description */}
                                <AlertDialogDescription className="mt-2 text-sm leading-6 text-slate-500">
                                    Are you sure you would like to do this?
                                </AlertDialogDescription>
                            </div>
                            {/* Footer */}
                            <AlertDialogFooter className="mt-8 flex-row gap-3">
                                <AlertDialogCancel className="flex-1 h-11 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={confirmDelete}
                                    className="flex-1 h-11 rounded-xl bg-red-600 text-white hover:bg-red-700"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            </Layout>
        </>
    );
}
