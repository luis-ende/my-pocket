import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import React, { MouseEvent } from 'react';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Ellipsis } from 'lucide-react';

interface CardCollectionProps {
    id: number;
    name?: string;
    description?: string;
    bookmarksCount: number;
    handleActionsClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default function CardCollection({ id,
                                       name,
                                       description,
                                       bookmarksCount,
                                       handleActionsClick,
                                     }: CardCollectionProps) {
    return (
        <Card
            key={id}
            className="rounded-xl h-52 bg-neutral-50"
        >
            <CardHeader className="px-3 pb-0 text-center">
                <a href={route('collections.bookmarks', id)}
                   rel="noopener noreferrer"
                   title={name}
                >
                    <CardTitle className="text-md h-10 text-left">
                        {name}
                    </CardTitle>
                    <CardDescription className="text-sm text-left">{description}</CardDescription>
                </a>
            </CardHeader>
            <CardContent className="">
            </CardContent>
            <CardFooter className="px-10">
                <div className="flex flex-row w-full">
                    <div className="basis-2/3">
                        <div className="text-xs text-left text-gray-700">
                            {bookmarksCount} bookmark{bookmarksCount == 0 || bookmarksCount > 1 ? "s" : ""}
                        </div>
                    </div>
                    <div className="basis-1/3  text-right">
                        <Button
                            variant="outline"
                            className="h-[34px] w-[34px]"
                            onClick={handleActionsClick}
                            data-collection-id={id}
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
