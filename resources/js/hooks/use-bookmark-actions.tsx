import { Bookmark } from '@/types';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import useCollectionBookmarksPage from '@/hooks/use-collection-bookmarks-page';
import { useBookmarksViewContext } from '@/contexts/bookmarks-view-context';

export default function useBookmarkActions() {
    const path = window.location.pathname;
    const { handleRemoveBookmarkFromCollection } = useCollectionBookmarksPage();
    const { setDirtyBookmarksState } = useBookmarksViewContext();

    const handleDeleteConfirm = (bookmark: Bookmark, setLoading: (loading: boolean) => void) => {
        setLoading(true);
        router.delete(route('bookmarks.destroy', bookmark.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDirtyBookmarksState({
                    dirty: true,
                    operation: 'delete',
                    resetSelection: true,
                    ids: [bookmark.id],
                });
            },
            onError: (errors) => {
                toast("Bookmark couldn't be deleted!", {
                    description: errors.toString(),
                    action: {
                        label: 'Close',
                        onClick: () => console.log('Close'),
                    },
                });
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    };

    const handleSaveFav = (bookmark: Bookmark) => {
        router.patch(
            route('bookmarks.favs', bookmark.id),
            { is_fav: !bookmark.is_fav },
            {
                preserveScroll: true,
                onSuccess: () => {
                    bookmark.is_fav = !bookmark.is_fav;
                    const resetSelection = path.includes('/favorites') && !bookmark.is_fav;
                    setDirtyBookmarksState({
                        dirty: true,
                        operation: 'update',
                        resetSelection: resetSelection,
                        ids: [bookmark.id],
                        data: bookmark,
                    });
                },
            },
        );
    };

    const handleSaveRead = (bookmark: Bookmark) => {
        router.patch(
            route('bookmarks.reads', bookmark.id),
            { read: !bookmark.checked },
            {
                preserveScroll: true,
                onSuccess: () => {
                    bookmark.checked = !bookmark.checked;
                    const resetSelection = path.includes('/dashboard') && bookmark.checked;
                    setDirtyBookmarksState({
                        dirty: true,
                        operation: 'update',
                        resetSelection: resetSelection,
                        ids: [bookmark.id],
                        data: bookmark,
                    });
                },
            },
        );
    };

    const handleArchive = (bookmark: Bookmark) => {
        router.patch(
            route('bookmarks.archive', bookmark.id),
            { archive: !bookmark.is_archived },
            {
                preserveScroll: true,
                onSuccess: () => {
                    bookmark.is_archived = !bookmark.is_archived;
                    setDirtyBookmarksState({
                        dirty: true,
                        operation: 'update',
                        resetSelection: true,
                        ids: [bookmark.id],
                        data: bookmark,
                    });
                },
            },
        );
    };

    const handleRestoreBrokenLink = (bookmark: Bookmark) => {
        router.patch(
            route('bookmarks.broken-link', bookmark.id),
            { is_broken_link: false },
            {
                preserveScroll: true,
                onSuccess: () => {
                    bookmark.is_broken_link = false;
                },
            },
        );
    };

    const handleCopyLink = (bookmark: Bookmark) => {
        navigator.clipboard
            .writeText(bookmark.url)
            .then(() => {
                toast('Bookmark', {
                    description: 'Link address copied to clipboard!',
                    action: {
                        label: 'Close',
                        onClick: () => console.log('Close'),
                    },
                });
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    };

    const handleRemoveFromCollection = (bookmark: Bookmark, setLoading: (loading: boolean) => void) => {
        handleRemoveBookmarkFromCollection([bookmark.id], setLoading, () => {
            setDirtyBookmarksState({
                dirty: true,
                operation: 'delete',
                resetSelection: true,
                ids: [bookmark.id],
            });
        });
    };

    return { handleArchive, handleSaveFav, handleCopyLink, handleSaveRead, handleDeleteConfirm, handleRestoreBrokenLink, handleRemoveFromCollection };
}
