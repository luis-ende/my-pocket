import ViewBookmarks from '@/components/views/view-bookmarks';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import useLoadViewBookmarks from '@/hooks/use-load-view-bookmarks';
import useViewConfig from '@/hooks/use-view-config';
import { useState } from 'react';
import useChangeActivePage from '@/hooks/use-change-active-page';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Archive',
        href: '/archive',
    },
];

export default function Archive() {
    const { initialBookmarks, bookmarks, setBookmarks } = useLoadViewBookmarks();
    const [ viewConfig ] = useState(useViewConfig());
    useChangeActivePage(viewConfig);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Archive" />
            <ViewBookmarks
                initialBookmarks={initialBookmarks}
                bookmarks={bookmarks}
                setBookmarks={setBookmarks}
                viewConfig={viewConfig}
            />
        </AppLayout>
    );
}
