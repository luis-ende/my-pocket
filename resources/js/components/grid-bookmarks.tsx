import React, { useState, useRef } from 'react';
import CardBookmark from '@/components/card-bookmark';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function GridBookmarks({initialBookmarks, bookmarks, setBookmarks}) {
    const [nextPage, setNextPage] = useState(initialBookmarks.next_page_url);
    const [tags] = useState(initialBookmarks.tagsQueryString);
    const [loading, setLoading] = useState(false);
    const lastItemRef = useRef<HTMLDivElement | null>(null);

    const loadMore = () => {
        if (!nextPage || loading) return;

        setLoading(true);

        let fullNextPageUrl = nextPage;
        if (tags && tags.length > 0) {
            fullNextPageUrl += '&' + tags;
        }

        router.visit(fullNextPageUrl, {
            method: 'get',
            preserveState: true,
            only: ['bookmarks'],
            onSuccess: ({props}) => {
                const newBookmarks = props.bookmarks.data;
                setBookmarks(prev => [...prev, ...newBookmarks]);
                setNextPage(props.bookmarks.next_page_url);

                // Scroll to the first new item after DOM updates
                setTimeout(() => {
                    lastItemRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
            },
            onFinish: () => setLoading(false),
        })
    }

    return (
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-auto rounded-xl border">
            <div className="px-10 py-10 grid grid-cols-3 gap-6">
                {bookmarks.map((bookmark, index) => {
                    const url = new URL(bookmark.url);
                    const domain = url.hostname;
                    return (
                        <CardBookmark
                            parentRef={index === bookmarks.length - 1 ? lastItemRef : null}
                            key={bookmark.id}
                            id={bookmark.id}
                            title={bookmark.title}
                            description={domain}
                            url={bookmark.url}
                            tags={bookmark.tags}
                        />
                    );
                })}
            </div>

            {nextPage && (
                <div className="mb-6 text-center">
                    <Button
                        className="w-60"
                        variant="default"
                        onClick={loadMore}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Load more...'}
                    </Button>
                </div>
            )}
        </div>
    );
}
