import { Dispatch, SetStateAction, useContext, useEffect } from 'react';
import BookmarksViewContext from '@/contexts/bookmarks-view-context';
import { Bookmark } from '@/types';

export default function useNewBookmark(setBookmarks: Dispatch<SetStateAction<Bookmark[]>>) {
    const { savedBookmark } = useContext(BookmarksViewContext);
    useEffect(() => {
        if (savedBookmark) {
            if (savedBookmark.is_new == true && !savedBookmark.checked) {
                setBookmarks((prev: Bookmark[]) =>
                    (!prev.find((b) => b.id === savedBookmark.id) ? [savedBookmark, ...prev] : prev));
            }
        }
    }, [savedBookmark, setBookmarks]);
}
