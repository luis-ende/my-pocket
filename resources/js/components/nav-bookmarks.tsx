import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icon';
import { Archive, Glasses, ListPlus, Star, Tag, Trash2 } from 'lucide-react';
import { useContext } from 'react';
import BookmarksViewContext from '@/contexts/bookmarks-view-context';

export function NavBookmarks() {
    const { selectedBookmarks } = useContext(BookmarksViewContext);

    return selectedBookmarks && selectedBookmarks.length > 0 && <div className="flex text-gray-700">
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="default" className="h-[34px] w-[34px] border-1 mr-1">
                    { selectedBookmarks.length }
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Bookmarks seleccionados</p>
            </TooltipContent>
        </Tooltip>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" className="h-[34px] w-[34px] border-1 mr-1">
                    <span className="sr-only">Tag</span>
                    <Icon iconNode={Tag} className="size-5 opacity-80 group-hover:opacity-100" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Tag</p>
            </TooltipContent>
        </Tooltip>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" className="h-[34px] w-[34px] border-1 mr-1">
                    <span className="sr-only">Read</span>
                    <Icon iconNode={Glasses} className="size-5 opacity-80 group-hover:opacity-100" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Mark as read</p>
            </TooltipContent>
        </Tooltip>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" className="h-[34px] w-[34px] border-1 mr-1">
                    <span className="sr-only">Favorite</span>
                    <Icon iconNode={Star} className="size-5 opacity-80 group-hover:opacity-100" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Favorite</p>
            </TooltipContent>
        </Tooltip>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" className="h-[34px] w-[34px] border-1 mr-1">
                    <span className="sr-only">Add to Collection</span>
                    <Icon iconNode={ListPlus} className="size-5 opacity-80 group-hover:opacity-100" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Add to Collection</p>
            </TooltipContent>
        </Tooltip>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" className="h-[34px] w-[34px] border-1 mr-1">
                    <span className="sr-only">Delete</span>
                    <Icon iconNode={Trash2} className="size-5 opacity-80 group-hover:opacity-100" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Delete</p>
            </TooltipContent>
        </Tooltip>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" className="h-[34px] w-[34px] border-1 mr-1">
                    <span className="sr-only">Archive</span>
                    <Icon iconNode={Archive} className="size-5 opacity-80 group-hover:opacity-100" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Archive</p>
            </TooltipContent>
        </Tooltip>
    </div>;
}
