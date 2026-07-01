import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Layout from "@/components/Layout/Layout";
import { Head, useForm, Link } from "@inertiajs/react";
import { UserCheck, Mail, Phone, Lock, ArrowLeft } from "lucide-react";
import React, { useRef, useEffect } from "react";

export default function Edit({ user }) {
    // Mengunci data awal (default values) dari data user yang dikirim Laravel
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || "",
        email: user.email || "",
        password: "", // Kosongkan secara default, diisi hanya jika ingin ganti password
        role: user.role || "",
        phone: user.phone || "",
        is_active: user.is_active ?? true,
    });

    const nameRef = useRef(null);
    const emailRef = useRef(null);

    // Auto-focus field pertama yang error jika validasi gagal
    useEffect(() => {
        if (errors.name) nameRef.current?.focus();
        else if (errors.email) emailRef.current?.focus();
    }, [errors]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Menggunakan method PUT menuju URL edit di Laravel
        put(`/User/${user.id}`);
    };

    return (
        <>
            <Head title={`Edit User - ${user.name}`} />

            <Layout>
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Header Navigasi Kembali */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                <Link
                                    href="/users"
                                    className="hover:text-amber-600 flex items-center gap-1 transition-colors"
                                >
                                    <ArrowLeft className="size-3" />
                                    Back to List Users
                                </Link>
                            </div>
                            <h2 className="text-3xl font-serif text-slate-900">
                                Update Staff Member
                            </h2>
                            <p className="text-slate-600 mt-1">
                                Modify account configuration and system
                                accessibility for {user.name}
                            </p>
                        </div>
                    </div>

                    {/* Main Form Card */}
                    <form onSubmit={handleSubmit}>
                        <Card className="border-slate-200 shadow-lg overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-md">
                                        <UserCheck className="size-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl text-slate-900">
                                            Account Identity & Restrictions
                                        </CardTitle>
                                        <p className="text-xs text-amber-800/80 mt-0.5">
                                            Leave password blank if you do not
                                            wish to change it
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-8 space-y-6">
                                {/* Row 1: Name & Email */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="name"
                                            className="text-slate-700 font-medium"
                                        >
                                            Full Name{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            ref={nameRef}
                                            id="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className={
                                                errors.name &&
                                                "border-red-500 focus-visible:ring-red-500"
                                            }
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="email"
                                            className="text-slate-700 font-medium"
                                        >
                                            Email Address{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
                                            <Input
                                                ref={emailRef}
                                                id="email"
                                                type="email"
                                                className={`pl-9 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Row 2: Password (Opsional) & Phone */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="password"
                                            className="text-slate-700 font-medium"
                                        >
                                            New Password{" "}
                                            <span className="text-slate-400 text-xs font-normal">
                                                (Optional)
                                            </span>
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="Fill only to reset password"
                                                className={`pl-9 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData(
                                                        "password",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        {errors.password && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="phone"
                                            className="text-slate-700 font-medium"
                                        >
                                            Phone Number
                                        </Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
                                            <Input
                                                id="phone"
                                                className="pl-9"
                                                value={data.phone}
                                                onChange={(e) =>
                                                    setData(
                                                        "phone",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        {errors.phone && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Row 3: Role & Is Active Account Status */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="role"
                                            className="text-slate-700 font-medium"
                                        >
                                            Employment Role{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={data.role}
                                            onValueChange={(value) =>
                                                setData("role", value)
                                            }
                                        >
                                            <SelectTrigger
                                                className={
                                                    errors.role &&
                                                    "border-red-500 focus-visible:ring-red-500"
                                                }
                                            >
                                                <SelectValue placeholder="Assign a role..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="admin">
                                                    Administrator
                                                </SelectItem>
                                                <SelectItem value="front-office">
                                                    Front Office Staff
                                                </SelectItem>
                                                <SelectItem value="housekeeping">
                                                    Housekeeping Staff
                                                </SelectItem>
                                                <SelectItem value="siswa">
                                                    Siswa
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.role && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.role}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Form Footer Actions */}
                                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-amber-600 hover:bg-amber-700 text-white px-8 shadow-sm transition-all"
                                    >
                                        {processing
                                            ? "Updating..."
                                            : "Save Changes"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </Layout>
        </>
    );
}
