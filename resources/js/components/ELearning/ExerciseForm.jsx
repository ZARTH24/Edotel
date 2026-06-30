import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    CheckCircle,
    XCircle,
    FileText,
    Image as ImageIcon,
    RefreshCw,
    Send,
    Loader2,
} from "lucide-react";

export default function ExerciseForm({
    exerciseSlug,
    initialData = {},
    validationResult = null,
    onSubmit,
    onReset,
    isSubmitting = false,
}) {
    const [fields, setFields] = useState([]);
    const [clues, setClues] = useState({});
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch form configuration
    useEffect(() => {
        if (!exerciseSlug) return;

        fetch(`/elearning/api/form/${exerciseSlug}`)
            .then((res) => res.json())
            .then((data) => {
                setFields(data.fields || []);
                setClues(data.clues || {});

                // Initialize form data with field names
                const initialFormData = {};
                data.fields?.forEach((field) => {
                    initialFormData[field.name] = initialData[field.name] || "";
                });
                setFormData(initialFormData);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch form config:", err);
                setLoading(false);
            });
    }, [exerciseSlug]);

    const handleChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.(formData);
    };

    const handleReset = () => {
        const resetData = {};
        fields.forEach((field) => {
            resetData[field.name] = "";
        });
        setFormData(resetData);
        onReset?.();
    };

    const isFieldWrong = (fieldName) => {
        return validationResult?.wrong_fields?.includes(fieldName);
    };

    if (loading) {
        return (
            <Card className="border-slate-200">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="size-8 animate-spin text-amber-500" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-slate-200">
            <CardHeader>
                <CardTitle className="text-lg">Isi Form Berikut</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Validation Error Banner */}
                    {validationResult && !validationResult.is_correct && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                            <div className="flex items-start gap-3">
                                <XCircle className="size-5 text-red-500 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="font-medium text-red-700">
                                        Ada {validationResult.wrong_fields?.length || 0} jawaban yang salah
                                    </h4>
                                    <ul className="mt-2 space-y-1 text-sm text-red-600">
                                        {validationResult.wrong_fields?.map((field, index) => (
                                            <li key={index}>• {field}</li>
                                        ))}
                                    </ul>
                                    {validationResult.clues && Object.keys(validationResult.clues).length > 0 && (
                                        <div className="mt-4 p-3 bg-white rounded border border-red-200">
                                            <h5 className="font-medium text-red-700 mb-2">Clue:</h5>
                                            <ul className="space-y-1 text-sm">
                                                {validationResult.wrong_fields?.map((field, index) => (
                                                    clues[field] && (
                                                        <li key={index} className="text-slate-600">
                                                            <span className="font-medium capitalize">
                                                                {field.replace(/_/g, " ")}:
                                                            </span>{" "}
                                                            {clues[field]}
                                                        </li>
                                                    )
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Success Banner */}
                    {validationResult?.is_correct && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="size-5 text-green-500" />
                                <div>
                                    <h4 className="font-medium text-green-700">
                                        Semua jawaban benar!
                                    </h4>
                                    <p className="text-sm text-green-600">
                                        Latihan selesai. Klik tombol di bawah untuk melanjutkan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fields.map((field) => (
                            <div
                                key={field.name}
                                className={
                                    field.type === "textarea"
                                        ? "col-span-2"
                                        : ""
                                }
                            >
                                <Label
                                    htmlFor={field.name}
                                    className={`${
                                        isFieldWrong(field.name)
                                            ? "text-red-600"
                                            : ""
                                    }`}
                                >
                                    {field.label}
                                    {field.required && (
                                        <span className="text-red-500 ml-1">*</span>
                                    )}
                                    {isFieldWrong(field.name) && (
                                        <XCircle className="inline size-4 ml-2 text-red-500" />
                                    )}
                                </Label>

                                {field.type === "select" ? (
                                    <Select
                                        value={formData[field.name] || ""}
                                        onValueChange={(value) =>
                                            handleChange(field.name, value)
                                        }
                                    >
                                        <SelectTrigger
                                            id={field.name}
                                            className={
                                                isFieldWrong(field.name)
                                                    ? "border-red-500 focus:border-red-500"
                                                    : ""
                                            }
                                        >
                                            <SelectValue placeholder={`Pilih ${field.label}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {field.options?.map((option) => (
                                                <SelectItem
                                                    key={option}
                                                    value={option}
                                                >
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : field.type === "textarea" ? (
                                    <Textarea
                                        id={field.name}
                                        value={formData[field.name] || ""}
                                        onChange={(e) =>
                                            handleChange(field.name, e.target.value)
                                        }
                                        placeholder={`Masukkan ${field.label}`}
                                        className={
                                            isFieldWrong(field.name)
                                                ? "border-red-500 focus:border-red-500"
                                                : ""
                                        }
                                    />
                                ) : (
                                    <Input
                                        id={field.name}
                                        type={field.type || "text"}
                                        value={formData[field.name] || ""}
                                        onChange={(e) =>
                                            handleChange(field.name, e.target.value)
                                        }
                                        placeholder={`Masukkan ${field.label}`}
                                        className={
                                            isFieldWrong(field.name)
                                                ? "border-red-500 focus:border-red-500"
                                                : ""
                                        }
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Form actions */}
                    <div className="flex justify-between pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                        >
                            <RefreshCw className="size-4 mr-2" />
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="size-4 mr-2 animate-spin" />
                                    Submitting...
                                </>
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
    );
}
