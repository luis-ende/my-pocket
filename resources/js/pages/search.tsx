import type { BreadcrumbItem, PaginatedData, Bookmark } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import GridBookmarks from '@/components/grid-bookmarks';
import React, { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Search',
        href: '/fulltext',
    },
];

export default function Search() {
    const { bookmarks } = usePage<{ bookmarks: PaginatedData<Bookmark> }>().props;

    const params = new URLSearchParams(window.location.search);
    const searchTermParam = params.get('query') ?? '';
    const [searchTerm] = useState(decodeURIComponent(searchTermParam));

    const pageNumbers = useMemo(() => {
        const current = bookmarks.current_page;
        const last = bookmarks.last_page;
        const delta = 2; // Number of pages to show on each side of current page

        const pages: (string | number)[] = [];

        // Always show first page
        if (current > delta + 1) {
            pages.push(1);
            if (current > delta + 2) {
                pages.push('...');
            }
        }

        // Show pages around current page
        for (let i = Math.max(1, current - delta); i <= Math.min(last, current + delta); i++) {
            pages.push(i);
        }

        // Always show last page
        if (current < last - delta) {
            if (current < last - delta - 1) {
                pages.push('...');
            }
            pages.push(last);
        }

        return pages;
    }, [bookmarks.current_page, bookmarks.last_page]);

    const getPageUrl = (page: string) => {
        const url = new URL(window.location.href);
        url.searchParams.set('page', page);
        return url.pathname + url.search;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Full-text Search" />

            {/* Pagination Info */}
            {searchTerm && (<div className="text-center mt-4 mb-2 ml-4 text-gray-600 flex flex-col">
                <div className="mb-2 text-sm">
                    Search results for: "<strong>{searchTerm}</strong>."
                </div>
                {bookmarks?.data?.length > 0 && (<div className="mb-2 text-sm">
                    Showing {bookmarks.from} to {bookmarks.to} of {bookmarks.total} results.
                </div>)}
            </div>)}

            {/* Pagination */}
            <div className="flex justify-center text-xs">
                {bookmarks?.data?.length > 0 && <nav className="flex items-center space-x-2">
                    {bookmarks.prev_page_url && (
                        <Link
                            href={bookmarks.prev_page_url}
                            className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                        >
                            &lt;
                        </Link>
                    )}

                    {pageNumbers.map((page: string | number, index) => (
                        <React.Fragment key={index}>
                            {page !== '...' ? (
                                <Link
                                    href={getPageUrl(String(page))}
                                    className={`px-3 py-2 rounded transition-colors ${
                                        page === bookmarks.current_page
                                            ? 'bg-gray-600 text-white'
                                            : 'bg-transparent text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {page}
                                </Link>
                            ) : (
                                <span className="px-3 py-2 text-gray-500">...</span>
                            )}
                        </React.Fragment>
                    ))}

                    {bookmarks.next_page_url && (
                        <Link
                            href={bookmarks.next_page_url}
                            className="px-3 py-2 bg-gray-500 rounded text-white hover:bg-gray-600 transition-colors"
                        >
                            &gt;
                        </Link>
                    )}
                </nav>}
            </div>

            {/* Search results */}
            {bookmarks?.data?.length > 0 ?
                <GridBookmarks
                    initialBookmarks={bookmarks}
                    bookmarks={bookmarks.data}
                    setBookmarks={null}
                    infiniteScroll={false}
                />
                :
                searchTerm === '' ?
                        <div></div>
                    :
                        <div className="text-center mt-4 mb-2 ml-4 text-gray-600 flex flex-col">
                            No bookmarks found.
                        </div>
            }
        </AppLayout>
    );
}
