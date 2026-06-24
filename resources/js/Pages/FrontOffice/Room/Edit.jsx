import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Trash2, X } from "lucide-react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Layout from "@/components/Layout/Layout";

export default function Edit({ room }) {
    const { data, setData, put, errors, clearErrors, processing } = useForm({
        number: room?.number || "",
        type: room?.type || "",
        floor: room?.floor || "",
        price: room?.price || "",
        features: Array.isArray(room?.features) ? room.features : [""],
    });

    // 2. Tambahkan pengecekan jika room tidak ada
    if (!room) {
        return <div className="p-6">Loading room data...</div>;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mengirim data menggunakan method PUT ke backend Laravel
        put(`/Frontoffice/updateroom/${room.id}`);
    };

    const handleAddFeature = () => {
        setData((prev) => ({
            ...prev,
            features: [...prev.features, ""],
        }));
    };

    const handleRemoveFeature = (index) => {
        if (data.features.length > 1) {
            setData((prev) => ({
                ...prev,
                features: prev.features.filter((_, i) => i !== index),
            }));
        }
    };

    const handleFeatureChange = (index, value) => {
        setData((prev) => ({
            ...prev,
            features: prev.features.map((feature, i) =>
                i === index ? value : feature,
            ),
        }));
    };

    return (
        <>
            <Head title="Edit Room" />
            <Layout>
                <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50/30 p-6">
                    <div className="max-w-3xl mx-auto">
                        {/* Header */}
                        <div className="mb-6">
                            <Link
                                href={`/Frontoffice`}
                                className="flex items-center gap-2 pl-2 mb-2 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 w-20 rounded"
                            >
                                <ArrowLeft className="size-4" />
                                Back
                            </Link>
                            <div>
                                <h1 className="font-serif text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                                    Edit Room Information
                                </h1>
                                <p className="text-muted-foreground mt-1">
                                    Modify the details below to update Room{" "}
                                    {room?.number} configuration.
                                </p>
                            </div>
                        </div>

                        {/* Form Card */}
                        <Card className="border-amber-200/50 shadow-lg">
                            <CardHeader>
                                <CardTitle>Room Information</CardTitle>
                                <CardDescription>
                                    Fill in the details below to add a new room
                                    to the system
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form
                                    className="space-y-6"
                                    onSubmit={handleSubmit}
                                >
                                    {/* Room Number */}
                                    <div className="space-y-2">
                                        <Label htmlFor="number">
                                            Room Number *
                                        </Label>
                                        <div>
                                            <Input
                                                id="number"
                                                value={data.number}
                                                placeholder="e.g., 101, 202"
                                                onChange={(e) => {
                                                    setData(
                                                        "number",
                                                        e.target.value,
                                                    );
                                                    clearErrors("number");
                                                }}
                                                className={`border ${
                                                    errors.number
                                                        ? "border-red-500 focus-visible:ring-red-500"
                                                        : "border-amber-300 focus-visible:ring-amber-500"
                                                }`}
                                            />
                                            {errors.number && (
                                                <p className="text-red-500 text-sm ml-1">
                                                    {errors.number}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Room Type */}
                                    <div className="space-y-2">
                                        <Label htmlFor="type">
                                            Room Type *
                                        </Label>
                                        <Select
                                            value={data.type}
                                            onValueChange={(e) =>
                                                setData("type", e)
                                            }
                                        >
                                            <SelectTrigger className="border-amber-300 focus:ring-amber-500">
                                                <SelectValue placeholder="Choose a room type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="deluxe">
                                                    Deluxe Room
                                                </SelectItem>
                                                <SelectItem value="super deluxe">
                                                    Super Deluxe Room
                                                </SelectItem>
                                                <SelectItem value="superior">
                                                    Superior Room
                                                </SelectItem>
                                                <SelectItem value="standard fan">
                                                    Standard Fan Room
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.type && (
                                            <p className="text-red-500 text-sm ml-1">
                                                {errors.type}
                                            </p>
                                        )}
                                    </div>

                                    {/* Floor and Price Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Floor */}
                                        <div className="space-y-2">
                                            <Label htmlFor="floor">
                                                Floor *
                                            </Label>
                                            <div>
                                                <Input
                                                    id="floor"
                                                    type="text"
                                                    value={data.floor}
                                                    onChange={(e) => {
                                                        setData(
                                                            "floor",
                                                            e.target.value,
                                                        );
                                                        clearErrors("floor");
                                                    }}
                                                    placeholder="e.g., 1, 2"
                                                    className={`border ${
                                                        errors.floor
                                                            ? "border-red-500 focus-visible:ring-red-500"
                                                            : "border-amber-300 focus-visible:ring-amber-500"
                                                    }`}
                                                />
                                                {errors.floor && (
                                                    <p className="text-red-500 text-sm ml-1">
                                                        {errors.floor}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="space-y-2">
                                            <Label htmlFor="price">
                                                Price per Night (Rp) *
                                            </Label>
                                            <div>
                                                <Input
                                                    id="price"
                                                    type="text"
                                                    value={data.price}
                                                    onChange={(e) => {
                                                        setData(
                                                            "price",
                                                            e.target.value,
                                                        );
                                                        clearErrors("price");
                                                    }}
                                                    placeholder="e.g., 500000"
                                                    className={`border ${
                                                        errors.price
                                                            ? "border-red-500 focus-visible:ring-red-500"
                                                            : "border-amber-300 focus-visible:ring-amber-500"
                                                    }`}
                                                />
                                                {errors.price && (
                                                    <p className="text-red-500 text-sm ml-1">
                                                        {errors.price}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Features Section */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label>Room Features *</Label>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleAddFeature}
                                                className="border-amber-300 text-amber-700 hover:bg-amber-50"
                                            >
                                                <X className="size-4 rotate-45 mr-1" />
                                                Add Feature
                                            </Button>
                                        </div>

                                        <div className="space-y-2">
                                            {data.features.map(
                                                (feature, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex gap-2"
                                                    >
                                                        <Input
                                                            placeholder="e.g., King Size Bed, Ocean View"
                                                            value={feature}
                                                            onChange={(e) =>
                                                                handleFeatureChange(
                                                                    index,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="border-amber-300 focus-visible:ring-amber-500"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleRemoveFeature(
                                                                    index,
                                                                )
                                                            }
                                                            disabled={
                                                                data.features
                                                                    .length ===
                                                                1
                                                            }
                                                            className="border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-30"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
                                        >
                                            <Save className="size-4 mr-2" />
                                            {processing
                                                ? "Updating..."
                                                : "Update Changes"}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="border-slate-300"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Info Card */}
                        <Card className="mt-4 border-blue-200/50 bg-blue-50/50">
                            <CardContent className="pt-6">
                                <p className="text-sm text-blue-900">
                                    <strong>Note:</strong> New rooms will be set
                                    to "Available" status by default. You can
                                    change the status later from the Front
                                    Office or Housekeeping modules.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Layout>
        </>
    );
}
