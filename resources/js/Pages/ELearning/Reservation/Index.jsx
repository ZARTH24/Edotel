import React from "react";
import Layout from "@/components/Layout/Layout";
import {
    CalendarCheck,
    CheckCircle,
    Lock,
    Play,
    ChevronRight,
    ArrowLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Head, Link } from "@inertiajs/react";

export default function ReservationIndex({ exercises, stats }) {
    return (
        <>
            <Head title="Reservation - E-Learning" />

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
                                Reservation
                            </h2>
                            <p className="text-slate-600 mt-1">
                                Latihan pengisian formulir reservasi hotel
                            </p>
                        </div>
                    </div>

                    {/* Progress */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <CalendarCheck className="size-5 text-green-500" />
                                    <span className="font-medium text-slate-700">
                                        Progress Reservation
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
                                                        ? "bg-green-100 text-green-600"
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
                                                    href={`/elearning/reservation/${exercise.slug}`}
                                                >
                                                    <Button size="sm" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
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
                    </div>
                </div>
            </Layout>
        </>
    );
}
