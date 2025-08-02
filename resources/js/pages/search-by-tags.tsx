import { DataTableTags } from '@/components/datatable-tags';
import GridBookmarks from '@/components/grid-bookmarks';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Bookmark, CursorPaginatedData, Tag } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

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

    useEffect(() => {
        const loadTags = async () => {
            fetch('/tags/index')
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to load tags');
                    return res.json();
                })
                .then((data) => setTags(data.tags))
                .catch(() => setTags([]));
        };

        void loadTags();
    }, []);

    useEffect(() => {
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
    }, [rowSelection, tags]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="gap- 4 flex h-full flex-1 flex-col rounded-xl p-4">
                <div className="flex flex-col md:flex-row">
                    <div className="relative overflow-auto md:flex-1/6">
                        <DataTableTags data={tags} rowSelection={rowSelection} setRowSelection={setRowSelection} />
                    </div>

                    <div className="md:flex-5/6">
                        {initialBookmarks && bookmarks && bookmarks.length > 0 && (
                            <GridBookmarks
                                initialBookmarks={initialBookmarks}
                                bookmarks={bookmarks}
                                setBookmarks={setBookmarks}
                                infiniteScroll={true}
                            />
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
