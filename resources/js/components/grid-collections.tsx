import CardCollection from '@/components/card-collection';
import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Icon } from '@/components/icon';
import { SquarePen, Trash2 } from 'lucide-react';
import AlertDialogDelete from '@/components/alert-dialog-delete';
import FormEditCollection from '@/components/form-edit-collection';
import type { Collection } from '@/types';

export default function GridCollections() {
    const { collections } = usePage<{ collections: Collection[] }>().props;

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [positionDropDown, setPositionDropDown] = useState({ x: 0, y: 0 });
    const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);

    const [dialogDeleteState, setDialogDeleteState] = useState<{
        isOpen: boolean,
        collection: Collection | null,
        isDeleting: boolean,
    }>({
        isOpen: false,
        collection: null,
        isDeleting: false
    });

    const [dialogEditOpen, setDialogEditOpen] = useState(false);

    const openDeleteDialog = (collection: Collection) => {
        setDialogDeleteState({
            isOpen: true,
            collection: collection,
            isDeleting: false
        });
    };

    const handleDropDownItemClick = (key: string) => {
        if (!currentCollection) return;

        switch (key) {
            case 'edit':
                setDialogEditOpen(true)
                break;
            case 'delete':
                openDeleteDialog(currentCollection)
                break;
        }
    }

    const handleOpenDropDown = (event: React.MouseEvent<HTMLButtonElement>) => {
        const selectedCollection =
            collections.find(b => b.id.toString() === event.currentTarget.dataset.collectionId)
        if (!selectedCollection) {
            return;
        }

        setCurrentCollection(selectedCollection);
        const rect = event.currentTarget.getBoundingClientRect()
        const scrollTop = event.currentTarget.scrollTop || 0
        const scrollLeft = event.currentTarget.scrollLeft || 0
        setPositionDropDown({
            x: rect.left + scrollLeft,
            y: rect.bottom + scrollTop
        });
        setDropdownOpen(true)
    }

    const closeDeleteDialog = () => {
        if (!dialogDeleteState.isDeleting) {
            setDialogDeleteState({
                isOpen: false,
                collection: null,
                isDeleting: false
            });
            setTimeout(() => {
                setDropdownOpen(false);
            }, 300)
        }
    };

    const handleDeleteConfirm = () => {
        if (!dialogDeleteState.collection) return;

        setDialogDeleteState(prev => ({ ...prev, isDeleting: true }));

        router.delete(route('collections.destroy', dialogDeleteState.collection.id), {
            onSuccess: () => {
                closeDeleteDialog()
                if (currentCollection) removeCollection(currentCollection.id);
                setCurrentCollection(null)
            },
            onError: (errors) => {
                setDialogDeleteState(prev => ({ ...prev, isDeleting: false }));
                console.error('Delete failed:', errors);
            },
            onFinish: () => {
                // This runs regardless of success/error
            }
        });
    };

    const removeCollection = (collectionId: number) => {
        const index = collections.findIndex(item => item.id == collectionId);
        if (index !== -1) {
            collections.splice(index, 1);
        }
    }

    return (
        <div className="px-10 py-10 grid md:grid-cols-3 sm:grid-cols-1 gap-6 sm:gap-3">
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    <button
                        aria-label="Open actions"
                        style={{
                            position: 'fixed',
                            left: positionDropDown.x,
                            top: positionDropDown.y,
                            width: '1px',
                            height: '1px',
                            padding: '0',
                            border: 'none',
                            background: 'none'
                        }}>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" side="bottom" align="start">
                    <DropdownMenuLabel>Collection Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            setDropdownOpen(false)
                        }}
                        onClick={() => handleDropDownItemClick('edit')}
                    >
                        <Icon iconNode={SquarePen}
                              className="size-5 opacity-90 group-hover:opacity-100"
                        />
                        Edit
                    </DropdownMenuItem>

                    <AlertDialogDelete
                        onClose={closeDeleteDialog}
                        onConfirm={handleDeleteConfirm}
                        isDeleting={dialogDeleteState.isDeleting}
                        title="Delete Bookmark"
                        description="This will permanently delete the bookmark and all associated data."
                        trigger={
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                onClick={() => handleDropDownItemClick('delete')}
                            >
                                <Icon iconNode={Trash2}
                                      className="size-5 opacity-90 group-hover:opacity-100"
                                />
                                Delete
                            </DropdownMenuItem>
                        }
                    />
                </DropdownMenuContent>
            </DropdownMenu>

            {currentCollection && <FormEditCollection
                open={dialogEditOpen}
                collection={currentCollection}
                onClose={() => {
                    setDialogEditOpen(false)
                }}
            />}

            {collections.map(collection => {
                return (
                    <CardCollection
                        key={collection.id}
                        id={collection.id}
                        name={collection.name}
                        description={collection.description}
                        bookmarksCount={collection.bookmarks_count}
                        handleActionsClick={handleOpenDropDown}
                    />
                );
            })}
        </div>
    )
}
