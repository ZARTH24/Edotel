import React from "react";

export default function ListStaff({ users }) {
    console.log(users);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
                <div
                    key={user.id}
                    className="p-4 border border-slate-200 rounded-lg"
                >
                    {/* Header: Avatar + Nama */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-semibold text-slate-900">
                                {user.name}
                            </div>
                            <div className="text-sm text-slate-500">
                                {user.pending +
                                    user.in_progress +
                                    user.completed}{" "}
                                tasks
                            </div>
                        </div>
                    </div>

                    {/* Task Status Badges */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Pending:</span>
                            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                {user.pending || 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">In Progress:</span>
                            <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                {user.in_progress || 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Completed:</span>
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                {user.completed || 0}
                            </span>
                        </div>
                    </div>

                    {/* Current Tasks */}
                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="text-xs text-slate-500 mb-2">
                            Current Tasks:
                        </div>
                        <div className="space-y-1">
                            {user.assigned_tasks?.map((task) => (
                                <div
                                    key={task.id}
                                    className="text-sm text-slate-700 flex items-center gap-2"
                                >
                                    <div
                                        className={`w-2 h-2 rounded-full ${
                                            task.status === "pending"
                                                ? "bg-red-500"
                                                : task.status === "in-progress"
                                                  ? "bg-yellow-500"
                                                  : "bg-green-500"
                                        }`}
                                    />
                                    {/* Tampilkan nomor room atau room_id */}
                                    Room {task.room?.number || task.room_id}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
