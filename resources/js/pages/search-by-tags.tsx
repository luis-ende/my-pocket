import { DataTableTags } from '@/components/views/datatable-tags';
import ViewBookmarks from '@/components/views/view-bookmarks';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Bookmark, CursorPaginatedData, Tag } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import useViewConfig from '@/hooks/use-view-config';
import { useBookmarksViewContext } from '@/contexts/bookmarks-view-context';
import useChangeActivePage from '@/hooks/use-change-active-page';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tags',
        href: '/search-by-tags',
    },
];

export default function SearchByTags() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [initialBookmarks, setInitialBookmarks] = useState<CursorPaginatedData<Bookmark> | null>(null);
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [ viewConfig ] = useState(useViewConfig());
    useChangeActivePage(viewConfig);
    const { setSelectedBookmarks } = useBookmarksViewContext();

    const setSelection= (fetchTags: Tag[]) => {
        const url = new URL(window.location.href);
        const urlParams = new URLSearchParams(new URL(url).search);
        const selection: { [key: number]: boolean } = {};
        for (const [key, value] of urlParams) {
            if (key.startsWith('tags[')) {
                const index = fetchTags.findIndex((t) => t.id.toString() === value);
                if (index !== -1) {
                    selection[index] = true;
                }
            }
        }
        setRowSelection(selection);
    }

    useEffect(() => {
        const loadTags = async () => {
            fetch('/tags/index')
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to load tags');
                    return res.json();
                })
                .then((data) => {
                    const fetchTags = data.tags;
                    setTags(fetchTags);
                    setSelection(fetchTags);
                })
                .catch(() => setTags([]));
        };

        void loadTags();
    }, []);

    useEffect(() => {
        setSelectedBookmarks([]);
        setBookmarks([]);

        if (!tags || tags.length === 0 || Object.entries(rowSelection).length === 0) {
            return;
        }

        const loadBookmarks = async () => {
            const selectedTags = Object.keys(rowSelection).map((r) => tags[Number(r)].id);
            const params = new URLSearchParams();
            selectedTags.forEach((tagId) => params.append('tags[]', tagId.toString()));
            const queryString = params.toString();
            const url = `/search-by-tags?${queryString}`;

            router.visit(url, {
                method: 'get',
                preserveState: true,
                only: ['bookmarks'],
                onSuccess: ({ props }) => {
                    const bookmarks = props.bookmarks as CursorPaginatedData<Bookmark>;
                    bookmarks.tagsQueryString = queryString;
                    setInitialBookmarks(bookmarks);
                    setBookmarks(bookmarks.data);
                },
            });
        }

        void loadBookmarks();
    }, [rowSelection, tags, setSelectedBookmarks]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col md:flex-row">
                    <div className="relative overflow-auto md:flex-1/6">
                        <DataTableTags data={tags} rowSelection={rowSelection} setRowSelection={setRowSelection} />
                    </div>

                    <div className="md:flex-5/6">
                        {rowSelection && Object.keys(rowSelection).length > 0 && (
                            <div className="my-0 py-0 text-center text-sm text-gray-600">
                                Tags:{' '}
                                {Object.keys(rowSelection).map((r) => {
                                    const tagId = tags[Number(r)].id;
                                    return (
                                        <a key={tagId} href={route('search-by-tags') + '?tags%5B0%5D=' + tagId}>
                                            <Badge className="mx-1 h-5 bg-gray-600 pt-0 text-center">
                                                {tagId} ({tags[Number(r)].count})
                                            </Badge>
                                        </a>
                                    );
                                })}
                            </div>
                        )}

                        {initialBookmarks && bookmarks && bookmarks.length > 0 && (
                            <ViewBookmarks
                                initialBookmarks={initialBookmarks}
                                bookmarks={bookmarks}
                                setBookmarks={setBookmarks}
                                viewConfig={viewConfig}
                            />
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
