import BookmarksViewContext from '@/contexts/bookmarks-view-context';
import { useState } from 'react';
import { type Bookmark, BookmarksView } from '@/types';

const BookmarksViewProvider = ({ children }) => {
    const [savedBookmark, setSavedBookmark] = useState(null);
    const [selectedBookmarks, setSelectedBookmarks] = useState<Bookmark[]>([]);

    const bookmarksView: BookmarksView = {
        savedBookmark,
        setSavedBookmark,
        selectedBookmarks,
        setSelectedBookmarks,
    };

    return <BookmarksViewContext.Provider value={bookmarksView}>
        {children}
    </BookmarksViewContext.Provider>;
};

export default BookmarksViewProvider;
