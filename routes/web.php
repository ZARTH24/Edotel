<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\FrontOffice\ReservationController;
use App\Http\Controllers\FrontOffice\RoomController;
use App\Http\Controllers\FrontOffice\ValidateController;
use App\Http\Controllers\HouseKeeping\CleaningTaskController;
use App\Http\Controllers\Pages\DamageReportController;
use App\Http\Controllers\Pages\PagesController;
use App\Http\Middleware\RedirectIfAuthenticatedCustom;
use App\Http\Middleware\RoleCheck;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

   Route::middleware([RoleCheck::class . ':admin'])->group(function () {
      Route::get('/User/daftarUser', [UserController::class, 'index'])->name('user.index');
      Route::get('/User/create', [UserController::class, 'create']);
      Route::post('/User/store', [UserController::class, 'store'])->name('user.store');
      Route::get('/User/{id}/edit', [UserController::class, 'edit'])->name('user.edit');
      Route::put('/User/{id}', [UserController::class, 'update'])->name('user.update');
      Route::delete('/User/{id}', [UserController::class, 'destroy'])->name('user.destroy');
   });

    Route::middleware([RoleCheck::class . ':admin,front-office'])->group(function () {
       // DashBoard
       Route::get('/Dashboard', [PagesController::class, 'dashboard'])->name('Dashboard');
       Route::get('/Frontoffice', [PagesController::class, 'frontoffice'])->name('Frontoffice');

       // DamageReport
       Route::get('/Damagereport', [DamageReportController::class, 'index'])->name('DamageReport');
       Route::get('/Damagereport/{id}/details', [DamageReportController::class, 'show']);
       Route::post('/Damagereport/add', [DamageReportController::class, 'store']);
       Route::post('/Damagereport/{id}/approve', [DamageReportController::class, 'approve']);
       Route::post('/Damagereport/{id}/assign', [DamageReportController::class, 'assign']);
       Route::post('/Damagereport/{id}/completed', [DamageReportController::class, 'complete']);
       Route::get('/Damagereport/export', [DamageReportController::class, 'exportHistory']);

      // Room
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

      // Reservation
      Route::get('/Frontoffice/reservation/create', [ReservationController::class, 'create'])->name('createReservation');
      Route::post('/Frontoffice/reservation', [ReservationController::class, 'store'])->name('storeReservation');
      Route::get('/Frontoffice/reservations/{booking_reference}/details', [ReservationController::class, 'show']);
      Route::get('/Frontoffice/reservations/{reservation}/edit', [ReservationController::class, 'edit'])
         ->name('reservations.edit');
      Route::put('/Frontoffice/reservations/{reservation}', [ReservationController::class, 'update'])
         ->name('reservation.update');

      Route::post('/Frontoffice/reservations/{reservation}/checkin', [ReservationController::class, 'checkin']);
      Route::post('/Frontoffice/reservations/{reservation}/checkout', [ReservationController::class, 'checkout']);
      Route::post('/Frontoffice/reservations/{reservation}/cancel', [ReservationController::class, 'cancel']);
      Route::get('/Frontoffice/reservations/export', [ReservationController::class, 'exportHistory']);
   });

   Route::middleware([RoleCheck::class . ':admin,housekeeping'])->group(function () {
      Route::get('/Housekeeping', [PagesController::class, 'housekeeping']);

      // Cleaning Task
      Route::post('/Housekeeping/cleaning-task', [CleaningTaskController::class, 'store']);
      Route::post('/cleaning-tasks/{task}/assign', [CleaningTaskController::class, 'assignCleaningTask']);
      Route::post('/cleaning-tasks/{task}/completed', [CleaningTaskController::class, 'completedCleaningTask']);
      Route::post('/cleaning-tasks/{task}/inspected', [CleaningTaskController::class, 'inspectCleaningTask']);
   });

    // logout
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});
