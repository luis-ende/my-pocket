import React, { useState, useRef } from 'react';
import CardBookmark from '@/components/card-bookmark';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Trash2, SquarePen, Star, Copy, ListPlus } from 'lucide-react';
import { Icon } from '@/components/icon';

export default function GridBookmarks({initialBookmarks, bookmarks, setBookmarks}) {
    const [nextPage, setNextPage] = useState(initialBookmarks.next_page_url);
    const [tags] = useState(initialBookmarks.tagsQueryString);
    const [loading, setLoading] = useState(false);
    const lastItemRef = useRef<HTMLDivElement | null>(null);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [positionDropDown, setPositionDropDown] = useState({ x: 0, y: 0 });

    const loadMore = () => {
        if (!nextPage || loading) return;

        setLoading(true);

        let fullNextPageUrl = nextPage;
        if (tags && tags.length > 0) {
            fullNextPageUrl += '&' + tags;
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
                alert(key)
                break;
            case 'delete':
                alert(key)
                break;
            case 'fav':
                alert(key)
                break;
            case 'addToCol':
                alert(key)
                break;
            case 'copy':
                alert(key)
                break;
        }
    }

    return (
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-auto rounded-xl border">
            {/* Hidden positioned dropdown */}
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    <div
                        style={{
                            position: 'fixed',
                            left: positionDropDown.x,
                            top: positionDropDown.y,
                            width: '1px',
                            height: '1px',
                            opacity: 0,
                            pointerEvents: 'none',
                            zIndex: 50
                        }}
                    />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" side="bottom" align="start">
                    <DropdownMenuLabel>Bookmark Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDropDownItemClick('edit')}>
                        <Icon iconNode={SquarePen}
                              className="size-5 opacity-90 group-hover:opacity-100"
                        />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDropDownItemClick('delete')}>
                        <Icon iconNode={Trash2}
                              className="size-5 opacity-90 group-hover:opacity-100"
                        />
                        Delete
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDropDownItemClick('fav')}>
                        <Icon iconNode={Star}
                              className="size-5 opacity-90 group-hover:opacity-100"
                        />
                        Favorite
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDropDownItemClick('addToCol')}>
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

            <div className="px-10 py-10 grid md:grid-cols-3 sm:grid-cols-1 gap-6 sm:gap-3">
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
