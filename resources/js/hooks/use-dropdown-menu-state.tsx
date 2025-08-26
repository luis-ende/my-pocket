import React, { useState } from 'react';
import { Bookmark } from '@/types';

export default function useDropDownMenuState() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [positionDropDown, setPositionDropDown] = useState({ x: 0, y: 0 });
    const [currentBookmark, setCurrentBookmark] = useState<Bookmark | null>(null);

    const handleOpenDropDown = (event: React.MouseEvent<HTMLButtonElement>, bookmarks: Bookmark[]) => {
        const selectedBookmark = bookmarks.find((b) => b.id.toString() === event.currentTarget.dataset.bookmarkId);
        if (!selectedBookmark) return;

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

    return { dropdownOpen, setDropdownOpen, positionDropDown, setPositionDropDown, currentBookmark, setCurrentBookmark, handleOpenDropDown };
}
