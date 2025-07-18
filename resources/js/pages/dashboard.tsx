import React, { useState } from 'react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import type { Bookmark, BreadcrumbItem, CursorPaginatedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import GridBookmarks from '@/components/grid-bookmarks';
import { Glasses } from 'lucide-react';
import { Icon } from '@/components/icon';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Pocket Home',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { bookmarks: initialBookmarks } = usePage<{
        bookmarks: CursorPaginatedData<Bookmark>;
    }>().props;
    const [toReadBookmarks, setToReadBookmarks] = useState(initialBookmarks.data)

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="pl-5 pt-5 flex flex-row">
                        <Icon iconNode={Glasses}
                              className="size-10 opacity-70 group-hover:opacity-100 bg"
                        />
                        <div className="pl-3 pb-3">
                            <h1 className="text-xl font-bold">To Read</h1>
                            <h2 className="text-l text-gray-600">Your pending reads</h2>
                        </div>
                    </div>
                    {toReadBookmarks && (<GridBookmarks
                        initialBookmarks={initialBookmarks}
                        bookmarks={toReadBookmarks}
                        setBookmarks={setToReadBookmarks}
                        infiniteScroll={true}
                        />)
                    }
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
