import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { Bookmark, BreadcrumbItem, CursorPaginatedData, Stats } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import GridBookmarks from '@/components/grid-bookmarks';
import { Glasses, ChartNetwork, Bookmark as BookmarkIcon, Tags, Archive, Star, LibraryBig } from 'lucide-react';
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
    const { stats } = usePage<{
        stags: Stats;
    }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative rounded-xl border">
                    <div className="pl-5 pt-5 flex flex-row">
                        <Icon iconNode={ChartNetwork}
                              className="size-10 opacity-70 group-hover:opacity-100 bg"
                        />
                        <div className="pl-3">
                            <h1 className="text-xl font-bold">Stats</h1>
                            <h2 className="text-l text-gray-600">All in one</h2>
                        </div>
                    </div>
                    <div className="flex flex-row flex-wrap py-5 space-y-5 space-x-5 justify-center items-center">
                        <div className="flex flex-col items-center border border-gray-200 rounded-lg p-5 h-28 w-28">
                            <Icon iconNode={BookmarkIcon}
                                  className="size-6 opacity-70"
                            />
                            <div className="text-sm font-bold mt-1">{stats.bookmarks_count}</div>
                            <div>Bookmarks</div>
                        </div>
                        <div className="flex flex-col items-center border border-gray-200 rounded-lg p-5 h-28 w-28">
                            <Icon iconNode={Tags}
                                  className="size-6 opacity-70"
                            />
                            <div className="text-sm font-bold mt-1">{stats.tags_count}</div>
                            <div>Tags</div>
                        </div>
                        <div className="flex flex-col items-center border border-gray-200 rounded-lg p-5 h-28 w-28">
                            <Icon iconNode={LibraryBig}
                                  className="size-6 opacity-70"
                            />
                            <div className="text-sm font-bold mt-1">{stats.collections_count}</div>
                            <div>Collections</div>
                        </div>
                        <div className="flex flex-col items-center border border-gray-200 rounded-lg p-5 h-28 w-28">
                            <Icon iconNode={Glasses}
                                  className="size-6 opacity-70"
                            />
                            <div className="text-sm font-bold mt-1">{stats.to_read_count}</div>
                            <div>To read</div>
                        </div>
                        <div className="flex flex-col items-center border border-gray-200 rounded-lg p-5 h-28 w-28">
                            <Icon iconNode={Star}
                                  className="size-6 opacity-70"
                            />
                            <div className="text-sm font-bold mt-1">{stats.favorites_count}</div>
                            <div>Favorites</div>
                        </div>
                        <div className="flex flex-col items-center border border-gray-200 rounded-lg p-5 h-28 w-28">
                            <Icon iconNode={Archive}
                                  className="size-6 opacity-70"
                            />
                            <div className="text-sm font-bold mt-1">{stats.archived_count}</div>
                            <div>Archived</div>
                        </div>
                    </div>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="pl-5 pt-5 flex flex-row">
                        <Icon iconNode={Glasses}
                              className="size-10 opacity-70 group-hover:opacity-100 bg"
                        />
                        <div className="pl-3">
                            <h1 className="text-xl font-bold">To Read</h1>
                            <h2 className="text-l text-gray-600">Your most recent pending reads</h2>
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
            </div>
        </AppLayout>
    );
}
