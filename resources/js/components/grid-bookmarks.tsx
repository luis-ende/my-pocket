import AlertDialogDelete from '@/components/alert-dialog-delete';
import CardBookmark from '@/components/card-bookmark';
import FormBookmarkCollectionAdd from '@/components/form-bookmark-collection-add';
import FormEditBookmark from '@/components/form-edit-bookmark';
import { Icon } from '@/components/icon';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bookmark, BookmarksViewConfig } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Archive, ArchiveRestore, BookOpenCheck, Copy, Glasses, Link, ListPlus, ListMinus, SquarePen, Star, StarOff, Trash2 } from 'lucide-react';
import React, { RefObject, useContext, useState } from 'react';
import { toast } from 'sonner';
import deleteBookmarks from '@/hooks/use-delete-bookmarks';
import useCollectionBookmarksPage from '@/hooks/use-collection-bookmarks-page';
import BookmarksViewContext from '@/contexts/bookmarks-view-context';

type GridBookmarksProps = {
    bookmarks: Bookmark[];
    lastItemRef: RefObject<HTMLDivElement | null> | null;
    perPage: number;
    viewConfig: BookmarksViewConfig;
};
export default function GridBookmarks({ bookmarks, lastItemRef, perPage }: GridBookmarksProps) {
    const { url } = usePage();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [positionDropDown, setPositionDropDown] = useState({ x: 0, y: 0 });
    const [currentBookmark, setCurrentBookmark] = useState<Bookmark | null>(null);
    const [dialogEditOpen, setDialogEditOpen] = useState(false);
    const [dialogCollectionsOpen, setDialogCollectionsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { isCollectionBookmarksPage, handleRemoveBookmarkFromCollection } = useCollectionBookmarksPage();
    const { selectedBookmarks } = useContext(BookmarksViewContext);

    const closeDeleteDialog = () => {
        setTimeout(() => {
            setDropdownOpen(false);
        }, 300);
    };

    const handleDeleteConfirm = () => {
        if (!currentBookmark) return;

        setLoading(true);
        router.delete(route('bookmarks.destroy', currentBookmark.id), {
            preserveScroll: true,
            onSuccess: () => {
                closeDeleteDialog();
                if (currentBookmark) deleteBookmarks(bookmarks, currentBookmark.id);
                setCurrentBookmark(null);
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
                    if (url.includes('/favorites')) {
                        deleteBookmarks(bookmarks, bookmark.id);
                    }
                    setCurrentBookmark(null);
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
                    if (url.includes('/dashboard')) {
                        deleteBookmarks(bookmarks, bookmark.id);
                    }
                    setCurrentBookmark(null);
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
                    deleteBookmarks(bookmarks, bookmark.id);
                    setCurrentBookmark(null);
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

    const handleOpenDropDown = (event: React.MouseEvent<HTMLButtonElement>) => {
        const selectedBookmark = bookmarks.find((b) => b.id.toString() === event.currentTarget.dataset.bookmarkId);
        if (!selectedBookmark) {
            return;
        }

        setCurrentBookmark(selectedBookmark);
        const rect = event.currentTarget.getBoundingClientRect();
        const scrollTop = event.currentTarget.scrollTop || 0;
        const scrollLeft = event.currentTarget.scrollLeft || 0;
        setPositionDropDown({
            x: rect.left + scrollLeft,
            y: rect.bottom + scrollTop,
        });
        setDropdownOpen(true);
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

    const onRemovedBookmarkFromCollection = () => {
        if (!currentBookmark) return;

        deleteBookmarks(bookmarks, currentBookmark.id);
        setCurrentBookmark(null);
    }

    const handleDropDownItemClick = (key: string) => {
        if (!currentBookmark) return;

        switch (key) {
            case 'edit':
                setDialogEditOpen(true);
                break;
            case 'delete':
                // Confirm dialog triggered by dropdown item.
                break;
            case 'fav':
                handleSaveFav(currentBookmark);
                break;
            case 'read':
                handleSaveRead(currentBookmark);
                break;
            case 'addToCol':
                setDialogCollectionsOpen(true);
                break;
            case 'removeFromCol':
                // Confirm dialog triggered by dropdown item.
                break;
            case 'copy':
                handleCopyLink(currentBookmark);
                break;
            case 'archive':
                handleArchive(currentBookmark);
                break;
            case 'restore-broken-link':
                handleRestoreBrokenLink(currentBookmark);
                break;
        }
    };

    return (
        <div className="relative overflow-auto">
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    <button
                        aria-label="Open actions"
                        style={{
                            position: 'fixed',
                            left: positionDropDown.x,
                            top: positionDropDown.y,
                            width: '1px',
                            height: '1px',
                            padding: '0',
                            border: 'none',
                            background: 'none',
                        }}
                    ></button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" side="bottom" align="start">
                    <DropdownMenuLabel>Bookmark Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            setDropdownOpen(false);
                        }}
                        onClick={() => handleDropDownItemClick('edit')}
                    >
                        <Icon iconNode={SquarePen} className="size-5 opacity-90 group-hover:opacity-100" />
                        Edit
                    </DropdownMenuItem>

                    <AlertDialogDelete
                        onClose={closeDeleteDialog}
                        onConfirm={handleDeleteConfirm}
                        title="Delete Bookmark"
                        description="This will permanently delete the bookmark and all associated data."
                        trigger={
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => handleDropDownItemClick('delete')}>
                                <Icon iconNode={Trash2} className="size-5 opacity-90 group-hover:opacity-100" />
                                Delete
                            </DropdownMenuItem>
                        }
                    />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDropDownItemClick('fav')}>
                        {currentBookmark?.is_fav ? (
                            <Icon iconNode={StarOff} className="bg size-5 opacity-90 group-hover:opacity-100" />
                        ) : (
                            <Icon iconNode={Star} className="bg size-5 opacity-90 group-hover:opacity-100" />
                        )}
                        {currentBookmark?.is_fav ? 'Un-Favorite' : 'Favorite'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDropDownItemClick('read')}>
                        {currentBookmark?.checked ? (
                            <Icon iconNode={Glasses} className="bg size-5 opacity-90 group-hover:opacity-100" />
                        ) : (
                            <Icon iconNode={BookOpenCheck} className="bg size-5 opacity-90 group-hover:opacity-100" />
                        )}
                        {currentBookmark?.checked ? 'Mark as not read' : 'Mark as read'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            setDropdownOpen(false);
                        }}
                        onClick={() => handleDropDownItemClick('addToCol')}
                    >
                        <Icon iconNode={ListPlus} className="size-5 opacity-90 group-hover:opacity-100" />
                        Add to Collection
                    </DropdownMenuItem>
                    {isCollectionBookmarksPage && <AlertDialogDelete
                        onClose={closeDeleteDialog}
                        onConfirm={() => {
                            if (!currentBookmark) return;
                            handleRemoveBookmarkFromCollection([currentBookmark.id], setLoading, onRemovedBookmarkFromCollection)
                        }}
                        title="Remove bookmark from collection"
                        description="This will permanently remove the bookmark from the current collection. Are you sure?"
                        trigger={
                            <DropdownMenuItem
                                onSelect={(e) => { e.preventDefault(); }}
                                onClick={() => handleDropDownItemClick('removeFromCol')}
                            >
                                <Icon iconNode={ListMinus} className="size-5 opacity-90 group-hover:opacity-100" />
                                Remove from Collection
                            </DropdownMenuItem>
                        }
                    />}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDropDownItemClick('copy')}>
                        <Icon iconNode={Copy} className="size-5 opacity-90 group-hover:opacity-100" />
                        Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {currentBookmark?.is_broken_link && (
                        <DropdownMenuItem onClick={() => handleDropDownItemClick('restore-broken-link')}>
                            <Icon iconNode={Link} className="size-5 opacity-90 group-hover:opacity-100" />
                            Restore broken link
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleDropDownItemClick('archive')}>
                        {currentBookmark?.is_archived ? (
                            <Icon iconNode={ArchiveRestore} className="size-5 opacity-90 group-hover:opacity-100" />
                        ) : (
                            <Icon iconNode={Archive} className="size-5 opacity-90 group-hover:opacity-100" />
                        )}
                        {currentBookmark?.is_archived ? 'Un-Archive' : 'Archive'}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {currentBookmark && (
                <FormEditBookmark
                    open={dialogEditOpen}
                    bookmark={currentBookmark}
                    onClose={() => {
                        setDialogEditOpen(false);
                    }}
                />
            )}

            {currentBookmark && (
                <FormBookmarkCollectionAdd
                    open={dialogCollectionsOpen}
                    onClose={() => {
                        setDialogCollectionsOpen(false);
                    }}
                    bookmarkIds={[currentBookmark.id]}
                />
            )}

            <div className="xs:grid-cols-1 grid gap-6 px-10 py-10 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
                {bookmarks.map((bookmark: Bookmark, index: number) => {
                    return (
                        <CardBookmark
                            key={bookmark.id}
                            parentRef={index === ((bookmarks.length - 1) - perPage) ? lastItemRef : null}
                            bookmark={bookmark}
                            handleActionsClick={handleOpenDropDown}
                            loading={loading}
                            selected={selectedBookmarks.includes(bookmark.id)}
                        />
                    );
                })}
            </div>
        </div>
    );
}
