<?php

namespace Database\Seeders;

use App\Imports\BookmarksImport;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Maatwebsite\Excel\Facades\Excel;

class BookmarkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $import = new BookmarksImport;
        $files = File::files(base_path('database/data/imports/bookmarks'));
        foreach ($files as $file) {
            Excel::import($import,
                base_path('database/data/imports/bookmarks/'.$file->getFilename()));
        }
    }
}
