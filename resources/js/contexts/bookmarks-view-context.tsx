import { createContext, useContext } from 'react';
import { BookmarksView } from '@/types';

const BookmarksViewContext = createContext<BookmarksView | undefined>(undefined);

export function useBookmarksViewContext() {
    const bookmarksViewContext = useContext(BookmarksViewContext);

    if (bookmarksViewContext === undefined) {
        throw new Error('BookmarksViewContext must be used with a BookmarksViewContext.Provider');
    }

    return { ...bookmarksViewContext };
}

export default BookmarksViewContext;
