import type { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import GridBookmarks from '@/components/grid-bookmarks';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Collection Bookmarks',
        href: '/collections',
    },
];

export default function Collections() {
    const { bookmarks: initialBookmarks } = usePage().props;
    const [bookmarks, setBookmarks] = useState(initialBookmarks.data)

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Collection Bookmarks" />
            <GridBookmarks
                initialBookmarks={initialBookmarks}
                bookmarks={bookmarks}
                setBookmarks={setBookmarks}
            />
        </AppLayout>
    );
}
