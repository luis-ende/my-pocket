import { Dispatch, SetStateAction, useEffect } from 'react';
import { useBookmarksViewContext } from '@/contexts/bookmarks-view-context';
import { Bookmark } from '@/types';

export default function useNewBookmark(setBookmarks: Dispatch<SetStateAction<Bookmark[]>>) {
    const { savedBookmark } = useBookmarksViewContext();
    useEffect(() => {
        if (savedBookmark) {
            if (savedBookmark.is_new == true && !savedBookmark.checked) {
                setBookmarks((prev: Bookmark[]) =>
                    (!prev.find((b) => b.id === savedBookmark.id) ? [savedBookmark, ...prev] : prev));
            }
        }
    }, [savedBookmark, setBookmarks]);
}
