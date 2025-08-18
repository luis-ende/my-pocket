import BookmarksViewContext from '@/contexts/bookmarks-view-context';
import { PropsWithChildren, useState } from 'react';
import { BookmarksView, DirtyBookmarkState } from '@/types';

const BookmarksViewProvider = ({ children }: PropsWithChildren) => {
    const [savedBookmark, setSavedBookmark] = useState(null);
    const [selectedBookmarks, setSelectedBookmarks] = useState<number[]>([]);
    const [dirtyBookmarksState, setDirtyBookmarksState] = useState<DirtyBookmarkState>({
        dirty: false,
        operation: '',
        ids: null,
    });
    const bookmarksView: BookmarksView = {
        savedBookmark,
        setSavedBookmark,
        selectedBookmarks,
        setSelectedBookmarks,
        dirtyBookmarksState,
        setDirtyBookmarksState,
    };

    return <BookmarksViewContext.Provider value={bookmarksView}>
        {children}
    </BookmarksViewContext.Provider>;
};

export default BookmarksViewProvider;
