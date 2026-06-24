<?php

namespace App\Http\Controllers\FrontOffice;

use App\Http\Controllers\Controller;
use App\Http\Requests\FrontOffice\GuestRequest;
use App\Http\Requests\FrontOffice\RoomDateRequest;

class ValidateController extends Controller
{
    public function validateGuest(GuestRequest $request)
    {
        return back();
    }

    public function ValidateRoomDates(RoomDateRequest $request)
    {
        return back();
    }
}
