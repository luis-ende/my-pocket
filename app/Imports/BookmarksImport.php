<?php

namespace App\Imports;

use App\Models\Bookmark;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Row;

class BookmarksImport implements ToModel, WithHeadingRow, OnEachRow
{
    private array $tagsToRemove = [
        'to-',
        'to-read',
        'to-watch',
        'to-check',
        'to-chec',
        'to-listen',
        'to-test',
        'to-do',
        'to-translate',
    ];

    public function __construct()
    {
    }

    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        return new Bookmark([
            'title' => $row['title'],
            'url' => $row['url'],
            'tags' => $row['tags'] ? $this->getCleanTags($row['tags']) : null,
            'checked' => !$row['tags'] || !$this->containsTagsToRemove($row['tags']),
        ]);
    }

    public function onRow(Row $row)
    {
        // TODO: Implement onRow() method.
    }

    private function containsTagsToRemove(string $tags): bool
    {
        foreach ($this->tagsToRemove as $tag) {
            if (str_contains($tags, $tag)) {
                return true;
            }
        }

        return false;
    }

    private function getCleanTags(string $tags): string
    {
        $sourceTags = explode('|', $tags);
        $cleanTags = array_diff($sourceTags, $this->tagsToRemove);

        return implode('|', $cleanTags);
    }
}
