import BookmarksContext from '@/contexts/bookmarks-context';
import { useState } from 'react';

const BookmarksProvider = ({ children }) => {
    const [savedBookmark, setSavedBookmark] = useState(null);

    return <BookmarksContext.Provider value={{ savedBookmark, setSavedBookmark }}>{children}</BookmarksContext.Provider>;
};

export default BookmarksProvider;
