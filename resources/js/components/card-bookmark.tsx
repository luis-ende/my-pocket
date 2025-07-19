import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type PropsWithChildren } from 'react';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Bookmark, Ellipsis, Unlink } from 'lucide-react';
import { type Bookmark as BookmarkType } from '@/types';

export default function CardBookmark({ bookmark,
                                       parentRef,
                                       handleActionsClick,
                                     }: PropsWithChildren<{
    bookmark: BookmarkType;
    parentRef?: any;
    handleActionsClick?: any;
}>) {

    const url = new URL(bookmark.url);
    const cardDescription = url.hostname;

    return (
        <Card key={bookmark.id}
              className="h-80 rounded-xl bg-neutral-50 pt-0"
              ref={parentRef}
        >
            <CardHeader className="px-0 pb-0 text-center h-40">
                <a href={bookmark.url} target="_blank" rel="noopener noreferrer" title={bookmark.title}>
                    {bookmark.preview_image_url ?
                        <img
                            alt={bookmark.title}
                            className="mx-auto h-20 w-full object-cover rounded-t-xl"
                            src={bookmark.preview_image_url}
                        />
                        :
                        <div className="h-20 px-3">
                            <Icon
                                iconNode={Bookmark}
                                className="size-7 h-20 opacity-80 group-hover:opacity-100"
                            />
                        </div>
                    }
                    <CardTitle className="text-sm h-16 text-left pt-1 px-3 line-clamp-3">{bookmark.title}</CardTitle>
                </a>
                <CardDescription className="text-left text-xs px-3 h-5">
                    {cardDescription}
                </CardDescription>
            </CardHeader>
            <CardContent className="px-3 pt-0 mt-0">
                <div className="h-14 flex flex-row flex-wrap gap-x-0.5 gap-y-0.5 items-center">
                    {bookmark.tags?.split('|').map((tag) =>
                        <Badge className="text-center h-5 pt-0 bg-gray-900">{tag}</Badge>)
                    }
                </div>
            </CardContent>
            <CardFooter className="px-10">
                <div className="flex w-full flex-row">
                    <div className="basis-2/3">
                        {bookmark.is_broken_link &&
                            <Icon iconNode={Unlink} className="size-5 stroke-3 text-red-500 opacity-80" />}
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
