import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DocumentPreview({
    documentPath,
    exerciseSlug,
    category = "reception",
    isVisible = true,
    onToggle,
}) {
    // Generate image path based on exercise slug
    // Image should be placed in public/assets/forms/{category}/{slug}.png
    const imagePath = `/assets/forms/${category}/${exerciseSlug}.png`;

    return (
        <Card className="border-slate-200">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="size-5" />
                        Document Preview
                    </CardTitle>
                    {onToggle && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onToggle}
                        >
                            {isVisible ? (
                                <>
                                    <EyeOff className="size-4 mr-2" />
                                    Hide
                                </>
                            ) : (
                                <>
                                    <Eye className="size-4 mr-2" />
                                    Show
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {isVisible ? (
                    <div className="space-y-4">
                        {/* Image Preview */}
                        <div className="relative">
                            <img
                                src={imagePath}
                                alt={`${exerciseSlug} form preview`}
                                className="w-full rounded-lg border border-slate-200"
                                onError={(e) => {
                                    // If image not found, show placeholder
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                }}
                            />
                            {/* Placeholder when image not found */}
                            <div
                                className="hidden bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg aspect-[3/4] flex-col items-center justify-center text-center p-4"
                            >
                                <ImageIcon className="size-12 text-slate-400 mb-2" />
                                <p className="text-sm text-slate-500 font-medium">
                                    Preview Gambar
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    {imagePath}
                                </p>
                                <p className="text-xs text-slate-400 mt-4 max-w-xs">
                                    Tambahkan gambar form ke folder:
                                    <br />
                                    <code className="text-amber-600">
                                        public/assets/forms/{category}/
                                    </code>
                                </p>
                            </div>
                        </div>

                        {/* Document Path Info */}
                        <div className="text-xs text-slate-400 text-center">
                            <p>Referensi: {documentPath}</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
                        <FileText className="size-12 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">
                            Document preview tersembunyi
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            Klik "Show" untuk melihat preview
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
