<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\BeforeSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class ReservationsExport implements FromArray, WithHeadings, WithStyles, WithEvents
{
    protected $data;
    protected $monthName;
    protected $year;

    public function __construct($data, $monthName, $year)
    {
        $this->data = $data;
        $this->monthName = $monthName;
        $this->year = $year;
    }

    public function registerEvents(): array
    {
        return [
            BeforeSheet::class => function (BeforeSheet $event) {
                $sheet = $event->sheet;
                // Judul Kop Surat (Baris 1)
                $sheet->setCellValue('A1', "DATA RESERVATION BULAN " . strtoupper($this->monthName) . " " . $this->year);
                $sheet->mergeCells('A1:K1');
                $sheet->getStyle('A1')->applyFromArray([
                    'font' => ['bold' => true, 'size' => 14],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                ]);
            },
        ];
    }

    public function headings(): array
    {
        return ['No', 'Booking Ref', 'Nama Tamu', 'Email/Telepon', 'Nomor Kamar', 'Tipe Kamar', 'Check-in', 'Check-out', 'Durasi (Malam)', 'Status', 'Total'];
    }

    public function array(): array
    {
        $rows = [];
        $i = 1;
        foreach ($this->data as $res) {
            $checkIn = new \DateTime($res->check_in);
            $checkOut = new \DateTime($res->check_out);
            $nights = $checkIn->diff($checkOut)->days;

            $rows[] = [
                $i++,
                $res->booking_reference ?? '',
                $res->guest->name ?? '-',
                $res->guest->email ?? '-',
                $res->room->number ?? '-',
                $res->room->type ?? '-',
                $res->check_in,
                $res->check_out,
                $nights,
                $res->status,
                (float) $res->total_price,
            ];
        }
        return $rows;
    }

    public function styles(Worksheet $sheet)
    {
        $highestRow = count($this->data) + 2;

        // 1. Styling Header (Baris 2 - karena menggunakan WithHeadings, header otomatis di baris 2)
        $sheet->getStyle("A2:K2")->applyFromArray([
            'font' => ['bold' => true],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FFD3D3D3']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]
        ]);

        // 2. Loop untuk cek status setiap baris data (Mulai dari baris 3 sampai $highestRow)
        for ($row = 3; $row <= $highestRow; $row++) {
            // Kolom J adalah 'Status'
            $status = $sheet->getCell("J{$row}")->getValue();

            if (strtolower($status) === 'cancelled') {
                $sheet->getStyle("A{$row}:K{$row}")->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['argb' => 'FFFFC7CE']
                    ],
                ]);
            }
        }

        // 3. Border untuk seluruh tabel
        $sheet->getStyle("A2:K{$highestRow}")->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => 'FF000000'],
                ],
            ],
        ]);

        $sheet->getStyle("A2:K{$highestRow}")->applyFromArray([
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]
        ]);

        // 4. Auto size
        foreach (range('A', 'K') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        // 5. Format Rupiah di kolom K (Total)
        $sheet->getStyle("K3:K{$highestRow}")
            ->getNumberFormat()
            ->setFormatCode('"Rp" #,##0');

        return [];
    }
}
