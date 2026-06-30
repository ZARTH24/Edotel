# Assets/Forms

Folder ini berisi preview gambar form hotel untuk E-Learning module.

## Struktur Folder

```
public/assets/forms/
│
├── reception/                           # Gambar untuk Reception
│   ├── Reservation form (1)_PNG/
│   ├── Reservation Slip (2)_PNG/
│   ├── Expected Arrival Liest (3)_PNG/
│   ├── Reservation Diary (4)_PNG/
│   ├── Conventional Chart (5)_PNG/
│   └── Reservation Confirmation (6)_PNG/
│
└── reservation/                         # Gambar untuk Reservation (Reception Forms)
    ├── Registration Form (1).png
    ├── GUEST CARD (2).png
    ├── BREAKFAST COUPON (3).png
    ├── GUEST IN HOUSE FORM (5).png
    ├── Arrival Book (6)_PNG/
    ├── Cash Receipt (4)_PNG/
    ├── Departure Book (7)_PNG/
    ├── Expected Departure Liest (8)_PNG/
    └── Guest  Bill (9)_PNG/

```

## Mapping Exercise Slug ke Gambar

### Reception Exercises
| Slug | Path Gambar |
|------|-------------|
| registration-form | `/assets/forms/reservation/Registration Form (1).png` |
| guest-card | `/assets/forms/reservation/GUEST CARD (2).png` |
| breakfast-coupon | `/assets/forms/reservation/BREAKFAST COUPON (3).png` |
| guest-in-house | `/assets/forms/reservation/GUEST IN HOUSE FORM (5).png` |
| arrival-book | `/assets/forms/reservation/Arrival Book (6)_PNG/...` |
| cash-receipt | `/assets/forms/reservation/Cash Receipt (4)_PNG/...` |
| departure-book | `/assets/forms/reservation/Departure Book (7)_PNG/...` |
| expected-departure | `/assets/forms/reservation/Expected Departure Liest (8)_PNG/...` |
| guest-bill | `/assets/forms/reservation/Guest Bill (9)_PNG/...` |

### Reservation Exercises
| Slug | Path Gambar |
|------|-------------|
| reservation-form | `/assets/forms/reception/Reservation form (1)_PNG/...` |
| reservation-slip | `/assets/forms/reception/Reservation Slip (2)_PNG/...` |
| expected-arrival | `/assets/forms/reception/Expected Arrival Liest (3)_PNG/...` |
| reservation-diary | `/assets/forms/reception/Reservation Diary (4)_PNG/...` |
| conventional-chart | `/assets/forms/reception/Conventional Chart (5)_PNG/...` |
| reservation-confirmation | `/assets/forms/reception/Reservation Confirmation (6)_PNG/...` |

## Note

- Folder dan file sudah disesuaikan dengan nama dokumen asli
- Beberapa form memiliki multiple pages (subfolder _PNG)
- Service `ExerciseImageService.php` menangani mapping otomatis
