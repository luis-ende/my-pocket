import BookmarksViewContext from '@/contexts/bookmarks-view-context';
import { PropsWithChildren, useState } from 'react';
import { BookmarksView } from '@/types';

const BookmarksViewProvider = ({ children }: PropsWithChildren) => {
    const [savedBookmark, setSavedBookmark] = useState(null);
    const [selectedBookmarks, setSelectedBookmarks] = useState<number[]>([]);
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
