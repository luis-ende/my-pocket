import { Icon } from '@/components/icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type Bookmark as BookmarkType } from '@/types';
import { Bookmark, Ellipsis, Unlink } from 'lucide-react';
import { MouseEvent, RefObject } from 'react';

interface CardBookmarkProps {
    bookmark: BookmarkType;
    parentRef: RefObject<HTMLDivElement | null> | null;
    handleActionsClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default function CardBookmark({ bookmark, parentRef, handleActionsClick }: CardBookmarkProps) {
    const url = new URL(bookmark.url);
    const bookmarkUrlHostname = url.hostname;
    const bookmarkCreatedAt = new Date(bookmark.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <Card key={bookmark.id} className="h-80 rounded-xl bg-neutral-50 pt-0" ref={parentRef}>
            <CardHeader className="h-40 px-0 pb-0 text-center">
                <a href={bookmark.url} target="_blank" rel="noopener noreferrer" title={bookmark.title}>
                    {bookmark.preview_image_url ? (
                        <img alt={bookmark.title} className="mx-auto h-20 w-full rounded-t-xl object-cover" src={bookmark.preview_image_url} />
                    ) : (
                        <div className="h-20 px-3">
                            <Icon iconNode={Bookmark} className="size-7 h-20 opacity-80 group-hover:opacity-100" />
                        </div>
                    )}
                    <CardTitle className="line-clamp-3 h-16 px-3 pt-1 text-left text-sm">{bookmark.title}</CardTitle>
                </a>
                <CardDescription className="h-5 px-3 text-left text-xs">
                    <span className="block">{bookmarkUrlHostname}</span>
                    <span className="mt-1 block text-end">{bookmarkCreatedAt}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="mt-0 px-3 pt-0">
                <div className="flex h-14 flex-row flex-wrap items-center gap-x-0.5 gap-y-0.5">
                    {bookmark.tags !== '' &&
                        bookmark.tags?.split('|').map((tag) =>
                            <a key={tag} href={route('search-by-tags') + '?tags%5B0%5D=' + tag}>
                                <Badge className="h-5 bg-gray-900 pt-0 text-center">{tag}</Badge>
                            </a>
                        )}
                </div>
            </CardContent>
            <CardFooter className="px-10">
                <div className="flex w-full flex-row">
                    <div className="basis-2/3">
                        {bookmark.is_broken_link && <Icon iconNode={Unlink} className="size-5 stroke-3 text-red-500 opacity-80" />}
                    </div>
                    <div className="basis-1/3 text-right">
                        <Button variant="outline" className="h-[34px] w-[34px]" onClick={handleActionsClick} data-bookmark-id={bookmark.id}>
                            <Icon iconNode={Ellipsis} className="size-7 opacity-80 group-hover:opacity-100" />
                        </Button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
