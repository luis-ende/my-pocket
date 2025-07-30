import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Ellipsis } from 'lucide-react';
import { MouseEvent } from 'react';

interface CardCollectionProps {
    id: number;
    name?: string;
    description?: string;
    bookmarksCount: number;
    handleActionsClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default function CardCollection({ id, name, description, bookmarksCount, handleActionsClick }: CardCollectionProps) {
    return (
        <Card key={id} className="h-52 rounded-xl bg-neutral-50">
            <CardHeader className="px-3 pb-0 text-center">
                <a href={route('collections.bookmarks', id)} rel="noopener noreferrer" title={name}>
                    <CardTitle className="text-md h-10 text-left">{name}</CardTitle>
                    <CardDescription className="text-left text-sm">{description}</CardDescription>
                </a>
            </CardHeader>
            <CardContent className=""></CardContent>
            <CardFooter className="px-10">
                <div className="flex w-full flex-row">
                    <div className="basis-2/3">
                        <div className="text-left text-xs text-gray-700">
                            {bookmarksCount} bookmark{bookmarksCount == 0 || bookmarksCount > 1 ? 's' : ''}
                        </div>
                    </div>
                    <div className="basis-1/3 text-right">
                        <Button variant="outline" className="h-[34px] w-[34px]" onClick={handleActionsClick} data-collection-id={id}>
                            <Icon iconNode={Ellipsis} className="size-7 opacity-80 group-hover:opacity-100" />
                        </Button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
