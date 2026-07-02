import React, { useState } from "react";
import Layout from "@/components/Layout/Layout";
import {
    FileText,
    Filter,
    ChevronRight,
    ChevronLeft,
    User,
    Calendar,
    ClipboardList,
    CalendarCheck,
    X,
    Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Head } from "@inertiajs/react";

export default function HasilFormSiswa({ submittedForms = {}, students = [], forms = [], filters = {} }) {
    const [selectedForm, setSelectedForm] = useState(null);

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'reception':
                return <ClipboardList className="size-4" />;
            case 'reservation':
                return <CalendarCheck className="size-4" />;
            default:
                return <FileText className="size-4" />;
        }
    };

    const getScoreBadge = (score) => {
        const className = score >= 80
            ? 'bg-green-100 text-green-700 border-green-200'
            : score >= 60
            ? 'bg-amber-100 text-amber-700 border-amber-200'
            : 'bg-red-100 text-red-700 border-red-200';
        return <Badge className={className}>{score}</Badge>;
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formsData = submittedForms.data || [];
    const currentPage = submittedForms.current_page || 1;
    const lastPage = submittedForms.last_page || 1;
    const perPage = submittedForms.per_page || 20;
    const total = submittedForms.total || 0;

    return (
        <>
            <Head title="Hasil Form Siswa" />

            <Layout>
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h2 className="text-3xl font-serif text-slate-900 dark:text-slate-100">
                            Hasil Form Siswa
                        </h2>
                        <p className="text-slate-600 mt-1">
                            Lihat hasil form yang telah disubmit oleh siswa
                        </p>
                    </div>

                    {/* Filters */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-slate-900">Filter</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form method="GET" className="flex flex-wrap gap-4">
                                <div className="w-[200px]">
                                    <Select name="student_id" defaultValue={filters.student_id || "all"}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Siswa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Siswa</SelectItem>
                                            {students.map((student) => (
                                                <SelectItem key={student.id} value={student.id.toString()}>
                                                    {student.name} ({student.kelas})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-[150px]">
                                    <Select name="category" defaultValue={filters.category || "all"}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Kategori</SelectItem>
                                            <SelectItem value="reception">Reception</SelectItem>
                                            <SelectItem value="reservation">Reservation</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <Select name="form" defaultValue={filters.form || "all"}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Form" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Form</SelectItem>
                                            {forms.map((form) => (
                                                <SelectItem key={form.id} value={form.title}>
                                                    {form.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="submit" className="bg-gradient-to-r from-amber-500 to-amber-600">
                                    <Filter className="size-4 mr-2" />
                                    Filter
                                </Button>
                                {(filters.student_id && filters.student_id !== "all") || (filters.category && filters.category !== "all") || (filters.form && filters.form !== "all") ? (
                                    <a href="/elearning/hasil-form-siswa">
                                        <Button type="button" variant="outline">
                                            <X className="size-4 mr-2" />
                                            Reset
                                        </Button>
                                    </a>
                                ) : null}
                            </form>
                        </CardContent>
                    </Card>

                    {/* Results List - Card Based Layout */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-slate-900">
                                Hasil Form ({total} submit)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {formsData.length === 0 ? (
                                <p className="text-center py-8 text-slate-500">
                                    Tidak ada hasil form ditemukan
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {formsData.map((form, index) => (
                                        <div
                                            key={form.id}
                                            className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                                {/* Form Info */}
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-blue-700 font-semibold text-lg">
                                                            {(currentPage - 1) * perPage + index + 1}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                                            <h4 className="font-semibold text-slate-900">
                                                                {form.exercise_title || 'Unknown'}
                                                            </h4>
                                                            <Badge variant="outline" className="flex items-center gap-1">
                                                                {getCategoryIcon(form.exercise_category)}
                                                                <span className="capitalize">{form.exercise_category || '-'}</span>
                                                            </Badge>
                                                            {getScoreBadge(form.score || 0)}
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-slate-600">
                                                            <div className="flex items-center gap-1">
                                                                <User className="size-3" />
                                                                <span>{form.student_name || 'Unknown'}</span>
                                                            </div>
                                                            <span>|</span>
                                                            <span>{form.student_kelas || '-'}</span>
                                                            <span>|</span>
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="size-3" />
                                                                <span>{formatDate(form.submitted_at)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action */}
                                                <div className="flex-shrink-0">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setSelectedForm(form)}
                                                    >
                                                        <Eye className="size-4 mr-1" />
                                                        Lihat Detail
                                                        <ChevronRight className="size-4 ml-1" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {lastPage > 1 && (
                                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                                    <p className="text-sm text-slate-500">
                                        Halaman {currentPage} dari {lastPage}
                                    </p>
                                    <div className="flex gap-2">
                                        {currentPage > 1 && (
                                            <a href={`?page=${currentPage - 1}${filters.student_id && filters.student_id !== "all" ? '&student_id=' + filters.student_id : ''}${filters.category && filters.category !== "all" ? '&category=' + filters.category : ''}${filters.form && filters.form !== "all" ? '&form=' + filters.form : ''}`}>
                                                <Button variant="outline" size="sm">
                                                    <ChevronLeft className="size-4 mr-1" />
                                                    Previous
                                                </Button>
                                            </a>
                                        )}
                                        {currentPage < lastPage && (
                                            <a href={`?page=${currentPage + 1}${filters.student_id && filters.student_id !== "all" ? '&student_id=' + filters.student_id : ''}${filters.category && filters.category !== "all" ? '&category=' + filters.category : ''}${filters.form && filters.form !== "all" ? '&form=' + filters.form : ''}`}>
                                                <Button variant="outline" size="sm">
                                                    Next
                                                    <ChevronRight className="size-4 ml-1" />
                                                </Button>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Detail Dialog - Side by Side */}
                <Dialog open={!!selectedForm} onOpenChange={() => setSelectedForm(null)}>
                    <DialogContent
                    className="!max-w-[98vw] !w-[98vw] !max-h-[98vh] !h-[98vh] overflow-hidden flex flex-col !p-4 !rounded-xl"
                    style={{ maxWidth: '98vw', width: '98vw', maxHeight: '98vh', height: '98vh' }}
                >
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <FileText className="size-5" />
                                Detail Jawaban Siswa
                            </DialogTitle>
                        </DialogHeader>
                        {selectedForm && (
                            <div className="flex-1 overflow-hidden flex flex-col gap-4 min-h-0">
                                {/* Student Info - Compact */}
                                <div className="grid grid-cols-4 gap-4 p-3 bg-slate-50 rounded-lg text-sm">
                                    <div>
                                        <p className="text-xs text-slate-500">Siswa</p>
                                        <p className="font-medium">{selectedForm.student_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Kelas</p>
                                        <p className="font-medium">{selectedForm.student_kelas}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Form</p>
                                        <p className="font-medium">{selectedForm.exercise_title}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Score</p>
                                        <Badge className={selectedForm.score >= 80 ? 'bg-green-100 text-green-700' : selectedForm.score >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}>
                                            {selectedForm.score}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Side-by-Side: Study Case & Answers */}
                                <div className="flex-1 overflow-hidden flex gap-4 min-h-0" style={{height: 'calc(100vh - 280px)'}}>
                                    {/* LEFT: Study Case (Teks) */}
                                    <div className="flex-1 overflow-hidden border rounded-lg bg-blue-50 flex flex-col">
                                        <div className="p-3 bg-blue-100 border-b flex-shrink-0">
                                            <h4 className="font-medium text-blue-900 flex items-center gap-2">
                                                📋 Studi Kasus
                                            </h4>
                                            {selectedForm.study_case_title && (
                                                <p className="text-xs text-blue-700 mt-0.5">
                                                    {selectedForm.study_case_title}
                                                </p>
                                            )}
                                        </div>
                                        <div className="p-4 overflow-y-auto flex-1">
                                            {selectedForm.study_case_content ? (
                                                <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                                                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-mono">
                                                        {selectedForm.study_case_content}
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-slate-500 text-center py-8">
                                                    Studi kasus tidak tersedia
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* RIGHT: Student Answers */}
                                    <div className="flex-1 overflow-hidden border rounded-lg bg-white flex flex-col">
                                        <div className="p-3 bg-amber-100 border-b flex-shrink-0">
                                            <h4 className="font-medium text-amber-900 flex items-center gap-2">
                                                📝 Jawaban Siswa
                                            </h4>
                                        </div>
                                        <div className="p-4 overflow-y-auto flex-1 space-y-2">
                                            {(selectedForm.form_fields || []).length > 0 ? (
                                                selectedForm.form_fields.map((field, idx) => {
                                                    const studentAnswer = selectedForm.answers?.[field.name];
                                                    const displayValue = Array.isArray(studentAnswer)
                                                        ? studentAnswer.join(', ')
                                                        : studentAnswer || '-';

                                                    return (
                                                        <div key={field.name} className="bg-slate-50 p-3 rounded-lg">
                                                            <div className="flex items-start gap-2">
                                                                <div className="flex-shrink-0 w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                                                                    <span className="text-amber-700 text-xs font-semibold">
                                                                        {idx + 1}
                                                                    </span>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs font-medium text-slate-600 mb-0.5">
                                                                        {field.label}
                                                                    </p>
                                                                    <p className="text-sm text-slate-900 whitespace-pre-wrap break-words">
                                                                        {displayValue}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                Object.entries(selectedForm.answers || {}).map(([key, value]) => (
                                                    <div key={key} className="bg-slate-50 p-3 rounded-lg">
                                                        <p className="text-xs font-medium text-slate-600 mb-0.5">
                                                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                        </p>
                                                        <p className="text-sm text-slate-900 whitespace-pre-wrap">
                                                            {Array.isArray(value) ? value.join(', ') : value || '-'}
                                                        </p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </Layout>
        </>
    );
}
