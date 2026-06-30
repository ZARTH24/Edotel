import React from "react";
import Layout from "@/components/Layout/Layout";
import {
    ClipboardList,
    CheckCircle,
    Lock,
    Play,
    ChevronRight,
    ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Head, Link } from "@inertiajs/react";

export default function ReceptionIndex({ exercises, stats }) {
    return (
        <>
            <Head title="Reception - E-Learning" />

            <Layout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <Link href="/elearning">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="size-4" />
                            </Button>
                        </Link>
                        <div>
                            <h2 className="text-3xl font-serif text-slate-900 dark:text-slate-100">
                                Reception
                            </h2>
                            <p className="text-slate-600 mt-1">
                                Latihan pengisian formulir reception hotel
                            </p>
                        </div>
                    </div>

                    {/* Progress */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <ClipboardList className="size-5 text-blue-500" />
                                    <span className="font-medium text-slate-700">
                                        Progress Reception
                                    </span>
                                </div>
                                <Badge variant="outline" className="text-lg px-3">
                                    {stats.progress}%
                                </Badge>
                            </div>
                            <Progress value={stats.progress} className="h-3" />
                            <p className="text-sm text-slate-500 mt-2 text-center">
                                {stats.completed} of {stats.total} exercises completed
                            </p>
                        </CardContent>
                    </Card>

                    {/* Exercise List */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800">
                            Daftar Latihan
                        </h3>

                        {exercises.map((exercise, index) => (
                            <Card
                                key={exercise.id}
                                className={`border-slate-200 shadow-sm transition-all ${
                                    exercise.status === "locked"
                                        ? "opacity-60"
                                        : exercise.status === "completed"
                                        ? "border-green-200 bg-green-50/50"
                                        : "hover:shadow-md"
                                }`}
                            >
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {/* Order Number */}
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                                                    exercise.status === "completed"
                                                        ? "bg-green-100 text-green-600"
                                                        : exercise.status === "opened"
                                                        ? "bg-amber-100 text-amber-600"
                                                        : "bg-slate-100 text-slate-400"
                                                }`}
                                            >
                                                {exercise.status === "completed" ? (
                                                    <CheckCircle className="size-5" />
                                                ) : exercise.status === "opened" ? (
                                                    <span>{exercise.order_number}</span>
                                                ) : (
                                                    <Lock className="size-4" />
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div>
                                                <h4 className="font-medium text-slate-900">
                                                    {exercise.title}
                                                </h4>
                                                <p className="text-sm text-slate-500">
                                                    {exercise.document_path}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            {exercise.status === "completed" && (
                                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                                    <CheckCircle className="size-3 mr-1" />
                                                    Completed
                                                </Badge>
                                            )}

                                            {exercise.status === "opened" && (
                                                <Link
                                                    href={`/elearning/reception/${exercise.slug}`}
                                                >
                                                    <Button size="sm" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
                                                        <Play className="size-3 mr-1" />
                                                        Mulai
                                                    </Button>
                                                </Link>
                                            )}

                                            {exercise.status === "locked" && (
                                                <Badge variant="outline" className="text-slate-400">
                                                    <Lock className="size-3 mr-1" />
                                                    Locked
                                                </Badge>
                                            )}

                                            {exercise.status === "opened" && (
                                                <ChevronRight className="size-4 text-slate-400" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Completed message */}
                                    {exercise.status === "completed" && exercise.completed_at && (
                                        <p className="text-xs text-green-600 mt-2 ml-14">
                                            Completed on {new Date(exercise.completed_at).toLocaleDateString("id-ID", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between pt-4">
                        <Link href="/elearning">
                            <Button variant="outline">
                                <ArrowLeft className="size-4 mr-2" />
                                Kembali ke E-Learning
                            </Button>
                        </Link>

                        {stats.progress < 100 && (
                            <Link href="/elearning/reservation" className="opacity-50 pointer-events-none">
                                <Button variant="outline" disabled>
                                    Lanjut ke Reservation
                                    <ChevronRight className="size-4 ml-2" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </Layout>
        </>
    );
}
