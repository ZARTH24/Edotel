import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    CheckCircle,
    Clock,
    Eye,
    FileText,
    Play,
    RefreshCw,
    Send,
    XCircle,
    ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { Toaster, toast } from "sonner";

export default function ReservationShow({
    exercise,
    study_case,
    progress,
    latest_answer,
    attempts,
    navigation,
}) {
    const { flash } = usePage().props;
    const [showStudyCase, setShowStudyCase] = useState(true);
    const [timer, setTimer] = useState(study_case?.estimated_time || 240);
    const [timerActive, setTimerActive] = useState(false);
    const [showDocument, setShowDocument] = useState(false);
    const [validationResult, setValidationResult] = useState(null);
    const [wrongFields, setWrongFields] = useState([]);

    // Initialize form with latest answer if exists
    const { data, setData, post, processing, errors, reset } = useForm({
        // Dynamic fields will be set based on exercise
    });

    // Timer effect
    useEffect(() => {
        let interval;
        if (timerActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setTimerActive(false);
            setShowStudyCase(false);
            toast.info("Waktu habis! Lanjut ke form.");
        }
        return () => clearInterval(interval);
    }, [timerActive, timer]);

    // Handle flash messages
    useEffect(() => {
        if (flash?.message) {
            if (flash.type === "success") {
                toast.success(flash.message);
                setValidationResult({ is_correct: true });
            } else if (flash.type === "error") {
                toast.error(flash.message);
                if (flash.wrong_fields) {
                    setWrongFields(flash.wrong_fields);
                }
                if (flash.validation) {
                    setValidationResult(flash.validation);
                }
            }
        }
    }, [flash]);

    // Format timer
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // Skip study case
    const handleSkip = () => {
        setShowStudyCase(false);
        setTimerActive(false);
    };

    // Start timer
    const handleStartTimer = () => {
        setTimerActive(true);
    };

    // Submit answer
    const handleSubmit = (e) => {
        e.preventDefault();
        setValidationResult(null);
        setWrongFields([]);
        post(`/elearning/reservation/${exercise.slug}`);
    };

    // Retry (reset form)
    const handleRetry = () => {
        reset();
        setValidationResult(null);
        setWrongFields([]);
    };

    // Show validation result
    if (validationResult?.is_correct && !showStudyCase) {
        return (
            <>
                <Head title={`${exercise.title} - Completed`} />

                <Layout>
                    <div className="max-w-2xl mx-auto space-y-6">
                        <Card className="border-green-200 bg-green-50 shadow-lg">
                            <CardContent className="pt-6">
                                <div className="text-center space-y-4">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle className="size-10 text-green-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-green-700">
                                        Selamat!
                                    </h2>
                                    <p className="text-green-600">
                                        Anda telah menyelesaikan seluruh latihan E-Learning!
                                    </p>
                                    <p className="text-green-600">
                                        Sekarang Anda dapat mengakses Front Office, Housekeeping, dan Damage Report.
                                    </p>
                                    <div className="flex justify-center gap-4 pt-4">
                                        <Link href="/elearning">
                                            <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                                                Kembali ke E-Learning
                                            </Button>
                                        </Link>
                                        <Link href="/Dashboard">
                                            <Button variant="outline">
                                                Buka Menu Hotel
                                                <ChevronRight className="size-4 ml-2" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </Layout>
            </>
        );
    }

    // Study Case View
    if (showStudyCase && study_case) {
        return (
            <>
                <Head title={`${exercise.title} - Study Case`} />

                <Layout>
                    <div className="max-w-3xl mx-auto space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link href="/elearning/reservation">
                                    <Button variant="outline" size="icon">
                                        <ArrowLeft className="size-4" />
                                    </Button>
                                </Link>
                                <div>
                                    <h2 className="text-2xl font-serif text-slate-900">
                                        {exercise.title}
                                    </h2>
                                    <p className="text-slate-500 text-sm">
                                        Latihan {exercise.order_number} dari 6
                                    </p>
                                </div>
                            </div>
                            <Badge variant="outline" className="text-lg px-4 py-2">
                                <Clock className="size-4 mr-2" />
                                {formatTime(timer)}
                            </Badge>
                        </div>

                        {/* Timer Progress */}
                        <Progress
                            value={(timer / (study_case?.estimated_time || 240)) * 100}
                            className="h-2"
                        />

                        {/* Study Case Card */}
                        <Card className="border-slate-200 shadow-lg">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-lg">
                                        <BookOpen className="size-6 text-white" />
                                    </div>
                                    <CardTitle className="text-xl">
                                        {study_case.title}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Content */}
                                <div className="prose prose-slate max-w-none">
                                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 whitespace-pre-wrap">
                                        {study_case.content}
                                    </div>
                                </div>

                                {/* Timer Info */}
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-green-700">
                                        <Clock className="size-5" />
                                        <span className="font-medium">
                                            Waktu: {Math.floor(study_case.estimated_time / 60)} menit
                                        </span>
                                    </div>
                                    <p className="text-sm text-green-600 mt-1">
                                        Baca studi kasus dengan seksama sebelum mengisi form.
                                        {timerActive && " Timer sedang berjalan!"}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-between pt-4">
                                    <Button variant="outline" onClick={handleSkip}>
                                        Skip
                                    </Button>
                                    <Button
                                        onClick={handleStartTimer}
                                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                                    >
                                        <Play className="size-4 mr-2" />
                                        Mulai Timer
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </Layout>
            </>
        );
    }

    // Exercise Form View
    return (
        <>
            <Head title={`${exercise.title} - Exercise`} />

            <Layout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/elearning/reservation">
                                <Button variant="outline" size="icon">
                                    <ArrowLeft className="size-4" />
                                </Button>
                            </Link>
                            <div>
                                <h2 className="text-2xl font-serif text-slate-900">
                                    {exercise.title}
                                </h2>
                                <p className="text-slate-500 text-sm">
                                    Latihan {exercise.order_number} dari 6
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {attempts > 0 && (
                                <Badge variant="outline" className="text-green-500">
                                    Attempts: {attempts}
                                </Badge>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowDocument(!showDocument)}
                            >
                                <Eye className="size-4 mr-2" />
                                {showDocument ? "Hide" : "Show"} Document
                            </Button>
                        </div>
                    </div>

                    {/* Validation Error */}
                    {wrongFields.length > 0 && (
                        <Card className="border-red-200 bg-red-50">
                            <CardContent className="pt-4">
                                <div className="flex items-start gap-3">
                                    <XCircle className="size-5 text-red-500 mt-0.5" />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-red-700">
                                            Ada jawaban yang salah
                                        </h4>
                                        <ul className="mt-2 space-y-1 text-sm text-red-600">
                                            {wrongFields.map((field, index) => (
                                                <li key={index}>
                                                    • {field}
                                                </li>
                                            ))}
                                        </ul>
                                        {validationResult?.clues && Object.keys(validationResult.clues).length > 0 && (
                                            <div className="mt-4 p-3 bg-white rounded border border-red-200">
                                                <h5 className="font-medium text-red-700 mb-2">Clue:</h5>
                                                <ul className="space-y-1 text-sm">
                                                    {Object.entries(validationResult.clues).map(([field, clue], index) => (
                                                        wrongFields.includes(field) && (
                                                            <li key={index} className="text-slate-600">
                                                                <span className="font-medium capitalize">{field.replace(/_/g, " ")}:</span> {clue}
                                                            </li>
                                                        )
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Document Preview & Form */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Document Preview */}
                        {showDocument && (
                            <Card className="border-slate-200">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <FileText className="size-5" />
                                        Document Preview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg aspect-[3/4] flex items-center justify-center">
                                        <div className="text-center text-slate-400">
                                            <FileText className="size-12 mx-auto mb-2" />
                                            <p className="text-sm">
                                                {exercise.document_path}
                                            </p>
                                            <p className="text-xs mt-1">
                                                (Preview placeholder)
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Exercise Form */}
                        <Card className="border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Isi Form Berikut
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Placeholder form - will be customized per exercise */}
                                    <div className="text-center py-12 text-slate-500">
                                        <FileText className="size-12 mx-auto mb-4 opacity-50" />
                                        <p>Form untuk latihan ini belum dikonfigurasi.</p>
                                        <p className="text-sm mt-2">
                                            Slug: {exercise.slug}
                                        </p>
                                    </div>

                                    {/* Form actions */}
                                    <div className="flex justify-between pt-4 border-t">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleRetry}
                                        >
                                            <RefreshCw className="size-4 mr-2" />
                                            Reset
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                                        >
                                            {processing ? (
                                                "Submitting..."
                                            ) : (
                                                <>
                                                    <Send className="size-4 mr-2" />
                                                    Submit
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between pt-4">
                        {navigation?.prev ? (
                            <Link href={`/elearning/reservation/${navigation.prev.slug}`}>
                                <Button variant="outline">
                                    <ArrowLeft className="size-4 mr-2" />
                                    {navigation.prev.title}
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/elearning/reservation">
                                <Button variant="outline">
                                    <ArrowLeft className="size-4 mr-2" />
                                    Kembali
                                </Button>
                            </Link>
                        )}

                        {navigation?.next && progress.is_completed && (
                            <Link href={`/elearning/reservation/${navigation.next.slug}`}>
                                <Button variant="outline">
                                    {navigation.next.title}
                                    <ArrowRight className="size-4 ml-2" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </Layout>
        </>
    );
}
