import ViewBookmarks from '@/components/view-bookmarks';
import AppLayout from '@/layouts/app-layout';
import useNewBookmark from '@/hooks/use-new-bookmark';
import useLoadViewBookmarks from '@/hooks/use-load-view-bookmarks';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Saves',
        href: '/bookmarks',
    },
];

export default function Bookmarks() {
    const { initialBookmarks, bookmarks, setBookmarks } = useLoadViewBookmarks();
    useNewBookmark(setBookmarks);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Bookmarks" />
            <ViewBookmarks initialBookmarks={initialBookmarks} bookmarks={bookmarks} setBookmarks={setBookmarks} infiniteScroll={true} />
        </AppLayout>
    );
}
