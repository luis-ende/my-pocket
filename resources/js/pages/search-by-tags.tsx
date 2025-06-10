import React, { useState, useEffect } from 'react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { DataTableTags } from '@/components/datatable-tags';
import CardBookmark from '@/components/card-bookmark';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'SearchByTags',
        href: '/tags',
    },
];

export default function SearchByTags() {
    const [tags, setTags] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [rowSelection, setRowSelection] = React.useState({})

    const loadTags = () => {
        fetch('/tags/index')
            .then(res => {
                if (!res.ok) throw new Error('Failed to load tags');
                return res.json();
            })
            .then(data => setTags(data.tags))
            .catch(() => setTags([]));
    };

    const loadBookmarks = () => {
        if (!tags || tags.length === 0 || Object.entries(rowSelection).length === 0) {
            setBookmarks([]);
            return
        }

        const selectedTags = Object.keys(rowSelection).map(r => tags[r].id);
        const params = new URLSearchParams();
        selectedTags.forEach(tag => params.append('tags[]', tag));
        const queryString = params.toString();
        const url = `/tags/bookmarks?${queryString}`;

        console.log('url', url)

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('Failed to load bookmarks');
                return res.json();
            })
            .then(data => setBookmarks(data.bookmarks))
            .catch(() => setBookmarks([]));
    };

    useEffect(() => {
        loadTags();
    }, [])

    useEffect(() => {
        console.log('Value changed:', rowSelection);
        loadBookmarks();
    }, [rowSelection, tags]);

    useEffect(() => {
        console.log('bookmarks', bookmarks)
    }, [bookmarks])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap- 4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 grid-cols-[25%_75%]">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-auto rounded-xl border">
                        <DataTableTags data={tags} rowSelection={rowSelection} setRowSelection={setRowSelection} />
                    </div>
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
                                        url={url}
                                        tags={bookmark.tags}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
