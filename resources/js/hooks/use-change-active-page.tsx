import { useContext, useEffect } from 'react';
import { saveViewConfig } from '@/hooks/use-view-config';
import { BookmarksViewConfig } from '@/types';
import BookmarksViewContext from '@/contexts/bookmarks-view-context';

export default function useChangeActivePage(viewConfig: BookmarksViewConfig) {
    const { setSelectedBookmarks } = useContext(BookmarksViewContext);

    useEffect(() => {
        return () => {
            setSelectedBookmarks([]);
            saveViewConfig({ ...viewConfig, selectedBookmarks: [] });
        }
    }, [viewConfig, setSelectedBookmarks]);
}
