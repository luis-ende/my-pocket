import { Bookmark } from '@/types';

export default function deleteBookmarks(bookmarks: Bookmark[], bookmarkId: number) {
    const index = bookmarks.findIndex((item) => item.id == bookmarkId);
    if (index !== -1) {
        bookmarks.splice(index, 1);
    }
}
