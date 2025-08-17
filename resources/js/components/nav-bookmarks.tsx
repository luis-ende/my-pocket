import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icon';
import { ListPlus, SquarePen, Trash2 } from 'lucide-react';
import React, { useContext, useState } from 'react';
import BookmarksViewContext from '@/contexts/bookmarks-view-context';
import { router } from '@inertiajs/react';
import FormEditBulk from '@/components/form-edit-bulk';
import FormBookmarkCollectionAdd from '@/components/form-bookmark-collection-add';

export function NavBookmarks() {
    const { selectedBookmarks } = useContext(BookmarksViewContext);
    const [loading, setLoading] = useState(false);
    const [dialogEditOpen, setDialogEditOpen] = useState(false);
    const [dialogCollectionsOpen, setDialogCollectionsOpen] = useState(false);

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        switch (event.currentTarget.id) {
            case 'buttonBulkEdit':
                setDialogEditOpen(true);
                break;
            case 'buttonAddToC':
                setDialogCollectionsOpen(true);
                break;
            case 'buttonDelete':
                // todo show confirm dialog
                router.post(
                    route('bookmarks.bulk.destroy'), { bookmark_ids: selectedBookmarks, },
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            // todo: throw event (via Context) to notify components that need to process active bookmarks to reflect updates
                        },
                        onFinish: () => {
                            setLoading(false);
                        }
                    },
                );
                break;
        }
    }

    return selectedBookmarks && selectedBookmarks.length > 0 && <div className="flex text-gray-700">
        <Tooltip>
            <TooltipTrigger asChild>
                <Button disabled={loading} variant="default" className="h-[34px] w-[34px] border-1 mr-1" onClick={handleButtonClick}>
                    { selectedBookmarks.length }
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Selected bookmarks</p>
            </TooltipContent>
        </Tooltip>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button disabled={loading} id="buttonBulkEdit" variant="ghost" className="h-[34px] w-[34px] border-1 mr-1" onClick={handleButtonClick}>
                    <span className="sr-only">Bulk Edit</span>
                    <Icon iconNode={SquarePen} className="size-5 opacity-80 group-hover:opacity-100" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Edit multiple bookmarks</p>
            </TooltipContent>
        </Tooltip>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button disabled={loading} id="buttonAddToC" variant="ghost" className="h-[34px] w-[34px] border-1 mr-1" onClick={handleButtonClick}>
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
                <Button disabled={loading} id="buttonDelete" variant="ghost" className="h-[34px] w-[34px] border-1 mr-1" onClick={handleButtonClick}>
                    <span className="sr-only">Delete</span>
                    <Icon iconNode={Trash2} className="size-5 opacity-80 group-hover:opacity-100" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Delete bookmarks</p>
            </TooltipContent>
        </Tooltip>

        <FormEditBulk
            open={dialogEditOpen}
            onClose={() => {
                setDialogEditOpen(false);
            }}
            bookmarkIds={selectedBookmarks}
        />

        {selectedBookmarks.length > 0 && (
            <FormBookmarkCollectionAdd
                open={dialogCollectionsOpen}
                onClose={() => {
                    setDialogCollectionsOpen(false);
                }}
                bookmarkIds={selectedBookmarks}
            />
        )}
    </div>;
}
