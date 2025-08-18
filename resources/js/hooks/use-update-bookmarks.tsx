import { Bookmark, BookmarkBulkDTO } from '@/types';
import { SetStateAction } from 'react';

export default function updateBookmarks(
    setBookmarks: { (value: SetStateAction<Bookmark[]>): void; (arg0: (prev: Bookmark[]) => Bookmark[]): void },
    bookmarkIds: number[],
    data: BookmarkBulkDTO,
) {
    const changes = Object.fromEntries(
        Object.entries(data).filter(([v]) => v !== null)
    );

    if (Object.entries(changes).length > 0) {
        setBookmarks((prev) =>
            prev.map((row) => (bookmarkIds.includes(row.id) ? { ...row, ...changes } : row))
        );
    }
}
