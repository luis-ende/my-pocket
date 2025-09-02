import { useEffect } from 'react';
import { saveViewConfig } from '@/hooks/use-view-config';
import { BookmarksViewConfig } from '@/types';
import { useBookmarksViewContext } from '@/contexts/bookmarks-view-context';

export default function useChangeActivePage(viewConfig: BookmarksViewConfig) {
    const { setSelectedBookmarks } = useBookmarksViewContext();

    useEffect(() => {
        return () => {
            setSelectedBookmarks([]);
            saveViewConfig({ ...viewConfig, selectedBookmarks: [] });
        }
    }, [viewConfig, setSelectedBookmarks]);
}
