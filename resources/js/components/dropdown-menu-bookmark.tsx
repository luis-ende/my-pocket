import AlertDialogDelete from '@/components/alert-dialog-delete';
import { Icon } from '@/components/icon';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Archive, ArchiveRestore, BookOpenCheck, Copy, Glasses, Link, ListPlus, ListMinus, SquarePen, Star, StarOff, Trash2 } from 'lucide-react';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import FormEditBookmark from '@/components/forms/form-edit-bookmark';
import FormBookmarkCollectionAdd from '@/components/forms/form-bookmark-collection-add';
import useBookmarkActions from '@/hooks/use-bookmark-actions';
import useCollectionBookmarksPage from '@/hooks/use-collection-bookmarks-page';
import { useBookmarksViewContext } from '@/contexts/bookmarks-view-context';
import { Bookmark } from '@/types';

type ContextMenuBookmarkProps = {
    currentBookmark: Bookmark,
    menuTrigger: ReactNode,
    dropdownOpen: boolean,
    setDropdownOpen: (open: boolean) => void,
    setLoading: (loading: boolean) => void,
};

export default function DropdownMenuBookmark({ currentBookmark, menuTrigger, dropdownOpen, setDropdownOpen, setLoading }: ContextMenuBookmarkProps) {
    const [dialogEditOpen, setDialogEditOpen] = useState(false);
    const [dialogCollectionsOpen, setDialogCollectionsOpen] = useState(false);
    const { isCollectionBookmarksPage } = useCollectionBookmarksPage();
    const { handleSaveFav, handleSaveRead, handleCopyLink, handleArchive, handleRestoreBrokenLink, handleDeleteConfirm, handleRemoveFromCollection } = useBookmarkActions();
    const { dirtyBookmarksState } = useBookmarksViewContext();

    const handleDropDownItemClick = (key: string) => {
        if (!currentBookmark) return;

        switch (key) {
            case 'edit':
                setDialogEditOpen(true);
                break;
            case 'delete':
                // Confirm dialog triggered by dropdown item.
                break;
            case 'fav':
                setLoading(true);
                handleSaveFav(currentBookmark);
                setLoading(false)
                break;
            case 'read':
                setLoading(true);
                handleSaveRead(currentBookmark);
                setLoading(false);
                break;
            case 'addToCol':
                setDialogCollectionsOpen(true);
                break;
            case 'removeFromCol':
                // Confirm dialog triggered by dropdown item.
                break;
            case 'copy':
                handleCopyLink(currentBookmark);
                break;
            case 'archive':
                setLoading(true);
                handleArchive(currentBookmark);
                setLoading(false);
                break;
            case 'restore-broken-link':
                setLoading(true);
                handleRestoreBrokenLink(currentBookmark);
                setLoading(false);
                break;
        }
    };

    const closeDeleteDialog = useCallback(() => {
        setTimeout(() => {
            setDropdownOpen(false);
        }, 300);
    }, [setDropdownOpen]);

    useEffect(() => {
        if (!dirtyBookmarksState.dirty) return;

        switch (dirtyBookmarksState.operation) {
            case 'delete':
                closeDeleteDialog();
                break;
        }
    }, [dirtyBookmarksState, closeDeleteDialog]);

    return (
        <div>
            {currentBookmark && (<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    { menuTrigger }
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" side="bottom" align="start">
                    <DropdownMenuLabel>Bookmark Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            setDropdownOpen(false);
                        }}
                        onClick={() => handleDropDownItemClick('edit')}
                    >
                        <Icon iconNode={SquarePen} className="size-5 opacity-90 group-hover:opacity-100" />
                        Edit
                    </DropdownMenuItem>

                    <AlertDialogDelete
                        onClose={closeDeleteDialog}
                        onConfirm={() => handleDeleteConfirm(currentBookmark, setLoading)}
                        title="Delete Bookmark"
                        description="This will permanently delete the bookmark and all associated data."
                        trigger={
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => handleDropDownItemClick('delete')}>
                                <Icon iconNode={Trash2} className="size-5 opacity-90 group-hover:opacity-100" />
                                Delete
                            </DropdownMenuItem>
                        }
                    />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDropDownItemClick('fav')}>
                        {currentBookmark?.is_fav ? (
                            <Icon iconNode={StarOff} className="bg size-5 opacity-90 group-hover:opacity-100" />
                        ) : (
                            <Icon iconNode={Star} className="bg size-5 opacity-90 group-hover:opacity-100" />
                        )}
                        {currentBookmark?.is_fav ? 'Un-Favorite' : 'Favorite'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDropDownItemClick('read')}>
                        {currentBookmark?.checked ? (
                            <Icon iconNode={Glasses} className="bg size-5 opacity-90 group-hover:opacity-100" />
                        ) : (
                            <Icon iconNode={BookOpenCheck} className="bg size-5 opacity-90 group-hover:opacity-100" />
                        )}
                        {currentBookmark?.checked ? 'Mark as not read' : 'Mark as read'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            setDropdownOpen(false);
                        }}
                        onClick={() => handleDropDownItemClick('addToCol')}
                    >
                        <Icon iconNode={ListPlus} className="size-5 opacity-90 group-hover:opacity-100" />
                        Add to Collection
                    </DropdownMenuItem>
                    {isCollectionBookmarksPage && <AlertDialogDelete
                        onClose={closeDeleteDialog}
                        onConfirm={() => handleRemoveFromCollection(currentBookmark, setLoading)}
                        title="Remove bookmark from collection"
                        description="This will permanently remove the bookmark from the current collection. Are you sure?"
                        trigger={
                            <DropdownMenuItem
                                onSelect={(e) => { e.preventDefault(); }}
                                onClick={() => handleDropDownItemClick('removeFromCol')}
                            >
                                <Icon iconNode={ListMinus} className="size-5 opacity-90 group-hover:opacity-100" />
                                Remove from Collection
                            </DropdownMenuItem>
                        }
                    />}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDropDownItemClick('copy')}>
                        <Icon iconNode={Copy} className="size-5 opacity-90 group-hover:opacity-100" />
                        Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {currentBookmark?.is_broken_link && (
                        <DropdownMenuItem onClick={() => handleDropDownItemClick('restore-broken-link')}>
                            <Icon iconNode={Link} className="size-5 opacity-90 group-hover:opacity-100" />
                            Restore broken link
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleDropDownItemClick('archive')}>
                        {currentBookmark?.is_archived ? (
                            <Icon iconNode={ArchiveRestore} className="size-5 opacity-90 group-hover:opacity-100" />
                        ) : (
                            <Icon iconNode={Archive} className="size-5 opacity-90 group-hover:opacity-100" />
                        )}
                        {currentBookmark?.is_archived ? 'Un-Archive' : 'Archive'}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>)}

            {currentBookmark && (
                <FormEditBookmark
                    open={dialogEditOpen}
                    bookmark={currentBookmark}
                    onClose={() => {
                        setDialogEditOpen(false);
                    }}
                />
            )}

            {currentBookmark && (
                <FormBookmarkCollectionAdd
                    open={dialogCollectionsOpen}
                    onClose={() => {
                        setDialogCollectionsOpen(false);
                    }}
                    bookmarkIds={[currentBookmark.id]}
                />
            )}
        </div>
    );
}
