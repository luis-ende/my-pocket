import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type PropsWithChildren } from 'react';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Ellipsis } from 'lucide-react';

export default function CardBookmark({ id,
                                       title,
                                       description,
                                       url,
                                       tags,
                                       parentRef,
                                       handleActionsClick,
                                     }: PropsWithChildren<{
    id: number;
    name?: string;
    title?: string;
    description?: string;
    url?: string;
    tags?: string;
    parentRef?: any;
    handleActionsClick?: any;
}>) {
    return (
        <Card key={id} className="rounded-xl h-65" ref={parentRef}>
            <CardHeader className="px-3 pb-0 text-center">
                <a href={url} target="_blank" rel="noopener noreferrer"  title={title}>
                    <CardTitle className="text-md h-20 text-left">
                            {title}
                    </CardTitle>
                </a>
                <CardDescription className="text-xs text-left">{description}</CardDescription>
            </CardHeader>
            <CardContent className="px-10">
                {tags?.split('|').map((tag) => (
                    <Badge>{tag}</Badge>
                ))}
            </CardContent>
            <CardFooter className="px-10">
                <div className="flex flex-row w-full">
                    <div className="basis-2/3">
                    </div>
                    <div className="basis-1/3  text-right">
                        <Button
                            variant="outline"
                            className="h-[34px] w-[34px]"
                            onClick={handleActionsClick}
                            data-bookmark-id={id}
                        >
                            <Icon iconNode={Ellipsis}
                                  className="size-7 opacity-80 group-hover:opacity-100"
                            />
                        </Button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
