import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Head, usePage } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Shield, Calendar, Clock } from "lucide-react";
import EditProfile from "./EditProfile";

export default function Profile({ user }) {
    const { auth } = usePage().props;

    const getRoleBadgeColor = (role) => {
        const colors = {
            admin: "bg-purple-100 text-purple-700 border-purple-200",
            frontoffice: "bg-blue-100 text-blue-700 border-blue-200",
            housekeeping: "bg-green-100 text-green-700 border-green-200",
        };
        return colors[role] || "bg-slate-100 text-slate-700 border-slate-200";
    };

    return (
        <>
            <Head title="MyProfile" />

            <Layout>
                <div className="space-y-6 max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-serif text-slate-900">
                                My Profile
                            </h2>
                            <p className="text-slate-600 mt-1">
                                Manage your account information
                            </p>
                        </div>
                    </div>

                    {/* Profile Card */}
                    <Card className="border-slate-200 shadow-lg">
                        <CardHeader className="bg-gradient-to-r  from-amber-50 to-amber-100 border-b border-amber-200 mt-0">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="size-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-2xl font-serif shadow-lg">
                                        {auth.user?.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()}
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl text-slate-900">
                                            {auth.user?.name}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge
                                                className={getRoleBadgeColor(
                                                    auth.user?.role,
                                                )}
                                            >
                                                {auth.user?.role === "admin"
                                                    ? "Administrator"
                                                    : auth.user?.role ===
                                                        "frontoffice"
                                                      ? "Front Office Staff"
                                                      : "Housekeeping Staff"}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className="border-amber-300 text-amber-700"
                                            >
                                                <Shield className="size-3 mr-1" />
                                                Active
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <EditProfile user={user} />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 max-w-3xl md:grid-cols-2 gap-6 mx-auto ">
                                {/* Contact Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                        Contact Information
                                    </h3>

                                    <div className="flex items-start gap-3">
                                        <div className="size-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <Mail className="size-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600">
                                                Email Address
                                            </p>
                                            <p className="text-slate-900 font-medium">
                                                {auth.user?.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="size-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                            <Phone className="size-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600">
                                                Phone Number
                                            </p>
                                            <p className="text-slate-900 font-medium">
                                                {auth.user?.phone}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Employment Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                        Employment Information
                                    </h3>

                                    <div className="flex items-start gap-3">
                                        <div className="size-10 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
                                            <Shield className="size-5 text-rose-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600">
                                                Access Level
                                            </p>
                                            <p className="text-slate-900 font-medium capitalize">
                                                {auth.user?.role}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="size-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                                            <Calendar className="size-5 text-teal-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600">
                                                Join Date
                                            </p>
                                            <p className="text-slate-900 font-medium">
                                                {auth.user?.created_at}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm text-slate-600">
                                    Total Sessions
                                </CardTitle>
                                <Clock className="size-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-semibold text-slate-900">
                                    245
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Login sessions
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm text-slate-600">
                                    Tasks Completed
                                </CardTitle>
                                <Shield className="size-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-semibold text-slate-900">
                                    1,247
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Lifetime tasks
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm text-slate-600">
                                    Last Login
                                </CardTitle>
                                <User className="size-4 text-purple-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-semibold text-slate-900">
                                    Today
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    09:30 AM
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Layout>
        </>
    );
}
