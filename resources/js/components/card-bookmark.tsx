import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type PropsWithChildren } from 'react';
import { Badge } from '@/components/ui/badge';

export default function CardBookmark({ id,
                                       title,
                                       description,
                                       url,
                                       tags,
                                       parentRef,
                                     }: PropsWithChildren<{
    id: number;
    name?: string;
    title?: string;
    description?: string;
    url?: string;
    tags?: string;
    parentRef?: any;
}>) {
    return (
        <Card key={id} className="rounded-xl h-75" ref={parentRef}>
            <CardHeader className="px-3 pt-2 pb-0 text-center">
                <a href={url} target="_blank" rel="noopener noreferrer"  title={title}>
                    <CardTitle className="text-sm h-20 bg-amber-50 text-left">
                            {title}
                    </CardTitle>
                </a>
                <CardDescription className="text-xs text-left">{description}</CardDescription>
            </CardHeader>
            <CardContent className="px-10 py-2">
                {tags?.split('|').map((tag) => (
                    <Badge>{tag}</Badge>
                ))}
            </CardContent>
            <CardFooter className="bg-blue-200">Footer</CardFooter>
        </Card>
    );
}
