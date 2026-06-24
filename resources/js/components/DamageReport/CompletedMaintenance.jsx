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
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { useForm } from "@inertiajs/react";
import { Label } from "@/components/ui/label";

export default function CompletedMaintenance({ id, estimated_cost }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { data, setData, post, errors, clearErrors, processing } = useForm({
        resolution_notes: "",
        actual_cost: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(`/Damagereport/${id}/completed`);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    className="px-3 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                    Completed
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Complete Maintenance Task</DialogTitle>
                    <DialogDescription>
                        Add resolution notes, actual cost, and mark this
                        maintenance task as completed.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="resolution_notes">
                                Solution Description{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="resolution_notes"
                                placeholder="Describe the resolution_notes in detail..."
                                rows={4}
                                value={data.resolution_notes}
                                onChange={(e) => {
                                    setData("resolution_notes", e.target.value);
                                    clearErrors("resolution_notes");
                                }}
                            />
                        </div>

                        {estimated_cost && (
                            <div className="space-y-2">
                                <Label htmlFor="actual-cost">
                                    Actual Cost (Rp.)
                                </Label>
                                <Input
                                    id="actual-cost"
                                    type="number"
                                    placeholder="0.00"
                                    value={data.actual_cost}
                                    onChange={(e) => {
                                        setData("actual_cost", e.target.value);
                                        clearErrors("actual_cost");
                                    }}
                                />
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                                Completed
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
