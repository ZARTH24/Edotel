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
import { PlayCircle } from "lucide-react";

export default function AssignCleaning({ taskId, users }) {
    const { data, setData, post, errors, clearErrors, processing, reset } =
        useForm({
            assigned_to: "",
        });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/cleaning-tasks/${taskId}/assign`, {
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
                    className="border-yellow-300 text-yellow-700 hover:bg-green-50 px-4 py-3"
                >
                    <PlayCircle className="size-3 mr-1" />
                    Start
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Start Cleaning Task</DialogTitle>
                    <DialogDescription>
                        Assign a staff member and begin cleaning for the
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
                            <Button className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800">
                                Start
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
