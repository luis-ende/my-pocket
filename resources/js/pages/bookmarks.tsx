import ViewBookmarks from '@/components/views/view-bookmarks';
import AppLayout from '@/layouts/app-layout';
import useNewBookmark from '@/hooks/use-new-bookmark';
import useLoadViewBookmarks from '@/hooks/use-load-view-bookmarks';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import useViewConfig from '@/hooks/use-view-config';
import { useState } from 'react';
import useChangeActivePage from '@/hooks/use-change-active-page';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Saves',
        href: '/bookmarks',
    },
];

export default function Bookmarks() {
    const { initialBookmarks, bookmarks, setBookmarks } = useLoadViewBookmarks();
    useNewBookmark(setBookmarks);
    const [ viewConfig ] = useState(useViewConfig());
    useChangeActivePage(viewConfig);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Bookmarks" />
            <ViewBookmarks
                initialBookmarks={initialBookmarks}
                bookmarks={bookmarks}
                setBookmarks={setBookmarks}
                viewConfig={viewConfig}
            />
        </AppLayout>
    );
}
