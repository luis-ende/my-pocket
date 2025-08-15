import ViewBookmarks from '@/components/view-bookmarks';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import useLoadViewBookmarks from '@/hooks/use-load-view-bookmarks';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Archive',
        href: '/archive',
    },
];

export default function Archive() {
    const { initialBookmarks, bookmarks, setBookmarks } = useLoadViewBookmarks();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Archive" />
            <ViewBookmarks
                initialBookmarks={initialBookmarks}
                bookmarks={bookmarks}
                setBookmarks={setBookmarks}
                infiniteScroll={true}
            />
        </AppLayout>
    );
}
