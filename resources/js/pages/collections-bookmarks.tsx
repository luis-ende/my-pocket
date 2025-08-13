import ViewBookmarks from '@/components/view-bookmarks';
import AppLayout from '@/layouts/app-layout';
import type { Bookmark, BreadcrumbItem, Collection, CursorPaginatedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Collection Bookmarks',
        href: '/collections',
    },
];

export default function Collections() {
    const { collection } = usePage<{ collection: Collection }>().props;
    const { bookmarks: initialBookmarks } = usePage<{
        bookmarks: CursorPaginatedData<Bookmark>;
    }>().props;
    const [bookmarks, setBookmarks] = useState(initialBookmarks.data);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Collection Bookmarks" />
            <div className="px-10">
                <div className="font-bold">{collection.name}</div>
                <div className="text-sm text-gray-600">{collection.description}</div>
            </div>
            <ViewBookmarks
                initialBookmarks={initialBookmarks}
                bookmarks={bookmarks}
                setBookmarks={setBookmarks}
                infiniteScroll={true}
            />
        </AppLayout>
    );
}
