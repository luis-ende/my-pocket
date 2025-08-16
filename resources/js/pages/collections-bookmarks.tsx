import ViewBookmarks from '@/components/view-bookmarks';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Collection } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import useLoadViewBookmarks from '@/hooks/use-load-view-bookmarks';
import useViewConfig from '@/hooks/use-view-config';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Collection Bookmarks',
        href: '/collections',
    },
];

export default function Collections() {
    const { collection } = usePage<{ collection: Collection }>().props;
    const { initialBookmarks, bookmarks, setBookmarks } = useLoadViewBookmarks();
    const viewConfig = useViewConfig();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Collection Bookmarks" />
            <div className="px-10">
                <div className="font-bold">{collection.name}</div>
                <div className="text-sm text-gray-600">{collection.description}</div>
            </div>
            <ViewBookmarks
                initialBookmarks={initialBookmarks}
                bookmarks={bookmarks}
                setBookmarks={setBookmarks}
                viewConfig={viewConfig}
            />
        </AppLayout>
    );
}
