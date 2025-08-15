import { TableBookmarks } from '@/components/table-bookmarks';
import { Bookmark, CursorPaginatedData, PaginatedData } from '@/types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import GridBookmarks from '@/components/grid-bookmarks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, Table } from 'lucide-react';
import { Icon } from '@/components/icon';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

type ViewBookmarksProps = {
    initialBookmarks: CursorPaginatedData<Bookmark> | PaginatedData<Bookmark>;
    bookmarks: Bookmark[];
    setBookmarks: React.Dispatch<React.SetStateAction<Bookmark[]>> | null;
    infiniteScroll: boolean;
};
export default function ViewBookmarks({ initialBookmarks, bookmarks, setBookmarks, infiniteScroll }: ViewBookmarksProps) {
    const [nextPage, setNextPage] = useState(initialBookmarks.next_page_url);
    const [perPage, setPerPage] = useState(initialBookmarks.per_page);
    const tagsQueryString = initialBookmarks?.tagsQueryString;
    const [loading, setLoading] = useState(false);
    const lastItemRef = useRef<HTMLDivElement | HTMLTableRowElement | null>(null);
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('search-tab') || 'gridView';
    });

    useEffect(() => {
        localStorage.setItem('search-tab', activeTab);
    }, [activeTab]);

    const loadMore = useCallback(async () => {
        if (!nextPage || loading) return;

        setLoading(true);

        let fullNextPageUrl = nextPage;
        if (tagsQueryString && tagsQueryString.length > 0) {
            fullNextPageUrl += '&' + tagsQueryString;
        }

        router.visit(fullNextPageUrl, {
            method: 'get',
            preserveState: true,
            preserveScroll: true,
            only: ['bookmarks'],
            onSuccess: ({ props }) => {
                const newBookmarks = props.bookmarks.data;
                setBookmarks((prev) => [...prev, ...newBookmarks]);
                setNextPage(props.bookmarks.next_page_url);
                setPerPage(props.bookmarks.per_page);

                // Scroll to the first new item after DOM updates
                setTimeout(() => {
                    lastItemRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
            },
            onFinish: () => setLoading(false),
        });
    }, [loading, nextPage, setBookmarks, tagsQueryString]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
    }

    return (
        <div>
            <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
                <TabsList className="mt-5 ml-5">
                    <TabsTrigger value="gridView">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span>
                                    <Icon iconNode={LayoutGrid} className="size-5 opacity-80 group-hover:opacity-100" />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Grid Mode</p>
                            </TooltipContent>
                        </Tooltip>
                    </TabsTrigger>
                    <TabsTrigger value="tableView">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span>
                                    <Icon iconNode={Table} className="size-5 opacity-80 group-hover:opacity-100" />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Table Mode</p>
                            </TooltipContent>
                        </Tooltip>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="gridView">
                    <GridBookmarks bookmarks={bookmarks} lastItemRef={lastItemRef} perPage={perPage} />
                </TabsContent>
                <TabsContent value="tableView">
                    <TableBookmarks data={bookmarks} lastItemRef={lastItemRef} perPage={perPage}></TableBookmarks>
                </TabsContent>
            </Tabs>

            {infiniteScroll && nextPage && (
                <div className="mb-6 text-center">
                    <Button className="w-60" variant="default" onClick={loadMore} disabled={loading}>
                        {loading ? 'Loading...' : 'Load more...'}
                    </Button>
                </div>
            )}
        </div>
    );
}
