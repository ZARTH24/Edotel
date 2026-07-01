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

                {/* Detail Dialog */}
                <Dialog open={!!selectedForm} onOpenChange={() => setSelectedForm(null)}>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <FileText className="size-5" />
                                Detail Jawaban Siswa
                            </DialogTitle>
                        </DialogHeader>
                        {selectedForm && (
                            <div className="space-y-4">
                                {/* Student Info */}
                                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="text-sm text-slate-500">Nama Siswa</p>
                                        <p className="font-medium">{selectedForm.student_name || 'Unknown'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Kelas</p>
                                        <p className="font-medium">{selectedForm.student_kelas || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Form</p>
                                        <p className="font-medium">{selectedForm.exercise_title || 'Unknown'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Kategori</p>
                                        <p className="font-medium capitalize">{selectedForm.exercise_category || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Score</p>
                                        <p className="font-medium">{selectedForm.score || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Attempt</p>
                                        <p className="font-medium">#{selectedForm.attempt || 1}</p>
                                    </div>
                                </div>

                                {/* Submitted At */}
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Calendar className="size-4" />
                                    <span>Disubmit pada: {formatDate(selectedForm.submitted_at)}</span>
                                </div>

                                {/* Answers */}
                                <div className="border rounded-lg">
                                    <div className="p-3 bg-slate-100 border-b">
                                        <h4 className="font-medium">Jawaban yang Diberikan</h4>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        {Object.entries(selectedForm.answers || {}).map(([key, value]) => (
                                            <div key={key} className="border-b pb-3 last:border-b-0 last:pb-0">
                                                <p className="text-sm text-slate-500 mb-1">
                                                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </p>
                                                <p className="font-medium text-slate-900 whitespace-pre-wrap">
                                                    {Array.isArray(value) ? value.join(', ') : value || '-'}
                                                </p>
                                            </div>
                                        ))}
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
