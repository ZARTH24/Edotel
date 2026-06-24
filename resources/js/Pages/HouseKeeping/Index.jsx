import Layout from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Bed,
    User,
    CheckCircle2Icon,
    ClipboardCheck,
    Clock,
    Wrench,
    CheckCircle2,
    UserCheck,
    Calendar,
    UserSearch,
} from "lucide-react";
import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import CreateCleaningTask from "@/components/HouseKeeping/Cleaning/CreateCleaningTask";
import AssignCleaning from "@/components/HouseKeeping/Cleaning/AssignCleaningTask";
import InspectCleaningTask from "@/components/HouseKeeping/Cleaning/InspectCleaningTask";
import ListStaff from "@/components/HouseKeeping/ListStaff";

export default function Index({ users, adminUsers, rooms, housekeepingUsers }) {
    const [selectedTab, setSelectedTab] = useState("overview");
    const { auth } = usePage().props;

    const handleComplete = (taskId) => {
        router.post(`/cleaning-tasks/${taskId}/completed`);
    };
    const handleInspect = (taskId) => {
        router.post(`/cleaning-tasks/${taskId}/inspected`);
    };

    const getCleaningStatusBadge = (status) => {
        const statusStyles = {
            pending: "bg-red-100 text-red-700 border-red-200",
            "in-progress": "bg-yellow-100 text-yellow-700 border-yellow-200",
            completed: "bg-green-100 text-green-700 border-green-200",
            inspected: "bg-blue-100 text-blue-700 border-blue-200",
        };
        return statusStyles[status] || "bg-slate-100 text-slate-700";
    };

    const getPriorityBadge = (priority) => {
        const priorityStyles = {
            low: "bg-slate-100 text-slate-700 border-slate-200",
            medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
            high: "bg-red-100 text-red-700 border-red-200",
        };
        return priorityStyles[priority] || "bg-slate-100 text-slate-700";
    };

    const getMaintenanceStatusBadge = (status) => {
        const statusStyles = {
            pending: "bg-red-100 text-red-700 border-red-200",
            "in-progress": "bg-yellow-100 text-yellow-700 border-yellow-200",
            completed: "bg-green-100 text-green-700 border-green-200",
        };
        return statusStyles[status] || "bg-slate-100 text-slate-700";
    };

    return (
        <>
            <Head title="House Keeping" />

            <Layout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-serif text-slate-900">
                                Housekeeping
                            </h2>
                            <p className="text-slate-600 mt-1">
                                Room cleaning and maintenance management
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <CreateCleaningTask rooms={rooms} />
                        </div>
                    </div>

                    <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                        <TabsList className="grid w-full grid-cols-3 lg:w-auto bg-stone-200 gap-5">
                            <TabsTrigger
                                value="overview"
                                className={"rounded-full"}
                            >
                                Overview
                            </TabsTrigger>
                            <TabsTrigger
                                value="tasks"
                                className={"rounded-full"}
                            >
                                Cleaning Tasks
                            </TabsTrigger>
                            <TabsTrigger
                                value="staff"
                                className={"rounded-full"}
                            >
                                Staff
                            </TabsTrigger>
                        </TabsList>

                        {/* Overview */}
                        <TabsContent
                            value="overview"
                            className="space-y-6 mt-6"
                        >
                            {/* Quick Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm text-slate-600">
                                            Pending Tasks
                                        </CardTitle>
                                        <Clock className="size-4 text-red-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-semibold text-slate-900">
                                            {
                                                rooms
                                                    .flatMap(
                                                        (room) =>
                                                            room.cleaning_tasks ||
                                                            [],
                                                    ) // gabungkan semua tasks
                                                    .filter(
                                                        (task) =>
                                                            task.status ===
                                                            "pending",
                                                    ).length
                                            }
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Awaiting assignment
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm text-slate-600">
                                            In Progress
                                        </CardTitle>
                                        <ClipboardCheck className="size-4 text-yellow-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-semibold text-slate-900">
                                            {
                                                rooms
                                                    .flatMap(
                                                        (room) =>
                                                            room.cleaning_tasks ||
                                                            [],
                                                    ) // gabungkan semua tasks
                                                    .filter(
                                                        (task) =>
                                                            task.status ===
                                                            "in-progress",
                                                    ).length
                                            }
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Being cleaned
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm text-slate-600">
                                            Completed
                                        </CardTitle>
                                        <CheckCircle2Icon className="size-4 text-green-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-semibold text-slate-900">
                                            {
                                                rooms
                                                    .flatMap(
                                                        (room) =>
                                                            room.cleaning_tasks ||
                                                            [],
                                                    ) // gabungkan semua tasks
                                                    .filter(
                                                        (task) =>
                                                            task.status ===
                                                            "completed",
                                                    ).length
                                            }
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Today
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm text-slate-600">
                                            Maintenance
                                        </CardTitle>
                                        <Wrench className="size-4 text-orange-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-semibold text-slate-900">
                                            {
                                                rooms.flatMap(
                                                    (room) =>
                                                        room.maintenance_tasks ||
                                                        [],
                                                ).length // gabungkan semua tasks
                                            }
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Active requests
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Room Status Grid */}
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-slate-900">
                                        Room Status Grid
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                        {rooms.length > 0 ? (
                                            rooms.map((room, index) => {
                                                const hasTask =
                                                    room.cleaning_tasks?.find(
                                                        (t) =>
                                                            t.room_id ===
                                                            room.id,
                                                    );
                                                const taskStatus =
                                                    hasTask?.status;

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                                                            room.status ===
                                                            "available"
                                                                ? "border-green-300 bg-green-50"
                                                                : room.status ===
                                                                    "occupied"
                                                                  ? "border-red-300 bg-red-50"
                                                                  : room.status ===
                                                                      "cleaning"
                                                                    ? "border-yellow-300 bg-yellow-50"
                                                                    : room.status ===
                                                                        "maintenance"
                                                                      ? "border-orange-300 bg-orange-50"
                                                                      : "border-blue-300 bg-blue-50"
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="font-semibold text-md text-slate-900">
                                                                {room.number}
                                                            </span>
                                                            <Bed className="size-4 text-slate-600" />
                                                        </div>
                                                        <div className="text-xs text-slate-600 capitalize mb-1">
                                                            {room.type}
                                                        </div>
                                                        <Badge
                                                            className={`text-xs ${
                                                                room.status ===
                                                                "available"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : room.status ===
                                                                        "occupied"
                                                                      ? "bg-red-100 text-red-700"
                                                                      : room.status ===
                                                                          "cleaning"
                                                                        ? "bg-yellow-100 text-yellow-700"
                                                                        : room.status ===
                                                                            "maintenance"
                                                                          ? "bg-orange-100 text-orange-700"
                                                                          : "bg-blue-100 text-blue-700"
                                                            }`}
                                                        >
                                                            {room.status}
                                                        </Badge>

                                                        {taskStatus &&
                                                            taskStatus !==
                                                                "inspected" && (
                                                                <div className="mt-2 text-xs text-slate-600">
                                                                    Task:{" "}
                                                                    {taskStatus}
                                                                </div>
                                                            )}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="col-span-full text-center py-8">
                                                <p className="text-slate-500">
                                                    No rooms added yet
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-slate-900">
                                            High Priority Cleaning Tasks
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {rooms.map((room) => {
                                                // filter task high priority di setiap room
                                                const highPriorityTasks =
                                                    room.cleaning_tasks?.filter(
                                                        (task) =>
                                                            task.priority ==
                                                            "high",
                                                    );

                                                if (
                                                    !highPriorityTasks ||
                                                    highPriorityTasks.length ===
                                                        0
                                                ) {
                                                    return null; // nanti kita bisa render "No high priority tasks" di akhir
                                                }

                                                return highPriorityTasks.map(
                                                    (task) => (
                                                        <div
                                                            key={task.id}
                                                            className="p-3 bg-red-50 border border-red-200 rounded-lg"
                                                        >
                                                            {/* Header: Room + Status */}
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="font-semibold text-slate-900">
                                                                    Room{" "}
                                                                    {
                                                                        room.number
                                                                    }
                                                                </span>
                                                                <Badge
                                                                    className={getCleaningStatusBadge(
                                                                        task.status,
                                                                    )}
                                                                >
                                                                    {
                                                                        task.status
                                                                    }
                                                                </Badge>
                                                            </div>

                                                            {/* Assigned to & Notes */}
                                                            <div className="text-sm text-slate-600">
                                                                {task.assign
                                                                    ?.name && (
                                                                    <div className="flex items-center gap-2">
                                                                        <User className="size-4" />
                                                                        {task
                                                                            .assign
                                                                            ?.name ??
                                                                            "-"}
                                                                    </div>
                                                                )}
                                                                {task.notes && (
                                                                    <div className="mt-1 text-xs">
                                                                        <span>
                                                                            Note:{" "}
                                                                        </span>
                                                                        {
                                                                            task.notes
                                                                        }
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ),
                                                );
                                            })}

                                            {/* Optional: kalau tidak ada high priority task sama sekali */}
                                            {rooms.every(
                                                (room) =>
                                                    !room.cleaning_tasks?.some(
                                                        (task) =>
                                                            task.priority ===
                                                            "high",
                                                    ),
                                            ) && (
                                                <p className="text-center text-slate-500 py-6">
                                                    No high priority tasks
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-slate-900">
                                            Active Maintenance
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {rooms.flatMap(
                                                (room) =>
                                                    room.maintenance_tasks?.map(
                                                        (task) => ({
                                                            room,
                                                            task,
                                                        }),
                                                    ) || [],
                                            ).length > 0 ? (
                                                rooms
                                                    .flatMap(
                                                        (room) =>
                                                            room.maintenance_tasks?.map(
                                                                (task) => ({
                                                                    room,
                                                                    task,
                                                                }),
                                                            ) || [],
                                                    )
                                                    .map(({ room, task }) => (
                                                        <div
                                                            key={task.id}
                                                            className="p-3 bg-orange-50 border border-orange-200 rounded-lg"
                                                        >
                                                            {/* Header: Room + Priority */}
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="font-semibold text-slate-900">
                                                                    Room{" "}
                                                                    {
                                                                        room.number
                                                                    }
                                                                </span>
                                                                <Badge
                                                                    className={getPriorityBadge(
                                                                        task.priority,
                                                                    )}
                                                                >
                                                                    {
                                                                        task.priority
                                                                    }
                                                                </Badge>
                                                            </div>

                                                            {/* Issue */}
                                                            <div className="text-sm text-slate-700 mb-2">
                                                                {task.issue}
                                                            </div>

                                                            {/* Footer: Reported by + Status */}
                                                            <div className="flex items-center justify-between text-xs text-slate-600">
                                                                <span>
                                                                    Reported by:{" "}
                                                                    {task.reported_by || "Unknown"}
                                                                </span>
                                                                <Badge
                                                                    className={getMaintenanceStatusBadge(
                                                                        task.status,
                                                                    )}
                                                                >
                                                                    {
                                                                        task.status
                                                                    }
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    ))
                                            ) : (
                                                <p className="text-center text-slate-500 py-6">
                                                    No Active Maintenance
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Cleaning Task */}
                        <TabsContent value="tasks" className="space-y-6 mt-6">
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-slate-900">
                                        All Cleaning Tasks
                                    </CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <div className="space-y-4">
                                        {rooms
                                            .flatMap((room) =>
                                                (room.cleaning_tasks || []).map(
                                                    (task) => ({ room, task }),
                                                ),
                                            )
                                            .map(({ room, task }) => (
                                                <div
                                                    key={task.id}
                                                    className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            {/* HEADER */}
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <span className="text-lg font-semibold text-slate-900">
                                                                    Room{" "}
                                                                    {
                                                                        room.number
                                                                    }
                                                                </span>

                                                                <Badge
                                                                    className={getPriorityBadge(
                                                                        task.priority,
                                                                    )}
                                                                >
                                                                    {
                                                                        task.priority
                                                                    }
                                                                </Badge>

                                                                <Badge
                                                                    className={getCleaningStatusBadge(
                                                                        task.status,
                                                                    )}
                                                                >
                                                                    {
                                                                        task.status
                                                                    }
                                                                </Badge>
                                                            </div>

                                                            {/* ROOM INFO */}
                                                            <p className="text-sm text-slate-600 mb-3 capitalize">
                                                                {room.type}
                                                            </p>

                                                            {/* DETAILS */}
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                                                <div className="flex items-center gap-2 text-slate-600">
                                                                    <User className="size-3" />
                                                                    Assigned:{" "}
                                                                    <span className="text-slate-900">
                                                                        {task
                                                                            .assign
                                                                            ?.name ??
                                                                            "Unassigned"}
                                                                    </span>
                                                                </div>

                                                                <div className="flex items-center gap-2 text-slate-600">
                                                                    {task.end_time ? (
                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger
                                                                                asChild
                                                                            >
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="flex gap-2"
                                                                                >
                                                                                    <Calendar className="size-4" />
                                                                                    View
                                                                                    Dates
                                                                                </Button>
                                                                            </DropdownMenuTrigger>

                                                                            <DropdownMenuContent
                                                                                align="start"
                                                                                className="w-56"
                                                                            >
                                                                                <DropdownMenuItem>
                                                                                    <span className="font-medium">
                                                                                        Start:
                                                                                    </span>
                                                                                    <span className="ml-auto text-xs text-slate-500">
                                                                                        {task.start_time ??
                                                                                            "-"}
                                                                                    </span>
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuItem>
                                                                                    <span className="font-medium">
                                                                                        End:
                                                                                    </span>
                                                                                    <span className="ml-auto text-xs text-slate-500">
                                                                                        {task.end_time ??
                                                                                            "-"}
                                                                                    </span>
                                                                                </DropdownMenuItem>
                                                                                {task.inspected_at && (
                                                                                    <DropdownMenuItem>
                                                                                        <span className="font-medium">
                                                                                            Inspected:
                                                                                        </span>
                                                                                        <span className="ml-auto text-xs text-slate-500">
                                                                                            {
                                                                                                task?.inspected_at
                                                                                            }
                                                                                        </span>
                                                                                    </DropdownMenuItem>
                                                                                )}
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                    ) : (
                                                                        <div className="flex items-center gap-2 text-slate-600">
                                                                            <Clock className="size-3" />{" "}
                                                                            {task.start_time ??
                                                                                "-"}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="flex items-center gap-2 text-slate-600">
                                                                    <UserCheck className="size-3" />
                                                                    Inspected_by:
                                                                    {"  "}
                                                                    <span className="text-slate-900">
                                                                        {task
                                                                            .inspect
                                                                            ?.name ??
                                                                            "-"}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* NOTES */}
                                                            {task.notes && (
                                                                <div className="mt-3 p-3 bg-green-50 border-green-200 border rounded">
                                                                    <div className="text-sm text-green-900">
                                                                        <strong>
                                                                            Note:{" "}
                                                                        </strong>
                                                                        {
                                                                            task.notes
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* ACTIONS */}
                                                        <div className="ml-4 flex flex-col gap-2">
                                                            {task.status ===
                                                                "pending" && (
                                                                <AssignCleaning
                                                                    taskId={
                                                                        task.id
                                                                    }
                                                                    users={
                                                                        housekeepingUsers
                                                                    }
                                                                />
                                                            )}
                                                            {task.status ===
                                                                "in-progress" && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="border-green-300 text-green-700 hover:bg-blue-50"
                                                                    onClick={() =>
                                                                        handleComplete(
                                                                            task.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <CheckCircle2 className="size-3 mr-1" />
                                                                    Complete
                                                                </Button>
                                                            )}
                                                            {task.status ===
                                                                "completed" &&
                                                                (auth.user
                                                                    .role !==
                                                                "admin" ? (
                                                                    <InspectCleaningTask
                                                                        taskId={
                                                                            task.id
                                                                        }
                                                                        users={
                                                                            adminUsers
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                                                                        onClick={() =>
                                                                            handleInspect(
                                                                                task.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        <UserSearch className="size-3 mr-1" />
                                                                        Inspect
                                                                    </Button>
                                                                ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                        {/* No cleaning tasks */}
                                        {rooms.every(
                                            (room) =>
                                                (room.cleaning_tasks || [])
                                                    .length === 0,
                                        ) && (
                                            <p className="text-center text-slate-500 py-8">
                                                No cleaning tasks
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Staff */}
                        <TabsContent value="staff" className="space-y-6 mt-6">
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-slate-900">
                                        Staff Assignments
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ListStaff users={users} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </Layout>
        </>
    );
}
