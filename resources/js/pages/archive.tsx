import type { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import GridBookmarks from '@/components/grid-bookmarks';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Archive',
        href: '/archive',
    },
];

export default function Archive() {
    const { bookmarks: initialBookmarks } = usePage().props;
    const [bookmarks, setBookmarks] = useState(initialBookmarks.data)

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Archive" />
            {<GridBookmarks
                initialBookmarks={initialBookmarks}
                bookmarks={bookmarks}
                setBookmarks={setBookmarks}
                infiniteScroll={true}
            />}
        </AppLayout>
    );
}
