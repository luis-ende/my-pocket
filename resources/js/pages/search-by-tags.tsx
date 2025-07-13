import React, { useState, useEffect } from 'react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { DataTableTags } from '@/components/datatable-tags';
import GridBookmarks from '@/components/grid-bookmarks';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tags',
        href: '/search-by-tags',
    },
];

export default function SearchByTags() {
    const [tags, setTags] = useState([]);
    const [initialBookmarks, setInitialBookmarks] = useState([])
    const [bookmarks, setBookmarks] = useState([])
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
            return
        }

        const selectedTags = Object.keys(rowSelection).map(r => tags[r].id);
        const params = new URLSearchParams();
        selectedTags.forEach(tag => params.append('tags[]', tag));
        const queryString = params.toString();
        const url = `/search-by-tags?${queryString}`;

        router.visit(url, {
            method: 'get',
            preserveState: true,
            only: ['bookmarks'],
            onSuccess: ({ props })=> {
                props.bookmarks['tagsQueryString'] = queryString;
                setInitialBookmarks(props.bookmarks)
                setBookmarks(props.bookmarks.data)
            }
        });
    };

    useEffect(() => {
        loadTags();
    }, [])

    useEffect(() => {
        setBookmarks([])
        loadBookmarks();
    }, [rowSelection, tags]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap- 4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 grid-cols-[25%_75%]">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-auto rounded-xl border">
                        <DataTableTags data={tags} rowSelection={rowSelection} setRowSelection={setRowSelection} />
                    </div>

                    {bookmarks && bookmarks.length > 0 && (
                        <GridBookmarks
                            initialBookmarks={initialBookmarks}
                            bookmarks={bookmarks}
                            setBookmarks={setBookmarks}
                            infiniteScroll={true}
                        />
                    )}
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
