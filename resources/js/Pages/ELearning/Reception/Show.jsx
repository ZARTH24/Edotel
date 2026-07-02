import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import ExerciseForm from "@/components/ELearning/ExerciseForm";
import DocumentPreview from "@/components/ELearning/DocumentPreview";
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    CheckCircle,
    Clock,
    Play,
    ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Toaster, toast } from "sonner";

export default function ReceptionShow({
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
    const [timerActive, setTimerActive] = useState(true); // Timer langsung nyala
    const [showDocument, setShowDocument] = useState(true);
    const [validationResult, setValidationResult] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formImages, setFormImages] = useState([]);

    // Fetch form images
    useEffect(() => {
        fetch(`/elearning/api/form/${exercise.slug}`)
            .then((res) => res.json())
            .then((data) => {
                setFormImages(data.images || []);
            })
            .catch((err) => {
                console.error("Failed to fetch form images:", err);
            });
    }, [exercise.slug]);

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

    // Submit answer - ONLY ONE POST using router.post
    const handleSubmit = (formData) => {
        setIsSubmitting(true);

        router.post(`/elearning/reception/${exercise.slug}`, formData, {
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    // Retry (reset form)
    const handleRetry = () => {
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
                                        Jawaban Benar!
                                    </h2>
                                    <p className="text-green-600">
                                        Latihan "{exercise.title}" telah selesai.
                                    </p>
                                    <div className="flex justify-center gap-4 pt-4">
                                        {navigation?.next ? (
                                            <Link
                                                href={`/elearning/reception/${navigation.next.slug}`}
                                            >
                                                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                                                    Latihan Berikutnya
                                                    <ChevronRight className="size-4 ml-2" />
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Link
                                                href="/elearning/reception"
                                            >
                                                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                                                    Kembali ke Reception
                                                </Button>
                                            </Link>
                                        )}
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
                                <Link href="/elearning/reception">
                                    <Button variant="outline" size="icon">
                                        <ArrowLeft className="size-4" />
                                    </Button>
                                </Link>
                                <div>
                                    <h2 className="text-2xl font-serif text-slate-900">
                                        {exercise.title}
                                    </h2>
                                    <p className="text-slate-500 text-sm">
                                        Latihan {exercise.order_number} dari 9
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
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg">
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
                                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 whitespace-pre-wrap font-mono text-sm">
                                        {study_case.content}
                                    </div>
                                </div>

                                {/* Timer Info */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-blue-700">
                                        <Clock className="size-5" />
                                        <span className="font-medium">
                                            Waktu: {Math.floor(study_case.estimated_time / 60)} menit
                                        </span>
                                    </div>
                                    <p className="text-sm text-blue-600 mt-1">
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
                                        onClick={() => setShowStudyCase(false)}
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                                    >
                                        <Play className="size-4 mr-2" />
                                        Lanjut ke Form
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
                            <Link href="/elearning/reception">
                                <Button variant="outline" size="icon">
                                    <ArrowLeft className="size-4" />
                                </Button>
                            </Link>
                            <div>
                                <h2 className="text-2xl font-serif text-slate-900">
                                    {exercise.title}
                                </h2>
                                <p className="text-slate-500 text-sm">
                                    Latihan {exercise.order_number} dari 9
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {attempts > 0 && (
                                <Badge variant="outline" className="text-amber-500">
                                    Attempts: {attempts}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Document Preview & Form */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Document Preview */}
                        <DocumentPreview
                            images={formImages}
                            documentPath={exercise.document_path}
                            isVisible={showDocument}
                            onToggle={() => setShowDocument(!showDocument)}
                        />

                        {/* Exercise Form */}
                        <ExerciseForm
                            exerciseSlug={exercise.slug}
                            initialData={latest_answer}
                            validationResult={validationResult}
                            onSubmit={handleSubmit}
                            onReset={handleRetry}
                            isSubmitting={isSubmitting}
                        />
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between pt-4">
                        {navigation?.prev ? (
                            <Link href={`/elearning/reception/${navigation.prev.slug}`}>
                                <Button variant="outline">
                                    <ArrowLeft className="size-4 mr-2" />
                                    {navigation.prev.title}
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/elearning/reception">
                                <Button variant="outline">
                                    <ArrowLeft className="size-4 mr-2" />
                                    Kembali
                                </Button>
                            </Link>
                        )}

                        {navigation?.next && progress.is_completed && (
                            <Link href={`/elearning/reception/${navigation.next.slug}`}>
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
