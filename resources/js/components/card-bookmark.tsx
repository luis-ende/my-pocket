import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type PropsWithChildren } from 'react';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Bookmark, Ellipsis, Unlink } from 'lucide-react';

export default function CardBookmark({ id,
                                       title,
                                       description,
                                       url,
                                       tags,
                                       isBrokenLink,
                                       previewImageUrl,
                                       parentRef,
                                       handleActionsClick,
                                     }: PropsWithChildren<{
    id: number;
    name?: string;
    title?: string;
    description?: string;
    url?: string;
    tags?: string;
    isBrokenLink: boolean;
    previewImageUrl?: string;
    parentRef?: any;
    handleActionsClick?: any;
}>) {
    return (
        <Card key={id} className="h-80 rounded-xl bg-neutral-50" ref={parentRef}>
            <CardHeader className="px-3 pb-0 text-center">
                <a href={url} target="_blank" rel="noopener noreferrer" title={title}>
                    {previewImageUrl ?
                        <img
                            alt={title}
                            className="mx-auto h-20 w-full object-cover"
                            src={previewImageUrl}
                        />
                        :
                        <div className="h-20">
                            <Icon iconNode={Bookmark} className="size-7 opacity-80 group-hover:opacity-100" />
                        </div>
                    }
                    <CardTitle className="text-md h-16 text-left">{title}</CardTitle>
                </a>
                <CardDescription className="text-left text-xs">{description}</CardDescription>
            </CardHeader>
            <CardContent className="px-10">{tags?.split('|').map((tag) => <Badge>{tag}</Badge>)}</CardContent>
            <CardFooter className="px-10">
                <div className="flex w-full flex-row">
                    <div className="basis-2/3">{isBrokenLink && <Icon iconNode={Unlink} className="size-5 stroke-3 text-red-500 opacity-80" />}</div>
                    <div className="basis-1/3 text-right">
                        <Button variant="outline" className="h-[34px] w-[34px]" onClick={handleActionsClick} data-bookmark-id={id}>
                            <Icon iconNode={Ellipsis} className="size-7 opacity-80 group-hover:opacity-100" />
                        </Button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
