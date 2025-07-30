import GridBookmarks from '@/components/grid-bookmarks';
import BookmarksContext from '@/contexts/bookmarks-context';
import AppLayout from '@/layouts/app-layout';
import type { Bookmark, BreadcrumbItem, CursorPaginatedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useContext, useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Saves',
        href: '/bookmarks',
    },
];

export default function Bookmarks() {
    const { bookmarks: initialBookmarks } = usePage<{
        bookmarks: CursorPaginatedData<Bookmark>;
    }>().props;

    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks.data);
    const { newBookmark } = useContext(BookmarksContext);

    useEffect(() => {
        if (newBookmark) {
            setBookmarks((prev) => (!prev.find((b) => b.id === newBookmark.id) ? [newBookmark, ...prev] : prev));
        }
    }, [newBookmark]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Bookmarks" />
            <GridBookmarks initialBookmarks={initialBookmarks} bookmarks={bookmarks} setBookmarks={setBookmarks} infiniteScroll={true} />
        </AppLayout>
    );
}
