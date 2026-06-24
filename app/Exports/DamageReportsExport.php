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

class DamageReportsExport implements FromArray, WithHeadings, WithStyles, WithEvents
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
                $sheet->setCellValue('A1', "DATA MAINTENANCE BULAN " . strtoupper($this->monthName) . " " . $this->year);
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
        return ['No', 'Lokasi', 'Ruangan/Kamar', 'Issue', 'Prioritas', 'Status', 'Dilaporkan Oleh', 'Tanggal Lapor', 'Tanggal Selesai', 'Estimasi Biaya', 'Biaya Aktual'];
    }

    public function array(): array
    {
        $rows = [];
        $i = 1;
        foreach ($this->data as $m) {
            $rows[] = [
                $i++,
                $m->lokasi,
                $m->room_id ? 'Room ' . ($m->room->number ?? '') . ' (' . ($m->room->type ?? '') . ')' : ($m->ruangan ?? '-'),
                $m->issue,
                $m->priority,
                $m->status,
                $m->reported_by,
                $m->reported_at,
                $m->completed_at ?? '-',
                $m->estimated_cost ? (float) $m->estimated_cost : 0,
                $m->actual_cost ? (float) $m->actual_cost : 0,
            ];
        }
        return $rows;
    }

    public function styles(Worksheet $sheet)
    {
        $highestRow = count($this->data) + 2;

        $sheet->getStyle("A2:K2")->applyFromArray([
            'font' => ['bold' => true],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FFD3D3D3']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]
        ]);

        for ($row = 3; $row <= $highestRow; $row++) {
            $status = $sheet->getCell("F{$row}")->getValue();
            if (strtolower($status) === 'cancelled') {
                $sheet->getStyle("A{$row}:K{$row}")->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['argb' => 'FFFFC7CE']
                    ],
                ]);
            }
        }

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

        foreach (range('A', 'K') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        $sheet->getStyle("J3:K{$highestRow}")
            ->getNumberFormat()
            ->setFormatCode('"Rp" #,##0');

        return [];
    }
}
