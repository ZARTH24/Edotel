import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { useForm } from "@inertiajs/react";

export default function CreateMaintenance({ rooms }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { data, setData, post, errors, clearErrors, reset, processing } =
        useForm({
            lokasi: "",
            ruangan: "",
            room_id: "",
            issue: "",

            priority: "medium",
            estimated_cost: "",
        });

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...data,
            room_id: data.lokasi === 'room' ? parseInt(data.room_id, 10) : null,
        };
        post("/Damagereport/add", {
            data: payload,
            onSuccess: () => {
                setIsDialogOpen(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800">
                    <Plus className="size-4 mr-2" />
                    Report Issue
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Report Maintenance Issue</DialogTitle>
                    <DialogDescription>
                        Create a new maintenance request for a room
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="room">
                                Lokasi
                                <span className="text-red-500">*</span>
                            </Label>
                            <div>
                                <Select
                                    value={data.lokasi}
                                    onValueChange={(e) => {
                                        setData("lokasi", e);
                                        clearErrors("lokasi");
                                    }}
                                >
                                    <SelectTrigger
                                        id="room"
                                        className={`${errors.lokasi && "border-red-500 focus-visible:ring-red-500 text-red-500 "}`}
                                    >
                                        <SelectValue placeholder="Choose a location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="room">
                                            Room
                                        </SelectItem>
                                        <SelectItem value="public area">
                                            Public Area
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.lokasi && (
                                    <p className="text-red-500 text-sm ml-1">
                                        {errors.lokasi}
                                    </p>
                                )}
                            </div>
                        </div>

                        {data.lokasi === "room" ? (
                            <div className="space-y-2">
                                <Label htmlFor="room">
                                    Room
                                    <span className="text-red-500">*</span>
                                </Label>
                                <div>
                                    <Select
                                        value={data.room_id}
                                        onValueChange={(e) => {
                                            setData("room_id", e);
                                            clearErrors("room_id");
                                        }}
                                    >
                                        <SelectTrigger
                                            id="room"
                                            className={`${errors.room_id && "border-red-500 focus-visible:ring-red-500 text-red-500 "}`}
                                        >
                                            <SelectValue placeholder="Choose a room" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {rooms.map((room, index) => (
                                                <SelectItem
                                                    key={index}
                                                    value={room.id.toString()}
                                                >
                                                    Room {room.number} -{" "}
                                                    {room.type} (Floor{" "}
                                                    {room.floor})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.room_id && (
                                        <p className="text-red-500 text-sm ml-1">
                                            {errors.room_id}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label htmlFor="ruangan">Area</Label>
                                <div>
                                    <Input
                                        id="ruangan"
                                        type="text"
                                        placeholder="Lobby"
                                        value={data.ruangan}
                                        onChange={(e) => {
                                            setData("ruangan", e.target.value);
                                            clearErrors("ruangan");
                                        }}
                                        className={`${errors.ruangan && "border-red-500 focus-visible:ring-red-500 text-red-500 placeholder:text-red-500"}`}
                                    />
                                    {errors.estimated_cost && (
                                        <p className="text-red-500 text-sm ml-1">
                                            {errors.estimated_cost}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>


                    {/* Issue Description */}
                    <div className="mt-3 space-y-2">
                        <Label htmlFor="issue">
                            Issue Description{" "}
                            <span className="text-red-500">*</span>
                        </Label>

                        <div>
                            <Textarea
                                id="issue"
                                placeholder="Describe the issue in detail..."
                                rows={4}
                                value={data.issue}
                                onChange={(e) => {
                                    setData("issue", e.target.value);
                                    clearErrors("issue");
                                }}
                                className={`${errors.issue && "border-red-500 focus-visible:ring-red-500 text-red-500 placeholder:text-red-500"}`}
                            />
                            {errors.issue && (
                                <p className="text-red-500 text-sm ml-1">
                                    {errors.issue}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Priority Level */}
                    <div className="grid grid-cols-2 gap-4 mt-3">
                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority Level</Label>
                            <div>
                                <Select
                                    value={data.priority}
                                    onValueChange={(e) => {
                                        setData("priority", e);
                                        clearErrors("priority");
                                    }}
                                >
                                    <SelectTrigger
                                        id="priority"
                                        className={`${errors.priority && "border-red-500 focus-visible:ring-red-500 text-red-500 placeholder:text-red-500"}`}
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">
                                            Low - Can wait
                                        </SelectItem>
                                        <SelectItem value="medium">
                                            Medium - Soon
                                        </SelectItem>
                                        <SelectItem value="high">
                                            High - Urgent
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.priority && (
                                    <p className="text-red-500 text-sm ml-1">
                                        {errors.priority}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="estimated-cost">
                                Estimated Cost (Rp.)
                            </Label>
                            <div>
                                <Input
                                    id="estimated-cost"
                                    type="number"
                                    placeholder="0.00"
                                    value={data.estimated_cost}
                                    onChange={(e) => {
                                        setData(
                                            "estimated_cost",
                                            e.target.value,
                                        );
                                        clearErrors("estimated_cost");
                                    }}
                                    className={`${errors.estimated_cost && "border-red-500 focus-visible:ring-red-500 text-red-500 placeholder:text-red-500"}`}
                                />
                                {errors.estimated_cost && (
                                    <p className="text-red-500 text-sm ml-1">
                                        {errors.estimated_cost}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800">
                            Submit Request
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
