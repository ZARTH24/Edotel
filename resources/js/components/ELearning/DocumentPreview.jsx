import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Image as ImageIcon, ChevronLeft, ChevronRight, Eye, EyeOff, ZoomIn, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DocumentPreview({
    images = [],
    documentPath,
    isVisible = true,
    onToggle,
}) {
    const [currentPage, setCurrentPage] = useState(0);
    const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(100);

    const totalPages = images.length;

    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
    };

    const handleZoomIn = () => {
        setZoomLevel((prev) => Math.min(200, prev + 25));
    };

    const handleZoomOut = () => {
        setZoomLevel((prev) => Math.max(50, prev - 25));
    };

    const handleResetZoom = () => {
        setZoomLevel(100);
    };

    return (
        <>
            <Card className="border-slate-200">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="size-5" />
                            Document Preview
                            {totalPages > 1 && (
                                <span className="text-sm text-slate-400 font-normal ml-2">
                                    ({currentPage + 1}/{totalPages})
                                </span>
                            )}
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
                                {images.length > 0 ? (
                                    <>
                                        <div className="relative group cursor-pointer" onClick={() => setIsZoomModalOpen(true)}>
                                            <img
                                                key={currentPage}
                                                src={images[currentPage]}
                                                alt={`Form preview page ${currentPage + 1}`}
                                                className="w-full rounded-lg border border-slate-200 transition-transform hover:scale-[1.02]"
                                            />
                                            {/* Zoom overlay hint */}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg flex items-center justify-center transition-colors">
                                                <div className="bg-white/90 px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 shadow-lg">
                                                    <ZoomIn className="size-4" />
                                                    <span className="text-sm font-medium">Klik untuk Zoom</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Page Navigation */}
                                        {totalPages > 1 && (
                                            <div className="flex items-center justify-center gap-4 mt-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handlePrev}
                                                    disabled={currentPage === 0}
                                                >
                                                    <ChevronLeft className="size-4 mr-1" />
                                                    Prev
                                                </Button>
                                                <span className="text-sm text-slate-500">
                                                    Page {currentPage + 1} of {totalPages}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleNext}
                                                    disabled={currentPage === totalPages - 1}
                                                >
                                                    Next
                                                    <ChevronRight className="size-4 ml-1" />
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    /* Placeholder when no images */
                                    <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg aspect-[3/4] flex flex-col items-center justify-center text-center p-4">
                                        <ImageIcon className="size-12 text-slate-400 mb-2" />
                                        <p className="text-sm text-slate-500 font-medium">
                                            Preview Gambar
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Gambar belum tersedia
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Document Path Info */}
                            {documentPath && (
                                <div className="text-xs text-slate-400 text-center">
                                    <p>Referensi: {documentPath}</p>
                                </div>
                            )}
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

            {/* Zoom Modal */}
            {isZoomModalOpen && images.length > 0 && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-5xl h-full flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white text-lg font-medium">
                                Preview - Halaman {currentPage + 1} dari {totalPages}
                            </h3>
                            <div className="flex items-center gap-2">
                                {/* Zoom Controls */}
                                <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1 mr-4">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleZoomOut}
                                        className="text-white hover:bg-white/20"
                                    >
                                        <span className="text-lg">−</span>
                                    </Button>
                                    <span className="text-white text-sm w-16 text-center">
                                        {zoomLevel}%
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleZoomIn}
                                        className="text-white hover:bg-white/20"
                                    >
                                        <span className="text-lg">+</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleResetZoom}
                                        className="text-white hover:bg-white/20 text-xs"
                                    >
                                        Reset
                                    </Button>
                                </div>

                                {/* Navigation */}
                                {totalPages > 1 && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handlePrev}
                                            disabled={currentPage === 0}
                                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                                        >
                                            <ChevronLeft className="size-4 mr-1" />
                                            Prev
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleNext}
                                            disabled={currentPage === totalPages - 1}
                                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                                        >
                                            Next
                                            <ChevronRight className="size-4 ml-1" />
                                        </Button>
                                    </>
                                )}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsZoomModalOpen(false)}
                                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 ml-4"
                                >
                                    <X className="size-4 mr-2" />
                                    Tutup
                                </Button>
                            </div>
                        </div>

                        {/* Image Container */}
                        <div className="flex-1 overflow-auto flex items-center justify-center bg-black/50 rounded-lg">
                            <img
                                src={images[currentPage]}
                                alt={`Form preview page ${currentPage + 1}`}
                                style={{
                                    transform: `scale(${zoomLevel / 100})`,
                                    transition: "transform 0.2s ease",
                                    maxHeight: "100%",
                                    maxWidth: "100%",
                                }}
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
