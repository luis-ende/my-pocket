import type { BreadcrumbItem, Collection } from '@/types';
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
    const { collection } = usePage<{ collection: Collection }>().props;
    const { bookmarks: initialBookmarks } = usePage().props;
    const [bookmarks, setBookmarks] = useState(initialBookmarks.data)

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Collection Bookmarks" />
            <div className="px-10">
                <div className="font-bold">{ collection.name }</div>
                <div className="text-sm text-gray-600">{ collection.description }</div>
            </div>
            <GridBookmarks
                initialBookmarks={initialBookmarks}
                bookmarks={bookmarks}
                setBookmarks={setBookmarks}
                infiniteScroll={true}
            />
        </AppLayout>
    );
}
