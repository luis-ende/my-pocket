<?php

namespace App\Rules;

final class BookmarkRules
{
    public static function base(): array
    {
        return [
            'tags' => [
                'nullable',
                'string',
                'max:300',
                new PipeDelimitedTags,
            ],
            'read' => 'boolean',
        ];
    }
}
