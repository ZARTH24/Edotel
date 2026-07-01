<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Tampilkan semua user (admin, siswa, front-office, housekeeping)
        // Filter berdasarkan role jika ada parameter role
        if ($request->has('role') && $request->role != '') {
            $query->where('role', $request->role);
        }

        // Logika fitur pencarian kata kunci (nama / email)
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Sortir: Admin di atas, lalu front-office, housekeeping, siswa paling bawah
        $query->orderByRaw("CASE
            WHEN role = 'admin' THEN 1
            WHEN role = 'front-office' THEN 2
            WHEN role = 'housekeeping' THEN 3
            WHEN role = 'siswa' THEN 4
            ELSE 5
        END");

        // Ambil data terbaru dalam urutan role
        $users = $query->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('Admin/Index', [
            'users' => $users
        ]);
    }

    public function create()
    {
        return inertia('Admin/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        // Semua data di sini dipastikan sudah lolos validasi dari StoreUserRequest
        $data = $request->validated();

        // DB::transaction(function () use ($validated) {
        //     User::create([
        //         'name' => $validated['name'],
        //         'email' => $validated['email'],
        //         // WAJIB: Hash password sebelum disimpan demi keamanan
        //         'password' => Hash::make($validated['password']),
        //         'role' => $validated['role'],
        //         'phone' => $validated['phone'] ?? null,
        //         'is_active' => $validated['is_active'],
        //         // 'avatar' dibiarkan null dulu saat pembuatan awal seperti skema DB
        //     ]);
        // });

        User::create($data);

        // Redirect kembali ke halaman daftar user dengan pesan sukses (Inertia flash message)
        return to_route('user.index')->with([
            'message' => 'User baru berhasil didaftarkan!',
            'type' => 'success'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = User::findOrFail($id);

        return inertia('Admin/Edit', [
            'user' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, string $id)
    {
        $user = User::findOrFail($id);

        $data = $request->validated();

        if (!empty($data['password'])) {
            // Jika password baru diisi, lakukan enkripsi bcrypt/hash
            $data['password'] = Hash::make($data['password']);
        } else {
            // Jika password dikosongkan, hapus dari array $data agar tidak ikut ter-update
            unset($data['password']);
        }

        $user->update($data);

        return to_route('user.index')->with([
            'message' => "Staff data for {$user->name} has been successfully updated.",
            'type' => 'success'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        // Opsional: Mencegah user menghapus akunnya sendiri yang sedang login
        if (auth()->id() == $user->id) {
            return back()->with([
                'message' => 'Anda tidak bisa menghapus akun Anda sendiri yang sedang aktif!',
                'type' => 'error'
            ]);
        }

        $user->delete();

        return back()->with([
            'message' => "Akun staff {$user->name} berhasil dihapus.",
            'type' => 'success'
        ]);
    }
}
