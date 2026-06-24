import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Shield } from "lucide-react";
import React, { useEffect, useRef } from "react";

export default function GuestInformation({ click, form, isEdit }) {
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const nationalityRef = useRef(null);
    const idNumberRef = useRef(null);
    const dobRef = useRef(null);
    const addressRef = useRef(null);

    useEffect(() => {
        const firstErrorField = form.errors.name
            ? nameRef
            : form.errors.email
              ? emailRef
              : form.errors.phone
                ? phoneRef
                : form.errors.nationality
                  ? nationalityRef
                  : form.errors.id_number
                    ? idNumberRef
                    : form.errors.date_of_birth
                      ? dobRef
                      : form.errors.address
                        ? addressRef
                        : null;

        if (firstErrorField?.current) {
            // tunda sampai DOM update
            setTimeout(() => firstErrorField.current.focus(), 0);
        }
    }, [form.errors]);
    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle className="text-slate-900">
                    Guest Information
                </CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                    Enter the guest's personal details
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="guest-name">
                            Name
                            <span className="text-red-500">*</span>
                        </Label>
                        <div>
                            <Input
                                ref={nameRef}
                                id="guest-name"
                                placeholder="John Doe"
                                value={form.data.name}
                                onChange={(e) => {
                                    form.setData("name", e.target.value);
                                    form.clearErrors("name");
                                }}
                                className={
                                    form.errors.name &&
                                    "border-red-500 focus-visible:ring-red-500"
                                }
                            />
                            {form.errors.name && (
                                <p className="text-red-500 text-sm ml-1">
                                    {form.errors.name}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div>
                            <Input
                                ref={emailRef}
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                value={form.data.email}
                                onChange={(e) => {
                                    form.setData("email", e.target.value);
                                    form.clearErrors("email");
                                }}
                                className={
                                    form.errors.email &&
                                    "border-red-500 focus-visible:ring-red-500"
                                }
                            />
                            {form.errors.email && (
                                <p className="text-red-500 text-sm ml-1">
                                    {form.errors.email}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone">
                            Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <div>
                            <Input
                                ref={phoneRef}
                                id="phone"
                                placeholder="+1-555-0000"
                                value={form.data.phone}
                                onChange={(e) => {
                                    form.setData("phone", e.target.value);
                                    form.clearErrors("phone");
                                }}
                                className={
                                    form.errors.phone &&
                                    "border-red-500 focus-visible:ring-red-500"
                                }
                            />
                            {form.errors.phone && (
                                <p className="text-red-500 text-sm ml-1">
                                    {form.errors.phone}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nationality">Nationality</Label>
                        <div>
                            <Input
                                ref={nationalityRef}
                                id="nationality"
                                placeholder="United States"
                                value={form.data.nationality}
                                onChange={(e) => {
                                    form.setData("nationality", e.target.value);
                                    form.clearErrors("nationality");
                                }}
                                className={
                                    form.errors.nationality &&
                                    "border-red-500 focus-visible:ring-red-500"
                                }
                            />
                            {form.errors.nationality && (
                                <p className="text-red-500 text-sm ml-1">
                                    {form.errors.nationality}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ID Information */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                    <div className="flex items-center gap-2 text-slate-900">
                        <Shield className="size-4" />
                        <span className="font-medium">
                            Identification Details
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="id-type">
                                ID Type
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={form.data.id_type}
                                onValueChange={(e) => {
                                    form.setData("id_type", e);
                                }}
                            >
                                <SelectTrigger id="id-type">
                                    <SelectValue placeholder="Select Identification Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="passport">
                                        Passport
                                    </SelectItem>
                                    <SelectItem value="national_id">
                                        National ID
                                    </SelectItem>
                                    <SelectItem value="driver_license">
                                        Driver's License
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="id-number">
                                ID Number
                                <span className="text-red-500">*</span>
                            </Label>
                            <div>
                                <Input
                                    ref={idNumberRef}
                                    id="id-number"
                                    placeholder="A12345678"
                                    value={form.data.id_number}
                                    onChange={(e) => {
                                        form.setData(
                                            "id_number",
                                            e.target.value,
                                        );
                                        form.clearErrors("id_number");
                                    }}
                                    className={
                                        form.errors.id_number &&
                                        "border-red-500 focus-visible:ring-red-500"
                                    }
                                />
                                {form.errors.id_number && (
                                    <p className="text-red-500 text-sm ml-1">
                                        {form.errors.id_number}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                            ref={dobRef}
                            id="dob"
                            type="date"
                            value={form.data.date_of_birth}
                            onChange={(e) =>
                                form.setData("date_of_birth", e.target.value)
                            }
                            className={
                                form.errors.date_of_birth &&
                                "border-red-500 focus-visible:ring-red-500"
                            }
                        />
                        {form.errors.date_of_birth && (
                            <p className="text-red-500 text-sm ml-1">
                                {form.errors.date_of_birth}
                            </p>
                        )}
                    </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                    <Label htmlFor="address">
                        Address
                        <span className="text-red-500">*</span>
                    </Label>
                    <div>
                        <Textarea
                            ref={addressRef}
                            id="address"
                            placeholder="Full address..."
                            rows={3}
                            value={form.data.address}
                            onChange={(e) => {
                                form.setData("address", e.target.value);
                                form.clearErrors("address");
                            }}
                            className={
                                form.errors.address &&
                                "border-red-500 focus-visible:ring-red-500"
                            }
                        />
                        {form.errors.address && (
                            <p className="text-red-500 text-sm ml-1">
                                {form.errors.address}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        onClick={() => {
                            if (isEdit) {
                                click();
                            } else {
                                form.post("/Frontoffice/validate-guest", {
                                    onSuccess: () => click(),
                                });
                            }
                        }}
                        className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
                        disabled={
                            !form.data.name ||
                            !form.data.phone ||
                            !form.data.id_number ||
                            !form.data.address
                        }
                    >
                        Continue to Room Selection
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
