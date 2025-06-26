import React, { useState, useRef, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import CardBookmark from '@/components/card-bookmark';
import AlertDialogDelete from '@/components/alert-dialog-delete';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Trash2, SquarePen, Star, Copy, ListPlus, StarOff, Glasses, BookOpenCheck } from 'lucide-react';
import { Icon } from '@/components/icon';
import FormEditBookmark from '@/components/form-edit-bookmark';
import FormBookmarkCollectionAdd from '@/components/form-bookmark-collection-add';

export default function GridBookmarks({initialBookmarks, bookmarks, setBookmarks}) {
    const { url } = usePage();
    const [nextPage, setNextPage] = useState(initialBookmarks.next_page_url);
    const [tagsQueryString] = useState(initialBookmarks.tagsQueryString);
    const [loading, setLoading] = useState(false);
    const lastItemRef = useRef<HTMLDivElement | null>(null);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [positionDropDown, setPositionDropDown] = useState({ x: 0, y: 0 });
    const [currentBookmark, setCurrentBookmark] = useState(null);

    const [dialogDeleteState, setDialogDeleteState] = useState({
        isOpen: false,
        bookmark: null,
        isDeleting: false
    });

    const [dialogEditOpen, setDialogEditOpen] = useState(false);
    const [dialogCollectionsOpen, setDialogCollectionsOpen] = useState(false);

    const [tags, setTags] = useState([]);

    useEffect(() => {
        fetch('/tags/all')
            .then(res => {
                if (!res.ok) throw new Error('Failed to load tags');
                return res.json();
            })
            .then(data => setTags(data.tags))
            .catch(() => setTags([]));
    }, []);

    const openDeleteDialog = (bookmark) => {
        setDialogDeleteState({
            isOpen: true,
            bookmark: bookmark,
            isDeleting: false
        });
    };

    const closeDeleteDialog = () => {
        if (!dialogDeleteState.isDeleting) {
            setDialogDeleteState({
                isOpen: false,
                bookmark: null,
                isDeleting: false
            });
            setTimeout(() => {
                setDropdownOpen(false);
            }, 300)
        }
    };

    const handleDeleteConfirm = () => {
        if (!dialogDeleteState.bookmark) return;

        setDialogDeleteState(prev => ({ ...prev, isDeleting: true }));

        router.delete(route('bookmarks.destroy', dialogDeleteState.bookmark.id), {
            onSuccess: () => {
                closeDeleteDialog()
                removeBookmark(currentBookmark.id);
                setCurrentBookmark(null)
            },
            onError: (errors) => {
                setDialogDeleteState(prev => ({ ...prev, isDeleting: false }));
                console.error('Delete failed:', errors);
            },
            onFinish: () => {
                // This runs regardless of success/error
            }
        });
    };

    const handleSaveFav = (bookmark) => {
        router.patch(route('bookmarks.favs', bookmark.id),
            { is_fav: !bookmark.is_fav },
            {
                preserveScroll: true,
                onSuccess: () => {
                    bookmark.is_fav = !bookmark.is_fav;
                    if (url.includes('/favorites')) {
                        removeBookmark(bookmark.id);
                    }
                    setCurrentBookmark(null);
            }
        });
    }

    const handleSaveRead = (bookmark) => {
        router.patch(route('bookmarks.reads', bookmark.id),
            { read: !bookmark.checked },
            {
                preserveScroll: true,
                onSuccess: () => {
                    bookmark.checked = !bookmark.checked;
                    if (url.includes('/dashboard')) {
                        removeBookmark(bookmark.id);
                    }
                    setCurrentBookmark(null);
                }
            });
    }

    const removeBookmark = (bookmarkId: number) => {
        const index = bookmarks.findIndex(item => item.id == bookmarkId);
        if (index !== -1) {
            bookmarks.splice(index, 1);
        }
    }

    const loadMore = () => {
        if (!nextPage || loading) return;

        setLoading(true);

        let fullNextPageUrl = nextPage;
        if (tagsQueryString && tagsQueryString.length > 0) {
            fullNextPageUrl += '&' + tagsQueryString;
        }

        router.visit(fullNextPageUrl, {
            method: 'get',
            preserveState: true,
            only: ['bookmarks'],
            onSuccess: ({props}) => {
                const newBookmarks = props.bookmarks.data;
                setBookmarks(prev => [...prev, ...newBookmarks]);
                setNextPage(props.bookmarks.next_page_url);

                // Scroll to the first new item after DOM updates
                setTimeout(() => {
                    lastItemRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
            },
            onFinish: () => setLoading(false),
        })
    }

    const handleOpenDropDown = (event: React.MouseEvent<HTMLButtonElement>) => {
        const selectedBookmark = bookmarks.find(b => b.id == event.currentTarget.dataset.bookmarkId)
        if (!selectedBookmark) {
             return;
        }

        setCurrentBookmark(selectedBookmark);
        const rect = event.currentTarget.getBoundingClientRect()
        const scrollTop = event.currentTarget.scrollTop || 0
        const scrollLeft = event.currentTarget.scrollLeft || 0
        setPositionDropDown({
            x: rect.left + scrollLeft,
            y: rect.bottom + scrollTop
        });
        setDropdownOpen(true)
    }

    const handleDropDownItemClick = (key: string) => {
        switch (key) {
            case 'edit':
                setDialogEditOpen(true)
                break;
            case 'delete':
                openDeleteDialog(currentBookmark)
                break;
            case 'fav':
                handleSaveFav(currentBookmark)
                break;
            case 'read':
                handleSaveRead(currentBookmark)
                break;
            case 'addToCol':
                setDialogCollectionsOpen(true)
                break;
            case 'copy':
                alert(key)
                break;
        }
    }

    return (
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-auto rounded-xl border">
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
                            background: 'none'
                        }}>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" side="bottom" align="start">
                    <DropdownMenuLabel>Bookmark Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            setDropdownOpen(false)
                        }}
                        onClick={() => handleDropDownItemClick('edit')}
                    >
                        <Icon iconNode={SquarePen}
                              className="size-5 opacity-90 group-hover:opacity-100"
                        />
                        Edit
                    </DropdownMenuItem>

                    <AlertDialogDelete
                        onClose={closeDeleteDialog}
                        onConfirm={handleDeleteConfirm}
                        isDeleting={dialogDeleteState.isDeleting}
                        title="Delete Bookmark"
                        description="This will permanently delete the bookmark and all associated data."
                        trigger={
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                onClick={() => handleDropDownItemClick('delete')}
                            >
                                <Icon iconNode={Trash2}
                                      className="size-5 opacity-90 group-hover:opacity-100"
                                />
                                Delete
                            </DropdownMenuItem>
                        }
                    />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDropDownItemClick('fav')}>
                        {currentBookmark?.is_fav ?
                            <Icon iconNode={StarOff}
                                  className="size-5 opacity-90 group-hover:opacity-100 bg"
                            />
                            :
                            <Icon iconNode={Star}
                                  className="size-5 opacity-90 group-hover:opacity-100 bg"
                            />
                        }
                        {currentBookmark?.is_fav ? "Un-Favorite" : "Favorite"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDropDownItemClick('read')}>
                        {currentBookmark?.checked ?
                            <Icon iconNode={Glasses}
                                  className="size-5 opacity-90 group-hover:opacity-100 bg"
                            />
                            :
                            <Icon iconNode={BookOpenCheck}
                                  className="size-5 opacity-90 group-hover:opacity-100 bg"
                            />
                        }
                        {currentBookmark?.checked ? "Mark as not read" : "Mark as read"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            setDropdownOpen(false)
                        }}
                        onClick={() => handleDropDownItemClick('addToCol')}
                    >
                        <Icon iconNode={ListPlus}
                              className="size-5 opacity-90 group-hover:opacity-100"
                        />
                        Add to Collection
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDropDownItemClick('copy')}>
                        <Icon iconNode={Copy}
                              className="size-5 opacity-90 group-hover:opacity-100"
                        />
                        Copy Link
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <FormEditBookmark
                open={dialogEditOpen}
                bookmark={currentBookmark}
                onClose={() => {
                    setDialogEditOpen(false)
                }}
                tags={tags}
            />

            <FormBookmarkCollectionAdd
                open={dialogCollectionsOpen}
                bookmark={currentBookmark}
                onClose={() => {
                    setDialogCollectionsOpen(false)
                }}
            />

            <div className="px-10 py-10 grid md:grid-cols-4 sm:grid-cols-1 gap-6 sm:gap-3">
                {bookmarks.map((bookmark, index) => {
                    const url = new URL(bookmark.url);
                    const domain = url.hostname;
                    return (
                        <CardBookmark
                            parentRef={index === bookmarks.length - 1 ? lastItemRef : null}
                            key={bookmark.id}
                            id={bookmark.id}
                            title={bookmark.title}
                            description={domain}
                            url={bookmark.url}
                            tags={bookmark.tags}
                            isBrokenLink={bookmark.is_broken_link}
                            previewImageUrl={bookmark.preview_image_url}
                            handleActionsClick={handleOpenDropDown}
                        />
                    );
                })}
            </div>

            {nextPage && (
                <div className="mb-6 text-center">
                    <Button
                        className="w-60"
                        variant="default"
                        onClick={loadMore}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Load more...'}
                    </Button>
                </div>
            )}
        </div>
    );
}
