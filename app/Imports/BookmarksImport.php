<?php

namespace App\Imports;

use App\Models\Bookmark;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Row;

class BookmarksImport implements OnEachRow, ToModel, WithHeadingRow
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

    public function __construct() {}

    /**
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        $createdAt = \DateTime::createFromFormat('Y-m-d\TH:i:s', $row['time_added']);
        if ($createdAt === false) {
            $createdAt = date('Y-m-d H:i:s', $row['time_added']);
        }

        return new Bookmark([
            'title' => $row['title'],
            'url' => $row['url'],
            'tags' => $row['tags'] && $row['tags'] !== '' ? $this->getCleanTags($row['tags']) : null,
            'checked' => ! $row['tags'] || ! $this->containsTagsToRemove($row['tags']),
            'created_at' => $createdAt,
        ]);
    }

    public function onRow(Row $row) {}

    private function containsTagsToRemove(string $tags): bool
    {
        foreach ($this->tagsToRemove as $tag) {
            if (str_contains($tags, $tag)) {
                return true;
            }
        }

        return false;
    }

    private function getCleanTags(string $tags): ?string
    {
        $sourceTags = explode('|', $tags);
        $cleanTags = array_diff($sourceTags, $this->tagsToRemove);

        return count($cleanTags) > 0 ? implode('|', $cleanTags) : null;
    }
}
