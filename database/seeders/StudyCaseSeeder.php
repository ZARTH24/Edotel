<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StudyCaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // =====================================================
        // RECEPTION STUDY CASES (9 forms)
        // =====================================================

        $studyCases = [
            // =====================================================
            // 1. Registration Form
            // =====================================================
            [
                'exercise_slug' => 'registration-form',
                'title' => 'Tamu Baru Check-In',
                'content' => <<<'TEXT'
Halo, selamat pagi! Saya Andika Pratama, saya sudah booking kamar untuk 2 malam mulai besok.

Saya pesan kamar Deluxe melalui travel agent saya, atas nama PT Nusa Indah. Berikut detail reservasi saya:

- Booking Reference: INV-20260628-0001
- Nama Tamu: Andika Pratama
- Email: andika.pratama@nusaindah.co.id
- No. Telepon: 081234567890
- Tipe Identitas: KTP
- No. Identitas: 7501051234567890
- Kewarganegaraan: Indonesia
- Tanggal Lahir: 15 Maret 1985
- Alamat: Jl. Sudirman No. 45, Jakarta Selatan

Untuk kamar, saya minta lantai 3 atau lebih ke atas. Kamar untuk 2 orang, termasuk sarapan untuk 2 orang.

Estimasi check-in besok pagi sekitar jam 09.00. Pembayaran via transfer bank.

Apakah kamar Deluxe sudah tersedia sesuai request saya?
TEXT,
                'estimated_time' => 240,
            ],

            // =====================================================
            // 2. Guest Card
            // =====================================================
            [
                'exercise_slug' => 'guest-card',
                'title' => 'Pembuatan Guest Card',
                'content' => <<<'TEXT'
Tamu yang baru check-in tadi siang:

- Nama: Budi Santoso
- No. Kamar: 205
- Check-in: 28 Juni 2026, jam 14.30
- Check-out: 30 Juni 2026
- Tipe Kamar: Superior
- Room Rate: Rp 650.000/malam

Data tambahan tamu:
- Alamat: Jl. Ahmad Yani No. 12, Semarang
- No. HP: 082345678901
- Email: budi.santoso@gmail.com
- Jenis Kelamin: Laki-laki
- Kewarganegaraan: Indonesia
- No. Identitas: 3310054567891234 (KTP)

Tamu meminta wake-up call jam 06.30 besok pagi dan minta breakfast di kamar.
TEXT,
                'estimated_time' => 180,
            ],

            // =====================================================
            // 3. Breakfast Coupon
            // =====================================================
            [
                'exercise_slug' => 'breakfast-coupon',
                'title' => 'Penerbitan Breakfast Coupon',
                'content' => <<<'TEXT'
Tamu kamar 305, Ibu Sari Dewi, check-in tadi sore.

Detail breakfast coupon:
- Nama Tamu: Sari Dewi
- No. Kamar: 305
- Jumlah Tamu: 2 orang (dewasa)
- Check-in: 27 Juni 2026
- Check-out: 29 Juni 2026
- Plan: Superior Room dengan Breakfast

Breakfast schedule:
- Tanggal 28 Juni 2026: 2 coupon
- Tanggal 29 Juni 2026: 2 coupon
- Total: 4 coupon

Tamu meminta breakfast di restoran utama setiap jam 07.00-10.00 pagi.
Mohon print coupon untuk 2 hari breakfast.
TEXT,
                'estimated_time' => 120,
            ],

            // =====================================================
            // 4. Guest In House Form
            // =====================================================
            [
                'exercise_slug' => 'guest-in-house',
                'title' => 'Update Guest In House',
                'content' => <<<'TEXT'
Update status guest in house per 28 Juni 2026, jam 18.00:

Kamar 201:
- Tamu: Ratna Kusuma
- Check-in: 27 Juni, Check-out: 29 Juni
- Room Rate: Rp 750.000
- Pembayaran: Cash
- Breakfast: Ya (2 pax)

Kamar 202:
- Tamu: Doni Firmansyah
- Check-in: 28 Juni, Check-out: 01 Juli
- Room Rate: Rp 650.000
- Pembayaran: Credit Card
- Breakfast: Ya (1 pax)

Kamar 205:
- Tamu: Ahmad Rizki
- Check-in: 28 Juni, Check-out: 30 Juni
- Room Rate: Rp 650.000
- Pembayaran: Transfer
- Breakfast: Ya (2 pax)

Kamar 301:
- Tamu: Maya Putri
- Check-in: 26 Juni, Check-out: 28 Juni
- Room Rate: Rp 850.000
- Pembayaran: Cash
- Breakfast: Ya (1 pax)

Total Guest In House: 4 kamar
Total Tamu: 6 orang
Total Revenue: Rp 2.900.000
TEXT,
                'estimated_time' => 300,
            ],

            // =====================================================
            // 5. Arrival Book
            // =====================================================
            [
                'exercise_slug' => 'arrival-book',
                'title' => 'Pencatatan Arrival Book',
                'content' => <<<'TEXT'
Forecast arrival untuk tanggal 29 Juni 2026:

1. Kamar 201 - Reserved for Ratna Kusuma
   - Origin: Jakarta
   - Flight: GA 601, arrive 10.30
   - Transport: Self
   - Purpose: Business
   - Length of Stay: 2 nights
   - Room Rate: Rp 750.000
   - Payment: Cash

2. Kamar 203 - Reserved for Hendra Wijaya
   - Origin: Surabaya
   - Flight: SI 205, arrive 14.00
   - Transport: Hotel Transfer
   - Purpose: Leisure
   - Length of Stay: 3 nights
   - Room Rate: Rp 750.000
   - Payment: Credit Card

3. Kamar 207 - Reserved for Linda Tanoto
   - Origin: Makassar
   - Flight: JT 890, arrive 16.45
   - Transport: Self
   - Purpose: Business
   - Length of Stay: 1 night
   - Room Rate: Rp 650.000
   - Payment: Company Account (PT Maju Bersama)

Total Arrival: 3 rooms
Expected Revenue: Rp 2.150.000
TEXT,
                'estimated_time' => 240,
            ],

            // =====================================================
            // 6. Cash Receipt
            // =====================================================
            [
                'exercise_slug' => 'cash-receipt',
                'title' => 'Pembuatan Cash Receipt',
                'content' => <<<'TEXT'
Transaksi pembayaran tamu hari ini:

Pembayaran 1 - Kamar 205 (Ahmad Rizki):
- Room Charge: Rp 650.000 (1 night)
- Tax 10%: Rp 65.000
- Total: Rp 715.000
- Payment Method: Cash
- Amount Received: Rp 750.000
- Change: Rp 35.000

Pembayaran 2 - Kamar 301 (Maya Putri):
- Room Charge: Rp 850.000 (2 nights)
- Extra Bed: Rp 150.000
- Laundry: Rp 75.000
- Tax 10%: Rp 107.500
- Total: Rp 1.182.500
- Payment Method: Credit Card (BCA)
- Card Number: 1234-5678-9012-3456

Pembayaran 3 - Kamar 202 (Doni Firmansyah):
- Room Charge: Rp 650.000 (1 night)
- Breakfast Extra: Rp 85.000
- Tax 10%: Rp 73.500
- Total: Rp 808.500
- Payment Method: Transfer Bank BRI
- Account Number: 1234-01-1234567-56
TEXT,
                'estimated_time' => 300,
            ],

            // =====================================================
            // 7. Departure Book
            // =====================================================
            [
                'exercise_slug' => 'departure-book',
                'title' => 'Pencatatan Departure Book',
                'content' => <<<'TEXT'
Forecast departure untuk tanggal 29 Juni 2026:

1. Kamar 201 - Ratna Kusuma
   - Check-out Time: 12.00
   - Flight: GA 602, depart 15.30
   - Transport Needed: Yes (Airport Transfer)
   - Total Bill: Rp 1.575.000 (2 nights + tax)
   - Payment Status: Paid Cash
   - Room Status: Expected Dirty
   - Notes: Early departure, no breakfast tomorrow

2. Kamar 207 - Linda Tanoto
   - Check-out Time: 14.00
   - Flight: JT 891, depart 18.00
   - Transport Needed: No (self transport)
   - Total Bill: Rp 715.000 (1 night + tax)
   - Payment Status: Company Account
   - Room Status: Expected Ready
   - Notes: Express checkout, invoice to email

3. Kamar 301 - Maya Putri
   - Check-out Time: 12.00
   - Flight: none (local)
   - Transport Needed: Yes (pickup by family)
   - Total Bill: Rp 1.182.500 (paid yesterday)
   - Payment Status: Paid Credit Card
   - Room Status: Expected Dirty
   - Notes: Luggage stored until 16.00

Total Departure: 3 rooms
Total Revenue: Rp 3.472.500
TEXT,
                'estimated_time' => 240,
            ],

            // =====================================================
            // 8. Expected Departure List
            // =====================================================
            [
                'exercise_slug' => 'expected-departure',
                'title' => 'Expected Departure List',
                'content' => <<<'TEXT'
Expected Departure List - 30 Juni 2026:

1. Kamar 202 - Doni Firmansyah
   - Departure Date: 30 Juni 2026
   - Original Check-out: 01 Juli 2026
   - Actual Departure: Early checkout
   - Duration: 3 nights (28-30 Juni)
   - Room Rate: Rp 650.000 x 3 = Rp 1.950.000
   - Total with Tax: Rp 2.145.000
   - Payment: Credit Card (paid at checkout)
   - Luggage: 2 bags to bellboy desk
   - Special Request: Invoice untuk perusahaan

2. Kamar 205 - Ahmad Rizki
   - Departure Date: 30 Juni 2026
   - Original Check-out: 30 Juni 2026
   - Actual Departure: On schedule
   - Duration: 2 nights (28-30 Juni)
   - Room Rate: Rp 650.000 x 2 = Rp 1.300.000
   - Total with Tax: Rp 1.430.000
   - Payment: Cash (paid at check-in)
   - Luggage: No
   - Special Request: Print boarding pass

3. Kamar 305 - Sari Dewi
   - Departure Date: 30 Juni 2026
   - Original Check-out: 29 Juni 2026
   - Actual Departure: Extended stay
   - New Check-out: 30 Juni 2026
   - Duration: 3 nights (27-30 Juni)
   - Room Rate: Rp 650.000 x 3 = Rp 1.950.000
   - Total with Tax: Rp 2.145.000
   - Payment: Credit Card (charged extra night)
   - Luggage: 1 bag
   - Special Request: Late checkout until 14.00 if available

Total Expected Departure: 3 rooms
Total Revenue: Rp 5.720.000
TEXT,
                'estimated_time' => 240,
            ],

            // =====================================================
            // 9. Guest Bill
            // =====================================================
            [
                'exercise_slug' => 'guest-bill',
                'title' => 'Pembuatan Guest Bill',
                'content' => <<<'TEXT'
Guest Bill untuk check-out:

Kamar 201 - Ratna Kusuma
Tanggal: 29 Juni 2026

Room Charges:
- 27 Juni 2026: Superior Room x 2 nights = Rp 1.500.000
- 28 Juni 2026: Room Tax 10% = Rp 150.000

Extra Charges:
- Minibar (27 Juni): Rp 125.000
- Restaurant Dinner (27 Juni): Rp 285.000
- Laundry Service (28 Juni): Rp 75.000
- Airport Transfer (28 Juni): Rp 150.000
- Extra Bed (28 Juni): Rp 150.000

Subtotal Extra: Rp 785.000
Tax Extra (10%): Rp 78.500

SUMMARY:
Room Charges: Rp 1.650.000
Extra Charges: Rp 863.500
TOTAL GUEST BILL: Rp 2.513.500

Payment Details:
- Paid at Check-in (Cash): Rp 1.650.000
- Balance Due: Rp 863.500
- Payment Method: Credit Card (Visa ending 4321)

Guest Signature: Ratna Kusuma
Cashier: Front Office
TEXT,
                'estimated_time' => 360,
            ],

            // =====================================================
            // RESERVATION STUDY CASES (6 forms)
            // =====================================================

            // =====================================================
            // 10. Reservation Form
            // =====================================================
            [
                'exercise_slug' => 'reservation-form',
                'title' => 'Penerimaan Reservasi Telepon',
                'content' => <<<'TEXT'
Reservation Call - 28 Juni 2026, Jam 10.30

Caller: Mrs. Hendra Wijaya
Phone: 081234567890
Email: hendra.wijaya@email.com

RESERVATION DETAILS:
- Guest Name: Hendra Wijaya
- Address: Jl. Gatot Subroto No. 88, Surabaya
- Phone: 031-7654321 (Office), 081234567890 (Mobile)
- Company: PT Wijaya Corpora
- Email: hendra.wijaya@wijayacorpora.co.id

BOOKING REQUEST:
- Arrival Date: 29 Juni 2026
- Departure Date: 02 Juli 2026
- Duration: 3 malam
- Room Type: Deluxe Room
- Number of Rooms: 1
- Number of Guests: 2 adults
- Room Rate: Rp 850.000/malam
- Total Estimate: Rp 2.550.000 + tax

SPECIAL REQUESTS:
- High floor (4th floor or above)
- Non-smoking room
- King size bed
- Airport pickup from Juanda Airport (ETA: 14.00)
- Late check-out until 15.00 (subject to availability)

GUEST STATUS:
- First time guest (new account)
- Corporate client (PT Wijaya Corpora)
- Payment: Company account with billing

Reservation confirmed with booking reference INV-20260628-0002.
Deposit required: None (corporate billing)
TEXT,
                'estimated_time' => 300,
            ],

            // =====================================================
            // 11. Reservation Slip
            // =====================================================
            [
                'exercise_slug' => 'reservation-slip',
                'title' => 'Pembuatan Reservation Slip',
                'content' => <<<'TEXT'
Reservation Confirmation - 28 Juni 2026

GUEST INFORMATION:
- Name: Linda Tanoto
- Company: PT Maju Bersama
- Address: Jl. Pangeran Diponegoro No. 56, Makassar
- Phone: 0411-876543
- Email: linda.tanoto@majubersama.co.id

RESERVATION DETAILS:
- Booking Reference: INV-20260628-0003
- Arrival Date: 29 Juni 2026
- Departure Date: 30 Juni 2026
- Room Type: Superior Room
- Room Number: 207
- Room Rate: Rp 650.000/malam
- Number of Guests: 1 adult
- Total Room Charge: Rp 650.000
- Tax (10%): Rp 65.000
- Grand Total: Rp 715.000

PAYMENT:
- Payment Method: Company Account
- Account: PT Maju Bersama
- Account Number: 1234567890
- Bank: Bank Central Asia (BCA)
- Billing Address: Jl. Pangeran Diponegoro No. 56, Makassar

SPECIAL ARRANGEMENTS:
- Expected Arrival: 16.45 (JT 890)
- Airport: Sultan Hasanuddin International Airport
- Transport: Self drive (rental car)
- Early Check-in: Requested (subject to availability)

REMARKS:
- Invoice to be sent to company email
- ETA to be confirmed by guest
- VIP guest - prepare welcome amenities
TEXT,
                'estimated_time' => 240,
            ],

            // =====================================================
            // 12. Expected Arrival List
            // =====================================================
            [
                'exercise_slug' => 'expected-arrival',
                'title' => 'Expected Arrival List',
                'content' => <<<'TEXT'
EXPECTED ARRIVAL LIST
Date: 30 Juni 2026

1. Room 201 - Ratna Kusuma
   - Origin: Jakarta
   - ETA: 10.30
   - Flight: GA 601
   - Transport: Hotel Transfer arranged
   - Purpose: Business meeting
   - LOS: 2 nights (30 Juni - 02 Juli)
   - Rate: Rp 750.000
   - Payment: Corporate (PT Nusa Bangsa)
   - Status: Confirmed
   - Remarks: VIP - CEO

2. Room 203 - Hendra Wijaya
   - Origin: Surabaya
   - ETA: 14.00
   - Flight: SI 205
   - Transport: Airport Pickup
   - Purpose: Conference
   - LOS: 3 nights (30 Juni - 03 Juli)
   - Rate: Rp 850.000
   - Payment: Company Account
   - Status: Confirmed
   - Remarks: Pickup request for 2 persons

3. Room 205 - Rina Hartati
   - Origin: Local Guest
   - ETA: 18.00
   - Flight: None
   - Transport: Self
   - Purpose: Family vacation
   - LOS: 4 nights (30 Juni - 04 Juli)
   - Rate: Rp 650.000
   - Payment: Credit Card (prepaid)
   - Status: Confirmed
   - Remarks: Extra bed needed (child 12 years)

4. Room 301 - David Chen
   - Origin: Singapore
   - ETA: 20.00
   - Flight: SQ 956
   - Transport: Airport Pickup
   - Purpose: Business
   - LOS: 5 nights (30 Juni - 05 Juli)
   - Rate: Rp 950.000 (Executive Room)
   - Payment: Credit Card (Guarantee)
   - Status: Confirmed
   - Remarks: Late arrival, early check-in confirmed

TOTAL ARRIVAL: 4 rooms
EXPECTED REVENUE: Rp 7.950.000
TEXT,
                'estimated_time' => 240,
            ],

            // =====================================================
            // 13. Reservation Diary
            // =====================================================
            [
                'exercise_slug' => 'reservation-diary',
                'title' => 'Reservation Diary Analysis',
                'content' => <<<'TEXT'
RESERVATION DIARY
Period: 01 - 07 Juli 2026

JULI 01, 2026:
- Room 201: Arrival - Ratna Kusuma (new) - Superior
- Room 205: Arrival - Rina Hartati (repeat) - Superior
- Room 201: Stayover - Departed yesterday (Ratna) - Dirty
- Total Rooms: 2 arrivals, 1 stayover

JULI 02, 2026:
- Room 201: Departure - Ratna Kusuma
- Room 202: Arrival - New Guest (Booking ID: BK-001) - Deluxe
- Room 203: Stayover - Hendra Wijaya
- Total Rooms: 1 arrival, 1 departure, 1 stayover

JULI 03, 2026:
- Room 203: Departure - Hendra Wijaya
- Room 206: Arrival - Corporate Group (5 rooms) - Superior
- Room 301: Stayover - David Chen
- Total Rooms: 6 arrivals (5+1), 1 departure, 1 stayover

JULI 04, 2026:
- Room 205: Departure - Rina Hartati
- Room 206: Stayover - Corporate Group Day 2
- Room 301: Stayover - David Chen
- Total Rooms: 0 arrivals, 1 departure, 3 stayovers

JULI 05, 2026:
- Room 206: Departure - Corporate Group
- Room 301: Departure - David Chen
- No Arrivals Scheduled
- Total Rooms: 0 arrivals, 2 departures

JULI 06, 2026:
- Room 207: Arrival - Weekend Guest - Superior
- Room 210: Arrival - Weekend Guest - Deluxe
- Total Rooms: 2 arrivals

JULI 07, 2026:
- Room 207: Departure - Weekend Guest
- Room 210: Departure - Weekend Guest
- Total Rooms: 0 arrivals, 2 departures
TEXT,
                'estimated_time' => 360,
            ],

            // =====================================================
            // 14. Conventional Chart
            // =====================================================
            [
                'exercise_slug' => 'conventional-chart',
                'title' => 'Conventional Chart Room Status',
                'content' => <<<'TEXT'
CONVENTIONAL CHART - ROOM STATUS BOARD
Date: 30 Juni 2026

FLOOR 2 (Standard/Superior):
┌──────┬──────────┬─────────┬────────┬──────────┐
│ Room │ Type     │ Status  │ Guest │ Due Out  │
├──────┼──────────┼─────────┼────────┼──────────┤
│ 201  │ Superior │ Arrival │ New   │ 02 Juli  │
│ 202  │ Deluxe   │ OCC     │ ----  │ ----     │
│ 203  │ Deluxe   │ Arrival │ New   │ 03 Juli  │
│ 204  │ Superior │ VA      │ ----  │ ----     │
│ 205  │ Superior │ Arrival │ New   │ 04 Juli  │
│ 206  │ Superior │ OCC     │ ----  │ ----     │
└──────┴──────────┴─────────┴────────┴──────────┘

FLOOR 3 (Deluxe):
┌──────┬──────────┬─────────┬────────┬──────────┐
│ Room │ Type     │ Status  │ Guest │ Due Out  │
├──────┼──────────┼─────────┼────────┼──────────┤
│ 301  │ Deluxe   │ OCC     │ ----  │ 05 Juli  │
│ 302  │ Deluxe   │ OCC     │ ----  │ 01 Juli  │
│ 303  │ Deluxe   │ OOO     │ ----  │ ----     │
│ 304  │ Deluxe   │ OCC     │ ----  │ 02 Juli  │
│ 305  │ Deluxe   │ Arrival │ Walkin │ 01 Juli  │
│ 306  │ Deluxe   │ VA      │ ----  │ ----     │
└──────┴──────────┴─────────┴────────┴──────────┘

FLOOR 4 (Executive):
┌──────┬───────────┬─────────┬────────┬──────────┐
│ Room │ Type      │ Status  │ Guest │ Due Out  │
├──────┼───────────┼─────────┼────────┼──────────┤
│ 401  │ Executive │ OCC     │ VIP   │ 03 Juli  │
│ 402  │ Executive │ OOO     │ ----  │ ----     │
│ 403  │ Executive │ OCC     │ ----  │ 04 Juli  │
│ 404  │ Executive │ VA      │ ----  │ ----     │
│ 405  │ Suite     │ OCC     │ ----  │ 05 Juli  │
│ 406  │ Suite     │ Arrival │ New   │ 07 Juli  │
└──────┴───────────┴─────────┴────────┴──────────┘

STATUS LEGEND:
- OCC: Occupied
- VA: Vacant Available
- OOO: Out of Order
- Arrival: Expected arrival today
- Departure: Expected departure today

SUMMARY:
Total Rooms: 18
Occupied: 10
Vacant Available: 5
Out of Order: 1
Arrivals Today: 4
Departures Today: 3
Occupancy Rate: 55.5%
TEXT,
                'estimated_time' => 420,
            ],

            // =====================================================
            // 15. Reservation Confirmation
            // =====================================================
            [
                'exercise_slug' => 'reservation-confirmation',
                'title' => 'Reservation Confirmation Letter',
                'content' => <<<'TEXT'
RESERVATION CONFIRMATION
Booking Reference: INV-20260628-0004

Date: 28 Juni 2026

Dear Mr. David Chen,

Thank you for choosing Grand Luxury Hotel for your upcoming stay. We are pleased to confirm your reservation as follows:

GUEST DETAILS:
- Guest Name: David Chen
- Company: David Chen Consulting
- Email: david.chen@consulting.sg
- Phone: +65 9876 5432

RESERVATION DETAILS:
- Booking Reference: INV-20260628-0004
- Check-in Date: 30 Juni 2026
- Check-out Date: 05 Juli 2026
- Duration: 5 nights
- Room Type: Executive Room
- Room Rate: Rp 950.000 per night
- Number of Guests: 1 adult

ROOM CHARGES:
- Room Rate: Rp 950.000 x 5 nights = Rp 4.750.000
- Government Tax (10%): Rp 475.000
- TOTAL ESTIMATED CHARGES: Rp 5.225.000

PAYMENT METHOD:
- Guarantee: Credit Card (Visa ending 7890)
- Settlement: Upon check-out

ARRIVAL INFORMATION:
- Estimated Arrival: 20.00 (30 Juni 2026)
- Flight: SQ 956 from Singapore
- Airport Pickup: Arranged (complimentary)
- Contact: +62 811 1234 567 (Concierge)

SPECIAL REQUESTS CONFIRMED:
✓ Early check-in (subject to room availability)
✓ Airport transfer
✓ High floor non-smoking room
✓ Welcome amenities for VIP

REMARKS:
Please present this confirmation and a valid ID upon check-in.
Check-in time: 14.00 | Check-out time: 12.00

Should you need any assistance, please contact us at:
Phone: +62 431 123 456
Email: reservations@grandluxuryhotel.com

We look forward to welcoming you.

Warm regards,
Reservation Department
Grand Luxury Hotel

This is an automatically generated confirmation. No signature required.
TEXT,
                'estimated_time' => 360,
            ],
        ];

        // Insert study cases
        foreach ($studyCases as $studyCase) {
            // Find exercise by slug
            $exercise = DB::table('exercises')
                ->where('slug', $studyCase['exercise_slug'])
                ->first();

            if ($exercise) {
                DB::table('study_cases')->insert([
                    'exercise_id' => $exercise->id,
                    'title' => $studyCase['title'],
                    'content' => $studyCase['content'],
                    'estimated_time' => $studyCase['estimated_time'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('Seeded ' . count($studyCases) . ' study cases.');
    }
}
