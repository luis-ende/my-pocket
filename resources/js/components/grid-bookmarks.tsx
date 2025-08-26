import CardBookmark from '@/components/card-bookmark';
import { Bookmark } from '@/types';
import React, { RefObject, useContext, useEffect, useState } from 'react';
import BookmarksViewContext from '@/contexts/bookmarks-view-context';
import ContextMenuBookmark from '@/components/context-menu-bookmark';

type GridBookmarksProps = {
    bookmarks: Bookmark[];
    lastItemRef: RefObject<HTMLDivElement | null> | null;
    perPage: number;
};

export default function GridBookmarks({ bookmarks, lastItemRef, perPage }: GridBookmarksProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [positionDropDown, setPositionDropDown] = useState({ x: 0, y: 0 });
    const [currentBookmark, setCurrentBookmark] = useState<Bookmark | null>(null);
    const [loading, setLoading] = useState(false);
    const { selectedBookmarks, dirtyBookmarksState } = useContext(BookmarksViewContext);

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

    useEffect(() => {
        if (!dirtyBookmarksState.dirty) return;

        switch (dirtyBookmarksState.operation) {
            case 'delete':
            case 'update':
                setCurrentBookmark(null);
                break;
        }
    }, [dirtyBookmarksState]);

    return (
        <div className="relative overflow-auto">
            {currentBookmark && <ContextMenuBookmark
                currentBookmark={currentBookmark}
                menuTrigger={
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
                ></button>}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                setLoading={setLoading}
            />}

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
