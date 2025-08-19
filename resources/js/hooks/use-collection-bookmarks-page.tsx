import { router } from '@inertiajs/react';

export default function useCollectionBookmarksPage() {
    const regex = /^\/collections\/\d+\/bookmarks$/;
    const isCollectionBookmarksPage = regex.test(window.location.pathname);

    const handleRemoveBookmarkFromCollection = (
        bookmarkIds: number[], setLoading: (loading: boolean) => void, onSuccess?: () => void) => {
        if (bookmarkIds.length === 0 || !isCollectionBookmarksPage) return;

        const regex = /^\/collections\/(\d+)\/bookmarks$/;
        const match = window.location.pathname.match(regex);
        if (match) {
            const collectionId = match[1];
            setLoading(true);
            router.post(
                route('bookmarks.removeFromCollection'),
                {
                    collectionId: collectionId,
                    bookmarkIds: bookmarkIds,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        if (onSuccess) onSuccess();
                    },
                    onFinish: () => {
                        setLoading(false);
                    },
                },
            );
        }
    };

    return { isCollectionBookmarksPage, handleRemoveBookmarkFromCollection };
}
