<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ProgressController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ELearning\ELearningController;
use App\Http\Controllers\ELearning\ReceptionController as ELearningReceptionController;
use App\Http\Controllers\ELearning\ReservationController as ELearningReservationController;
use App\Http\Controllers\ELearning\api\FormController;
use App\Http\Controllers\FrontOffice\ReservationController;
use App\Http\Controllers\FrontOffice\RoomController;
use App\Http\Controllers\FrontOffice\ValidateController;
use App\Http\Controllers\HouseKeeping\CleaningTaskController;
use App\Http\Controllers\Pages\DamageReportController;
use App\Http\Controllers\Pages\PagesController;
use App\Http\Controllers\Siswa\DashboardController;
use App\Http\Middleware\RedirectIfAuthenticatedCustom;
use Illuminate\Support\Facades\Route;

Route::get('/', [PagesController::class, 'landingpage']);

Route::middleware([RedirectIfAuthenticatedCustom::class])->group(function () {
    Route::get('/Login', [AuthController::class, 'index'])->name('login');
    Route::post('/Login', [AuthController::class, 'login'])->middleware('throttle:5,1');
});

Route::middleware(['auth'])->group(function () {

    // Profile
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::get('/profile/{user}/edit', [AuthController::class, 'editProfile']);
    Route::put('/profile/{user}', [AuthController::class, 'updateProfile']);

    Route::middleware(['role:admin'])->group(function () {
        Route::get('/User/daftarUser', [UserController::class, 'index'])->name('user.index');
        Route::get('/User/create', [UserController::class, 'create']);
        Route::post('/User/store', [UserController::class, 'store'])->name('user.store');
        Route::get('/User/{id}/edit', [UserController::class, 'edit'])->name('user.edit');
        Route::put('/User/{id}', [UserController::class, 'update'])->name('user.update');
        Route::delete('/User/{id}', [UserController::class, 'destroy'])->name('user.destroy');
    });

    // E-Learning Routes - Admin dan Siswa only (exclude front-office, housekeeping)
    Route::middleware(['role:admin,siswa'])->prefix('elearning')->group(function () {
        Route::get('/', [ELearningController::class, 'index'])->name('elearning.index');
        Route::get('/reception', [ELearningReceptionController::class, 'index'])->name('elearning.reception.index');
        Route::get('/reception/{slug}', [ELearningReceptionController::class, 'show'])->name('elearning.reception.show');
        Route::post('/reception/{slug}', [ELearningReceptionController::class, 'submit'])->name('elearning.reception.submit');
        Route::get('/reservation', [ELearningReservationController::class, 'index'])->name('elearning.reservation.index');
        Route::get('/reservation/{slug}', [ELearningReservationController::class, 'show'])->name('elearning.reservation.show');
        Route::post('/reservation/{slug}', [ELearningReservationController::class, 'submit'])->name('elearning.reservation.submit');

        // API Routes
        Route::get('/api/form/{slug}', [FormController::class, 'getConfig'])->name('elearning.api.form');
    });

    // Admin E-Learning Monitoring Routes
    Route::middleware(['role:admin'])->prefix('elearning')->group(function () {
        Route::get('/progress-siswa', [ProgressController::class, 'index'])->name('elearning.progress.siswa');
        Route::get('/progress-siswa/{studentId}', [ProgressController::class, 'show'])->name('elearning.progress.siswa.show');
        Route::get('/hasil-form-siswa', [ProgressController::class, 'submittedForms'])->name('elearning.hasil.form');
    });

    // =====================================================
    // READ ROUTES - Admin, Siswa, Front Office, Housekeeping
    // Simulation mode is handled internally by controllers
    // checkUnlock middleware blocks siswa if menu not unlocked
    // =====================================================
    Route::middleware(['role:admin,siswa,front-office,housekeeping'])->group(function () {
        // Dashboard Admin
        Route::get('/Dashboard', [PagesController::class, 'dashboard'])->name('Dashboard');

        // Dashboard Siswa
        Route::get('/siswa/dashboard', [DashboardController::class, 'index'])->name('siswa.dashboard');
    });

    // =====================================================
    // FRONT OFFICE - Admin & Front Office only (NOT housekeeping)
    // =====================================================
    Route::middleware(['role:admin,front-office'])->group(function () {
        Route::get('/Frontoffice', [PagesController::class, 'frontoffice'])->name('Frontoffice');
        Route::get('/Frontoffice/reservation/create', [ReservationController::class, 'create'])->name('createReservation');
        Route::get('/Frontoffice/reservations/{booking_reference}/details', [ReservationController::class, 'show']);
        Route::get('/Frontoffice/reservations/{reservation}/edit', [ReservationController::class, 'edit'])->name('reservations.edit');
    });

    // =====================================================
    // DAMAGE REPORT - Admin, Siswa, Front Office, Housekeeping (ALL have access)
    // =====================================================
    Route::middleware(['role:admin,siswa,front-office,housekeeping', 'checkUnlock'])->group(function () {
        Route::get('/Damagereport', [DamageReportController::class, 'index'])->name('DamageReport');
        Route::get('/Damagereport/{id}/details', [DamageReportController::class, 'show']);
    });

    // =====================================================
    // HOUSEKEEPING - Admin, Siswa, Front Office, Housekeeping (ALL have access)
    // =====================================================
    Route::middleware(['role:admin,siswa,front-office,housekeeping', 'checkUnlock'])->group(function () {
        Route::get('/Housekeeping', [PagesController::class, 'housekeeping']);
    });

    // =====================================================
    // WRITE ROUTES - Admin, Front Office, Housekeeping
    // Siswa: READ ONLY (controlled by unlock, no WRITE access)
    // Note: Front Office has full write access to all hotel modules
    // =====================================================
    Route::middleware(['role:admin,front-office,housekeeping'])->group(function () {
        // Reservation Write Operations
        Route::post('/Frontoffice/reservation', [ReservationController::class, 'store'])->name('storeReservation');
        Route::put('/Frontoffice/reservations/{reservation}', [ReservationController::class, 'update'])->name('reservation.update');
        Route::post('/Frontoffice/reservations/{reservation}/checkin', [ReservationController::class, 'checkin']);
        Route::post('/Frontoffice/reservations/{reservation}/checkout', [ReservationController::class, 'checkout']);
        Route::post('/Frontoffice/reservations/{reservation}/cancel', [ReservationController::class, 'cancel']);

        // Damage Report Write Operations
        Route::post('/Damagereport/add', [DamageReportController::class, 'store']);
        Route::post('/Damagereport/{id}/approve', [DamageReportController::class, 'approve']);
        Route::post('/Damagereport/{id}/assign', [DamageReportController::class, 'assign']);
        Route::post('/Damagereport/{id}/completed', [DamageReportController::class, 'complete']);

        // Cleaning Task Write Operations
        Route::post('/Housekeeping/cleaning-task', [CleaningTaskController::class, 'store']);
        Route::post('/cleaning-tasks/{task}/assign', [CleaningTaskController::class, 'assignCleaningTask']);
        Route::post('/cleaning-tasks/{task}/completed', [CleaningTaskController::class, 'completedCleaningTask']);
        Route::post('/cleaning-tasks/{task}/inspected', [CleaningTaskController::class, 'inspectCleaningTask']);
    });

    // =====================================================
    // EXPORT/REPORT ROUTES - Admin only
    // =====================================================
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/Frontoffice/reservations/export', [ReservationController::class, 'exportHistory']);
        Route::get('/Damagereport/export', [DamageReportController::class, 'exportHistory']);
    });

    // =====================================================
    // ROOM MANAGEMENT - Admin, Front Office, Housekeeping
    // =====================================================
    Route::middleware(['role:admin,front-office,housekeeping'])->group(function () {
        Route::get('/Frontoffice/create/room', [RoomController::class, 'create'])->name('room.create');
        Route::post('/Frontoffice/store', [RoomController::class, 'store'])->name('room.store');
        Route::get('/Frontoffice/editroom/{id}', [RoomController::class, 'edit'])->name('room.edit');
        Route::put('/Frontoffice/updateroom/{id}', [RoomController::class, 'update'])->name('rooms.update');
        Route::get('/Frontoffice/available-rooms', [RoomController::class, 'availableRooms']);
        Route::delete('/Frontoffice/room/{id}', [RoomController::class, 'destroy'])->name('room.destroy');
        Route::post('/Frontoffice/room/{id}/restore', [RoomController::class, 'restore'])->name('room.restore');

        // Validate
        Route::post('/Frontoffice/validate-room', [ValidateController::class, 'ValidateRoomDates']);
        Route::post('/Frontoffice/validate-guest', [ValidateController::class, 'validateGuest']);
    });

    // logout
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});
