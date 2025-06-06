import React, { useState, useEffect } from 'react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { DataTableTags } from '@/components/datatable-tags';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const [tags, setTags] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [rowSelection, setRowSelection] = React.useState({})

    const loadTags = () => {
        fetch('/dashboard/section/tags')
            .then(res => {
                if (!res.ok) throw new Error('Failed to load tags');
                return res.json();
            })
            .then(data => setTags(data.tags))
            .catch(() => setTags([]));
        };

    const loadBookmarks = () => {
        if (!tags || tags.length === 0 || Object.entries(rowSelection).length === 0) return

        const selectedTags = Object.keys(rowSelection).map(r => tags[r].id);
        const params = new URLSearchParams();
        selectedTags.forEach(tag => params.append('tags[]', tag));
        const queryString = params.toString();
        const url = `/dashboard/section/bookmarks?${queryString}`;

        console.log('url', url)

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('Failed to load bookmarks');
                return res.json();
            })
            .then(data => { console.log('bookmarks:', data.bookmarks); setBookmarks(data.bookmarks) })
            .catch(() => setBookmarks([]));
    };

    useEffect(() => {
        loadTags();
    }, [])

    useEffect(() => {
        console.log('Value changed:', rowSelection);
        loadBookmarks();
    }, [rowSelection, tags]);

    const showSelected = () => {
        const tags1 = Object.keys(rowSelection).map(r => tags[r].id);
        console.log(tags1)
        /*console.log(table.getSelectedRowModel().rows.map(r => r.original.id))*/
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 grid-cols-[25%_75%]">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-auto rounded-xl border">
                        <button
                            onClick={showSelected}
                            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                        >
                            Get selected
                        </button>
                        <DataTableTags data={tags} rowSelection={rowSelection} setRowSelection={setRowSelection} />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
