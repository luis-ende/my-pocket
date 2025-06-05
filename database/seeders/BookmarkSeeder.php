<?php

namespace Database\Seeders;

use App\Imports\BookmarksImport;
use Illuminate\Database\Seeder;
use Maatwebsite\Excel\Facades\Excel;

class BookmarkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $path = base_path('database/data/imports/part_000000.csv');
        $import = new BookmarksImport();

        Excel::import($import, $path);
    }
}
