import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icon';
import { ListPlus, ListMinus, SquarePen, Trash2 } from 'lucide-react';
import React, { useContext, useState } from 'react';
import BookmarksViewContext from '@/contexts/bookmarks-view-context';
import { router } from '@inertiajs/react';
import FormEditBulk from '@/components/form-edit-bulk';
import FormBookmarkCollectionAdd from '@/components/form-bookmark-collection-add';
import AlertDialogDelete from '@/components/alert-dialog-delete';
import useCollectionBookmarksPage from '@/hooks/use-collection-bookmarks-page';

export function NavBookmarks() {
    const { selectedBookmarks, setDirtyBookmarksState } = useContext(BookmarksViewContext);
    const [loading, setLoading] = useState(false);
    const [dialogEditOpen, setDialogEditOpen] = useState(false);
    const [dialogCollectionsOpen, setDialogCollectionsOpen] = useState(false);
    const { isCollectionBookmarksPage, handleRemoveBookmarkFromCollection } = useCollectionBookmarksPage();

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        switch (event.currentTarget.id) {
            case 'buttonBulkEdit':
                setDialogEditOpen(true);
                break;
            case 'buttonAddToC':
                setDialogCollectionsOpen(true);
                break;
            case 'buttonRemoveFromC':
                // Confirm dialog triggered by dropdown item.
                break;
            case 'buttonDelete':
                // Confirm dialog triggered by dropdown item.
                break;
        }
    }

    const handleDeleteConfirm = () => {
        router.post(
            route('bookmarks.bulk.destroy'), { bookmark_ids: selectedBookmarks, },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDirtyBookmarksState({
                        dirty: true,
                        operation: 'delete',
                        resetSelection: true,
                        ids: selectedBookmarks,
                    });
                },
                onFinish: () => {
                    setLoading(false);
                }
            },
        );
    }

    const onRemovedBookmarkFromCollection = () => {
        setDirtyBookmarksState({
            dirty: true,
            operation: 'delete',
            resetSelection: true,
            ids: selectedBookmarks,
        });
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
        {isCollectionBookmarksPage && <Tooltip>
            <AlertDialogDelete
                onConfirm={() => handleRemoveBookmarkFromCollection(selectedBookmarks, setLoading, onRemovedBookmarkFromCollection)}
                title="Remove bookmarks from collection"
                description="This will permanently remove the selected bookmarks from the current collection. Are you sure?"
                trigger={
                    <Button disabled={loading} id="buttonRemoveFromC" variant="ghost" className="h-[34px] w-[34px] border-1 mr-1" onClick={handleButtonClick}>
                        <span className="sr-only">Remove from Collection</span>
                        <Icon iconNode={ListMinus} className="size-5 opacity-80 group-hover:opacity-100" />
                    </Button>
                }
            />
        </Tooltip>}

        <AlertDialogDelete
            onConfirm={handleDeleteConfirm}
            title="Delete bookmarks"
            description="This will permanently delete all selected bookmarks and their associated data."
            trigger={
                <Button disabled={loading} id="buttonDelete" variant="ghost" className="h-[34px] w-[34px] border-1 mr-1" onClick={handleButtonClick}>
                    <span className="sr-only">Delete</span>
                    <Icon iconNode={Trash2} className="size-5 opacity-80 group-hover:opacity-100" />
                </Button>
            }
        />

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
