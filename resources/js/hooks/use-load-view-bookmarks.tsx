import { usePage } from '@inertiajs/react';
import type { Bookmark, CursorPaginatedData } from '@/types';
import { useState } from 'react';

export default function useLoadViewBookmarks() {
    const { bookmarks: initialBookmarks } = usePage<{
        bookmarks: CursorPaginatedData<Bookmark>;
    }>().props;
    const [bookmarks, setBookmarks] = useState(initialBookmarks.data);

    return { initialBookmarks, bookmarks, setBookmarks };
}
