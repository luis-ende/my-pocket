import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import CardBookmark from '@/components/card-bookmark';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Bookmarks',
        href: '/bookmarks',
    },
];

export default function Bookmarks({ bookmarks }) {
    //const [bookmarks, setBookmarks] = useState([]);

    /*const loadBookmarks = () => {
        fetch('/bookmarks')
            .then(res => {
                if (!res.ok) throw new Error('Failed to load bookmarks');
                return res.json();
            })
            .then(data => { console.log('page bookmarks: ', data.bookmarks); setBookmarks(data.bookmarks) })
            .catch(() => setBookmarks([]));
    };

    useEffect(() => {
        loadBookmarks();
    }, [])*/

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Bookmarks" />
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-auto rounded-xl border">
                <div className="flex flex-row flex-wrap gap-6">
                    {bookmarks.map((bookmark) => {
                        const url = new URL(bookmark.url);
                        const domain = url.hostname;
                        return (
                            <CardBookmark
                                key={bookmark.id}
                                title={bookmark.title}
                                description={domain}
                                url={bookmark.url}
                                tags={bookmark.tags}
                            />
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
