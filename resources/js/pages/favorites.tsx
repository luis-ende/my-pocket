import ViewBookmarks from '@/components/view-bookmarks';
import AppLayout from '@/layouts/app-layout';
import type { Bookmark, BreadcrumbItem, CursorPaginatedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Favorites',
        href: '/favorites',
    },
];

export default function Favorites() {
    const { bookmarks: initialBookmarks } = usePage<{
        bookmarks: CursorPaginatedData<Bookmark>;
    }>().props;
    const [bookmarks, setBookmarks] = useState(initialBookmarks.data);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Favorites" />
            <ViewBookmarks
                initialBookmarks={initialBookmarks}
                bookmarks={bookmarks}
                setBookmarks={setBookmarks}
                infiniteScroll={true}
            />
        </AppLayout>
    );
}
