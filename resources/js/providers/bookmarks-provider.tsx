import React, { useState } from 'react';
import BookmarksContext from '@/contexts/bookmarks-context';

const BookmarksProvider = ({ children }) => {
    const [newBookmark, setNewBookmark] = useState(null);

    return (
        <BookmarksContext.Provider value={{ newBookmark, setNewBookmark }}>
            {children}
        </BookmarksContext.Provider>
    );

}

export default BookmarksProvider;
