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
import { PlayCircle, UserSearch } from "lucide-react";

export default function InspectCleaningTask({ taskId, users }) {
    const { data, setData, post, errors, clearErrors, processing, reset } =
        useForm({
            inspected_by: "",
        });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/cleaning-tasks/${taskId}/inspected`, {
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
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                    <UserSearch className="size-3 mr-1" />
                    Inspect
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Inspect Cleaning Task</DialogTitle>
                    <DialogDescription>
                        Review the completed cleaning task and confirm the room
                        is ready for use.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="staff">Inspector</Label>
                            <div>
                                <Select
                                    onValueChange={(value) => {
                                        setData("inspected_by", value);
                                        clearErrors("inspected_by");
                                    }}
                                >
                                    <SelectTrigger
                                        className={`${errors.inspected_by && "border-red-500 focus-visible:ring-red-500 text-red-500 placeholder:text-red-500"}`}
                                    >
                                        <SelectValue placeholder="Select inspector" />
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
                                Inspect
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
