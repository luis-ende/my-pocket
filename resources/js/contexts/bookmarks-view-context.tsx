import React from 'react';
import { BookmarksView } from '@/types';

const BookmarksViewContext = React.createContext<BookmarksView | null>(null);

export default BookmarksViewContext;
