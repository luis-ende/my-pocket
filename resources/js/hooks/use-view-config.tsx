import { BookmarksViewConfig } from '@/types';

export function saveViewConfig(viewConfig: BookmarksViewConfig) {
    localStorage.setItem('view-' + viewConfig.path, JSON.stringify(viewConfig));
}
export default function useViewConfig() {
    const viewConfigJson = localStorage.getItem('view-' + window.location.pathname);
    let viewConfig: BookmarksViewConfig | null = viewConfigJson ? JSON.parse(viewConfigJson) : null;
    if (!viewConfig) {
        viewConfig = {
            path: window.location.pathname,
            viewMode: 'gridView',
            infiniteScroll: true,
            selectedBookmarks: [],
        };
    }

    return viewConfig;
}
