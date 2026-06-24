import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "@inertiajs/react";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AssignMaintenanceTask({ taskId, users }) {
    const { data, setData, post, errors, clearErrors, processing, reset } =
        useForm({
            assigned_to: "",
        });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/Damagereport/${taskId}/assign`, {
            onSuccess: () => {
                reset();
            },
        });
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                    Assign
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Start Maintenance Task</DialogTitle>
                    <DialogDescription>
                        Assign a staff member and begin maintenance for the
                        selected room.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="staff">Assign to Staff</Label>
                            <div>
                                <Select
                                    onValueChange={(value) => {
                                        setData("assigned_to", value);
                                        clearErrors("assigned_to");
                                    }}
                                >
                                    <SelectTrigger
                                        className={`${errors.assigned_to && "border-red-500 focus-visible:ring-red-500 text-red-500 placeholder:text-red-500"}`}
                                    >
                                        <SelectValue placeholder="Select staff member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem
                                                key={user.id}
                                                value={user.id.toString()}
                                            >
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.assigned_to && (
                                    <p className="text-red-500 text-sm ml-1">
                                        {errors.assigned_to}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                Assign
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
