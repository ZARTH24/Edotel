import React from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import { Hotel, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Toaster, toast } from "sonner";

export default function Login() {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/Login");
        if (errors) {
            setData("password", "");
        }
    };

    React.useEffect(() => {
        if (flash?.message) {
            switch (flash.type) {
                case "success":
                    toast.success(flash.message);
                    break;
                case "error":
                    toast.error(flash.message);
                    break;
                case "info":
                    toast.info(flash.message);
                    break;
                default:
                    toast(flash.message);
            }
        }
    }, [flash]);

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
                </div>
                <Card className="w-full max-w-md relative z-10 border-slate-700 bg-slate-800/50 backdrop-blur-xl shadow-2xl dark:border-slate-600 dark:bg-slate-900/50">
                    <CardHeader className="space-y-4 text-center">
                        <div className="mx-auto rounded-2xl flex items-center justify-center shadow-lg">
                            {/* <Hotel className="size-8 text-white" /> */}
                            <img
                                src="/assets/image/hitamputih.png"
                                alt="EDOTEL SMKN 2 Gorontalo"
                                className="h-18 w-auto object-contain"
                            />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-serif text-white">
                                SMKN 2 GORONTALO
                            </CardTitle>
                            <CardDescription className="text-slate-400 mt-2">
                                Management System
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* EMAIL */}
                            <div className="space-y-0.5">
                                <Label
                                    htmlFor="email"
                                    className="text-slate-300 mb-2"
                                >
                                    Email
                                </Label>
                                <div className="relative">
                                    <Mail
                                        className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${
                                            errors.email
                                                ? "text-red-500"
                                                : "text-slate-400"
                                        }`}
                                    />
                                    <Input
                                        id="email"
                                        type="text"
                                        placeholder="email@example.com"
                                        className={`pl-10 bg-slate-900/50 placeholder:text-slate-500 ${
                                            errors.email
                                                ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 text-red-500"
                                                : "border-slate-600 text-white"
                                        }`}
                                        required
                                        value={data.email}
                                        onChange={(e) => {
                                            setData("email", e.target.value);
                                            clearErrors("email");
                                        }}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-sm ml-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* PASSWORD + TOGGLE */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-slate-300"
                                >
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock
                                        className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${
                                            errors.password
                                                ? "text-red-500"
                                                : "text-slate-400"
                                        }`}
                                    />

                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="••••••••"
                                        className={`pl-10 pr-10 bg-slate-900/50 ${
                                            errors.password
                                                ? "border-red-500 focus-visible:border-red-500 placeholder:text-red-500 focus-visible:ring-red-500 text-red-500"
                                                : "border-slate-600 text-white placeholder:text-slate-500"
                                        }`}
                                        value={data.password}
                                        onChange={(e) => {
                                            setData("password", e.target.value);
                                            clearErrors("password");
                                        }}
                                    />

                                    {/* ICON MATA */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="size-4" />
                                        ) : (
                                            <Eye className="size-4" />
                                        )}
                                    </button>
                                </div>

                                {errors.password && (
                                    <p className="text-red-500 text-sm ml-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white h-11"
                                disabled={processing}
                            >
                                {processing ? "Loading..." : "Masuk"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Toaster position="top-right" richColors />
            </div>
        </>
    );
}
