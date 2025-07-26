import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bookmark, Collection } from '@/types';

export default function FormBookmarkCollectionAdd({ open,
                                                    onClose,
                                                    bookmark }: React.PropsWithChildren<{
    open: boolean;
    onClose: () => void;
    bookmark: Bookmark | null;
}>) {
    const { data, setData, post, processing, errors, reset } = useForm({
        bookmarkId: bookmark?.id,
        collectionId: 0
    });

    const [collections, setCollections] = useState<Collection[]>([]);

    useEffect(() => {
        loadCollections();
    }, []);

    useEffect(() => {
        if (open && bookmark) {
            setData('bookmarkId', bookmark.id)
            fetch(route('bookmarks.collections', bookmark.id))
                .then(res => {
                    if (!res.ok) throw new Error('Failed to load bookmark collections.');
                    return res.json();
                })
                .then(data => setData('collectionId', data.collectionId))
                .catch(() => setData('collectionId', 0));
        }
    }, [bookmark, open, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('bookmarks.addToCollection'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const loadCollections = () => {
        fetch(route('collections.list'))
            .then(res => {
                if (!res.ok) throw new Error('Failed to load collections.');
                return res.json();
            })
            .then(data => setCollections(data.collections))
            .catch(() => setCollections([]));
    }

    return (
        <Dialog
            modal
            open={open}
        >
            <DialogContent forceMount>
                <DialogHeader>
                    <DialogTitle>Add to Collection</DialogTitle>
                    <DialogDescription>Add bookmark to a collection</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <fieldset>
                        <Label htmlFor="collections">Collections</Label>
                        <Select name="collections"
                                value={String(data.collectionId)}
                                onValueChange={(value) => setData('collectionId', parseInt(value))}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a collection" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {collections.map(collection => (
                                        <SelectItem key={collection.id} value={String(collection.id)}>
                                            {collection.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.bookmarkId && (
                            <p className="text-sm text-red-500">{errors.bookmarkId}</p>
                        )}
                    </fieldset>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onClose() }>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
