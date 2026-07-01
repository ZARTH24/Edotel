import React, { Children } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import {
    Hotel,
    Users,
    Bed,
    LayoutDashboard,
    LogOut,
    User as UserIcon,
    Wrench,
    UserRoundPlus,
    CircleUserRound,
    UsersRound,
    Sun,
    Moon,
    BookOpen,
    ClipboardList,
    CalendarCheck,
    Lock,
    CheckCircle,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    BarChart3,
    FileText,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Toaster, toast } from "sonner";
import SimulationBanner from "@/components/Simulation/SimulationBanner";

export default function Layout({ children }) {
    const path = usePage();
    const { flash, auth, elearning, simulation } = usePage().props;
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Check if current path is in E-Learning section
    const isElearningActive = path.url.startsWith("/elearning");
    const isAdmin = auth.user?.role === "admin";
    const isFrontOffice = auth.user?.role === "front-office";
    const isHousekeeping = auth.user?.role === "housekeeping";
    const isSiswa = auth.user?.role === "siswa";

    // E-Learning menu default terbuka untuk admin, tertutup untuk siswa
    const [elearningMenuOpen, setElearningMenuOpen] = React.useState(isAdmin);

    React.useEffect(() => setMounted(true), []);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post("/logout");
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case "admin":
                return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800";
            case "siswa":
                return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
            case "front-office":
                return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800";
            case "housekeeping":
                return "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800";
            default:
                return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
        }
    };

    // Check if menu is unlocked based on E-Learning progress
    const isMenuUnlocked = auth.user?.is_menu_unlocked ?? false;

    React.useEffect(() => {
        if (flash?.message) {
            // pilih toast sesuai tipe
            switch (flash.type) {
                case "success":
                    toast.success(flash.message);
                    break;
                case "error":
                    toast.error(flash.message);
                    break;
                case "info":
                    toast.info(flash.message);
                    break;
                default:
                    toast(flash.message); // default
            }
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-700">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-2 rounded-lg">
                                <Hotel className="size-6 text-white" />
                            </div>
                            <div className="flex flex-col items-center space-y-2">
                                <img
                                    src="/assets/image/logo.png"
                                    alt="EDOTEL SMKN 2 Gorontalo"
                                    className="w-10 md:w-20 lg:w-40 object-contain"
                                />
                                <p className="text-md text-slate-600 text-center dark:text-slate-400">
                                    {isSiswa ? "E-Learning" : "Management System"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                {new Date().toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </div>
                            {mounted && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={toggleTheme}
                                    className="rounded-full"
                                >
                                    {theme === "dark" ? (
                                        <Sun className="size-4" />
                                    ) : (
                                        <Moon className="size-4" />
                                    )}
                                </Button>
                            )}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                            {auth.user?.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .substring(0, 2) ?? "A"}
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm font-medium text-slate-900">
                                                {auth.user?.email ??
                                                    "admin@example.com"}
                                            </div>
                                            <div className="text-xs text-slate-500 capitalize">
                                                {auth.user?.role.replace(
                                                    "-",
                                                    "",
                                                ) ?? "Admin"}
                                            </div>
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-56"
                                >
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium">
                                                {auth.user?.name ?? "admin"}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {auth.user?.email ??
                                                    "admin@example.com"}
                                            </p>
                                            <Badge
                                                className={cn(
                                                    "w-fit mt-1",
                                                    getRoleBadgeColor(
                                                        auth.user?.role || "",
                                                    ),
                                                )}
                                            >
                                                {auth.user?.role === "front-office"
                                                    ? "Front Office"
                                                    : auth.user?.role === "housekeeping"
                                                    ? "Housekeeping"
                                                    : (auth.user?.role?.replace(
                                                          "-",
                                                          " ",
                                                      ) ?? "admin")}
                                            </Badge>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <CircleUserRound className="size-5 mr-2" />
                                        <Link href={"/profile"}>
                                            My Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    {isAdmin && (
                                        <DropdownMenuItem>
                                            <UsersRound className="size-5 mr-2" />
                                            <Link href={"/User/daftarUser"}>
                                                List Users
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="size-4 mr-2" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </header>

            {/* Simulation Mode Banner */}
            {simulation?.is_simulation_mode && (
                <SimulationBanner summary={simulation?.summary} />
            )}

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-73px)] dark:bg-slate-900 dark:border-slate-700">
                    <nav className="p-4 space-y-1">
                        {/* E-Learning Menu - Collapsible (Hanya untuk Admin dan Siswa) */}
                        {(isAdmin || isSiswa) && (
                            <div className="space-y-1">
                                <div
                                    onClick={() => setElearningMenuOpen(!elearningMenuOpen)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer",
                                        isElearningActive
                                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md"
                                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                                    )}
                                >
                                    <BookOpen className="size-5" />
                                    <span>E-Learning</span>
                                    {elearning?.progress_percentage > 0 && elearning?.progress_percentage < 100 && (
                                        <Badge variant="outline" className="ml-auto text-xs">
                                            {elearning.progress_percentage}%
                                        </Badge>
                                    )}
                                    {elearning?.progress_percentage === 100 && (
                                        <CheckCircle className="size-4 ml-auto text-green-500" />
                                    )}
                                    {/* Chevron indicator untuk admin/siswa */}
                                    <span className="ml-auto">
                                        {elearningMenuOpen ? (
                                            <ChevronDown className="size-4" />
                                        ) : (
                                            <ChevronRight className="size-4" />
                                        )}
                                    </span>
                                </div>

                                {/* E-Learning Submenu - Collapsible */}
                                {elearningMenuOpen && (
                                    <div className="ml-4 pl-4 border-l border-slate-200 dark:border-slate-700 space-y-1">
                                        <Link
                                            href={"/elearning/reception"}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all",
                                                path.url.startsWith("/elearning/reception")
                                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                                                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800",
                                            )}
                                        >
                                            <ClipboardList className="size-4" />
                                            <span>Reception</span>
                                        </Link>
                                        <Link
                                            href={"/elearning/reservation"}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all",
                                                path.url.startsWith("/elearning/reservation")
                                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                                                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800",
                                            )}
                                        >
                                            <CalendarCheck className="size-4" />
                                            <span>Reservation</span>
                                        </Link>
                                        {/* Menu khusus Admin */}
                                        {isAdmin && (
                                            <>
                                                <Link
                                                    href={"/elearning/progress-siswa"}
                                                    className={cn(
                                                        "flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all",
                                                        path.url.startsWith("/elearning/progress-siswa")
                                                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                                                            : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800",
                                                    )}
                                                >
                                                    <BarChart3 className="size-4" />
                                                    <span>Progress Siswa</span>
                                                </Link>
                                                <Link
                                                    href={"/elearning/hasil-form-siswa"}
                                                    className={cn(
                                                        "flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all",
                                                        path.url.startsWith("/elearning/hasil-form-siswa")
                                                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                                                            : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800",
                                                    )}
                                                >
                                                    <FileText className="size-4" />
                                                    <span>Hasil Form Siswa</span>
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ============================================= */}
                        {/* MENU GURU/ADMIN - Akses Penuh */}
                        {/* ============================================= */}
                        {isAdmin && (
                            <>
                                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                                    <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Menu Guru
                                    </p>
                                </div>

                                {/* Dashboard */}
                                <Link
                                    href={"/Dashboard"}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                        path.url === "/Dashboard"
                                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md"
                                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                                    )}
                                >
                                    <LayoutDashboard className="size-5" />
                                    <span>Dashboard</span>
                                </Link>

                                {/* Front Office */}
                                <Link
                                    href={"/Frontoffice"}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                        path.url.startsWith("/Frontoffice")
                                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md"
                                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                                    )}
                                >
                                    <Users className="size-5" />
                                    <span>Front Office</span>
                                </Link>

                                {/* House Keeping */}
                                <Link
                                    href={"/Housekeeping"}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                        path.url === "/Housekeeping"
                                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md"
                                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                                    )}
                                >
                                    <Bed className="size-5" />
                                    <span>House Keeping</span>
                                </Link>

                                {/* Damage Report */}
                                <Link
                                    href={"/Damagereport"}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                        path.url === "/Damagereport"
                                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md"
                                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                                    )}
                                >
                                    <Wrench className="size-5" />
                                    <span>Damage Report</span>
                                </Link>
                            </>
                        )}

                        {/* ============================================= */}
                        {/* MENU FRONT OFFICE - Dashboard, FO, HK, DR */}
                        {/* ============================================= */}
                        {isFrontOffice && (
                            <>
                                <div className="pt-4 mt-4">
                                    <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Menu Staff
                                    </p>
                                </div>

                                {/* Dashboard */}
                                <Link
                                    href={"/Dashboard"}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                        path.url === "/Dashboard"
                                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md"
                                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                                    )}
                                >
                                    <LayoutDashboard className="size-5" />
                                    <span>Dashboard</span>
                                </Link>

                                {/* Front Office */}
                                <Link
                                    href={"/Frontoffice"}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                        path.url.startsWith("/Frontoffice")
                                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md"
                                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                                    )}
                                >
                                    <Users className="size-5" />
                                    <span>Front Office</span>
                                </Link>

                                {/* House Keeping */}
                                <Link
                                    href={"/Housekeeping"}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                        path.url === "/Housekeeping"
                                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md"
                                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                                    )}
                                >
                                    <Bed className="size-5" />
                                    <span>House Keeping</span>
                                </Link>

                                {/* Damage Report */}
                                <Link
                                    href={"/Damagereport"}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                        path.url === "/Damagereport"
                                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md"
                                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                                    )}
                                >
                                    <Wrench className="size-5" />
                                    <span>Damage Report</span>
                                </Link>
                            </>
                        )}

                        {/* ============================================= */}
                        {/* MENU HOUSEKEEPING - Dashboard, HK, DR (no FO) */}
                        {/* ============================================= */}
                        {isHousekeeping && (
                            <>
                                <div className="pt-4 mt-4">
                                    <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Menu Staff
                                    </p>
                                </div>

                                {/* Dashboard */}
                                <Link
                                    href={"/Dashboard"}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                        path.url === "/Dashboard"
                                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md"
                                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                                    )}
                                >
                                    <LayoutDashboard className="size-5" />
                                    <span>Dashboard</span>
                                </Link>

                                {/* House Keeping */}
                                <Link
                                    href={"/Housekeeping"}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                        path.url === "/Housekeeping"
                                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md"
                                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                                    )}
                                >
                                    <Bed className="size-5" />
                                    <span>House Keeping</span>
                                </Link>

                                {/* Damage Report */}
                                <Link
                                    href={"/Damagereport"}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                        path.url === "/Damagereport"
                                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md"
                                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                                    )}
                                >
                                    <Wrench className="size-5" />
                                    <span>Damage Report</span>
                                </Link>
                            </>
                        )}

                        {/* ============================================= */}
                        {/* MENU SISWA - Terbuka Setelah E-Learning Selesai */}
                        {/* ============================================= */}
                        {isSiswa && (
                            <>
                                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                                    <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Menu Siswa
                                    </p>
                                </div>

                                {/* Dashboard Siswa - Selalu terlihat */}
                                <Link
                                    href={"/siswa/dashboard"}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                        path.url === "/siswa/dashboard"
                                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md"
                                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                                    )}
                                >
                                    <LayoutDashboard className="size-5" />
                                    <span>Dashboard</span>
                                </Link>

                                {/* Hotel Menu - Tampilkan HANYA setelah unlock */}
                                {isMenuUnlocked && (
                                    <>
                                        {/* Front Office */}
                                        <Link
                                            href={"/Frontoffice"}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                                path.url.startsWith("/Frontoffice")
                                                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md"
                                                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                                            )}
                                        >
                                            <Users className="size-5" />
                                            <span>Front Office</span>
                                        </Link>

                                        {/* House Keeping */}
                                        <Link
                                            href={"/Housekeeping"}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                                path.url === "/Housekeeping"
                                                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md"
                                                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                                            )}
                                        >
                                            <Bed className="size-5" />
                                            <span>House Keeping</span>
                                        </Link>

                                        {/* Damage Report */}
                                        <Link
                                            href={"/Damagereport"}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                                path.url === "/Damagereport"
                                                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md"
                                                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                                            )}
                                        >
                                            <Wrench className="size-5" />
                                            <span>Damage Report</span>
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">{children}</main>
            </div>

            <Toaster position="top-right" richColors />
        </div>
    );
}
