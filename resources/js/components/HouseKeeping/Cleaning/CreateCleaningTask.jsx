import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@inertiajs/react";
import { Plus } from "lucide-react";
import React, { useState } from "react";

export default function CreateCleaningTask({ rooms }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { data, setData, post, processing, errors, clearErrors, reset } =
        useForm({
            room_id: "",
            priority: "",
            notes: "",
        });

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...data,
            room_id: parseInt(data.room_id, 10), // pastikan integer
        };

        post("/Housekeeping/cleaning-task", {
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
                <Button
                    variant="outline"
                    className="border-amber-200 text-amber-700 hover:bg-amber-50 p-4 py-5"
                >
                    <Plus className="size-4 mr-2" />
                    Cleaning Task
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign Cleaning Task</DialogTitle>
                    <DialogDescription>
                        Assign a cleaning task to a staff member.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="room">Room</Label>
                            <div>
                                <Select
                                    onValueChange={(value) => {
                                        setData("room_id", value);
                                        clearErrors("room_id");
                                    }}
                                >
                                    <SelectTrigger
                                        className={`${errors.room_id && "border-red-500 focus-visible:ring-red-500 text-red-500 placeholder:text-red-500"}`}
                                    >
                                        <SelectValue placeholder="Select room" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rooms
                                            .filter(
                                                (room) =>
                                                    room.status !==
                                                        "cleaning" &&
                                                    room.status !==
                                                        "maintenance",
                                            ) // filter room
                                            .map((room) => (
                                                <SelectItem
                                                    key={room.id}
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
                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <div>
                                <Select
                                    onValueChange={(value) => {
                                        setData("priority", value);
                                        clearErrors("priority");
                                    }}
                                >
                                    <SelectTrigger
                                        className={`${errors.priority && "border-red-500 focus-visible:ring-red-500 text-red-500 placeholder:text-red-500"}`}
                                    >
                                        <SelectValue placeholder="Select priority" />
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
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                placeholder="Any special instructions..."
                                value={data.notes}
                                onChange={(e) =>
                                    setData("notes", e.target.value)
                                }
                            />
                        </div>
                        <Button
                            disabled={processing}
                            //  type="submit"
                            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                        >
                            {processing ? "Saving..." : "Create Task"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
