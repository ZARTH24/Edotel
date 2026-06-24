import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { router, useForm } from "@inertiajs/react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Save, X } from "lucide-react";
import { useState } from "react";

export default function EditProfile({ user }) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const { data, setData, put, processing, errors, clearErrors, reset } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: "",
    });

    const handleUpdate = (e) => {
        e.preventDefault();
        put(`/profile/${user.id}`, {
            onSuccess: () => {
                setIsEditDialogOpen(false);
                reset();
            },
        });
    };
    return (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white">
                    <Edit className="size-4 mr-2" />
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-serif">
                        Edit Profile
                    </DialogTitle>
                    <DialogDescription>
                        Update your personal information and contact details
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdate}>
                    <div className="space-y-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-Name">Full Name</Label>
                                <Input
                                    id="edit-Name"
                                    value={data.name}
                                    onChange={(e) => {
                                        setData("name", e.target.value);
                                        clearErrors("name");
                                    }}
                                    placeholder="Enter name"
                                    className={
                                        errors.name &&
                                        "border-red-500 focus-visible:ring-red-500 text-red-500 placeholder:text-red-500"
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-email">
                                    Email Address
                                </Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => {
                                        setData("email", e.target.value);
                                        clearErrors("email");
                                    }}
                                    placeholder="email@example.com"
                                    className={
                                        errors.email &&
                                        "border-red-500 focus-visible:ring-red-500 text-red-500 placeholder:text-red-500"
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-phone">Phone Number</Label>
                                <Input
                                    id="edit-phone"
                                    value={data.phone}
                                    onChange={(e) => {
                                        setData("phone", e.target.value);
                                        clearErrors("phone");
                                    }}
                                    placeholder="+1-555-0000"
                                    className={
                                        errors.phone &&
                                        "border-red-500 focus-visible:ring-red-500 text-red-500 placeholder:text-red-500"
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-password">Password</Label>
                                <Input
                                    id="edit-password"
                                    value={data.password}
                                    onChange={(e) => {
                                        setData("password", e.target.value);
                                        clearErrors("password");
                                    }}
                                    placeholder="Leave blank if you don't want to replace"
                                    className={
                                        errors.password &&
                                        "border-red-500 focus-visible:ring-red-500 text-red-500 placeholder:text-red-500"
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end pt-4 border-t">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => setIsEditDialogOpen(false)}
                            >
                                <X className="size-4 mr-2" />
                                Cancel
                            </Button>
                            <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white">
                                <Save className="size-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
