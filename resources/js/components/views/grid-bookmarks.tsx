import CardBookmark from '@/components/card-bookmark';
import { Bookmark } from '@/types';
import React, { RefObject, useContext, useEffect, useState } from 'react';
import BookmarksViewContext from '@/contexts/bookmarks-view-context';
import DropdownMenuBookmark from '@/components/dropdown-menu-bookmark';
import useDropDownMenuState from '@/hooks/use-dropdown-menu-state';

type GridBookmarksProps = {
    bookmarks: Bookmark[];
    lastItemRef: RefObject<HTMLDivElement | null> | null;
    perPage: number;
};

export default function GridBookmarks({ bookmarks, lastItemRef, perPage }: GridBookmarksProps) {
    const [loading, setLoading] = useState(false);
    const { selectedBookmarks, dirtyBookmarksState } = useContext(BookmarksViewContext);
    const { dropdownOpen, setDropdownOpen, positionDropDown, currentBookmark, setCurrentBookmark, handleOpenDropDown } = useDropDownMenuState();

    useEffect(() => {
        if (!dirtyBookmarksState.dirty) return;

        switch (dirtyBookmarksState.operation) {
            case 'delete':
            case 'update':
                setCurrentBookmark(null);
                break;
        }
    }, [dirtyBookmarksState, setCurrentBookmark]);

    return (
        <div className="relative overflow-auto">
            {currentBookmark && <DropdownMenuBookmark
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
                            handleActionsClick={(e) => handleOpenDropDown(e, bookmarks)}
                            loading={loading}
                            selected={selectedBookmarks.includes(bookmark.id)}
                        />
                    );
                })}
            </div>
        </div>
    );
}
