import GridBookmarks from '@/components/grid-bookmarks';
import { Icon } from '@/components/icon';
import AppLayout from '@/layouts/app-layout';
import type { Bookmark, BreadcrumbItem, CursorPaginatedData, Stats } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Archive, Bookmark as BookmarkIcon, ChartNetwork, Glasses, LibraryBig, Star, Tags, Unlink } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import BookmarksContext from '@/contexts/bookmarks-context';

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
    const [toReadBookmarks, setToReadBookmarks] = useState(initialBookmarks.data);
    const { stats } = usePage<{
        stats: Stats;
    }>().props;

    const { savedBookmark } = useContext(BookmarksContext);
    useEffect(() => {
        if (savedBookmark) {
            if (savedBookmark.is_new == true && !savedBookmark.checked) {
                setToReadBookmarks((prev) => (!prev.find((b) => b.id === savedBookmark.id) ? [savedBookmark, ...prev] : prev));
            }
        }
    }, [savedBookmark]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative rounded-xl border">
                    <div className="flex flex-row pt-5 pl-5">
                        <Icon iconNode={ChartNetwork} className="bg size-10 opacity-70 group-hover:opacity-100" />
                        <div className="pl-3">
                            <h1 className="text-xl font-bold">Stats</h1>
                            <h2 className="text-l text-gray-600">All in one</h2>
                        </div>
                    </div>
                    <div className="flex flex-row flex-wrap items-center justify-center space-y-5 space-x-5 py-5">
                        <div className="flex h-28 w-28 flex-col items-center rounded-lg border border-gray-200 p-5">
                            <Icon iconNode={BookmarkIcon} className="size-6 opacity-70" />
                            <div className="mt-1 text-sm font-bold">{stats.bookmarks_count}</div>
                            <div>Bookmarks</div>
                        </div>
                        <div className="flex h-28 w-28 flex-col items-center rounded-lg border border-gray-200 p-5">
                            <Icon iconNode={Tags} className="size-6 opacity-70" />
                            <div className="mt-1 text-sm font-bold">{stats.tags_count}</div>
                            <div>Tags</div>
                        </div>
                        <div className="flex h-28 w-28 flex-col items-center rounded-lg border border-gray-200 p-5">
                            <Icon iconNode={LibraryBig} className="size-6 opacity-70" />
                            <div className="mt-1 text-sm font-bold">{stats.collections_count}</div>
                            <div>Collections</div>
                        </div>
                        <div className="flex h-28 w-28 flex-col items-center rounded-lg border border-gray-200 p-5">
                            <Icon iconNode={Glasses} className="size-6 opacity-70" />
                            <div className="mt-1 text-sm font-bold">{stats.to_read_count}</div>
                            <div>To read</div>
                        </div>
                        <div className="flex h-28 w-28 flex-col items-center rounded-lg border border-gray-200 p-5">
                            <Icon iconNode={Star} className="size-6 opacity-70" />
                            <div className="mt-1 text-sm font-bold">{stats.favorites_count}</div>
                            <div>Favorites</div>
                        </div>
                        <div className="mb-5 flex h-28 w-28 flex-col items-center rounded-lg border border-gray-200 p-5">
                            <Icon iconNode={Archive} className="size-6 opacity-70" />
                            <div className="mt-1 text-sm font-bold">{stats.archived_count}</div>
                            <div>Archived</div>
                        </div>
                        <div className="mb-5 flex h-28 w-28 flex-col items-center rounded-lg border border-gray-200 p-5">
                            <Icon iconNode={Unlink} className="size-6 opacity-70" />
                            <div className="mt-1 text-sm font-bold">{stats.broken_count}</div>
                            <div>Broken</div>
                        </div>
                    </div>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="flex flex-row pt-5 pl-5">
                        <Icon iconNode={Glasses} className="bg size-10 opacity-70 group-hover:opacity-100" />
                        <div className="pl-3">
                            <h1 className="text-xl font-bold">To Read</h1>
                            <h2 className="text-l text-gray-600">Your most recent pending reads</h2>
                        </div>
                    </div>
                    {toReadBookmarks && (
                        <GridBookmarks
                            initialBookmarks={initialBookmarks}
                            bookmarks={toReadBookmarks}
                            setBookmarks={setToReadBookmarks}
                            infiniteScroll={true}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
