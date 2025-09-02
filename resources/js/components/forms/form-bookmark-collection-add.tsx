import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collection } from '@/types';
import { useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

interface FormBookmarkCollectionProps {
    open: boolean;
    onClose: () => void;
    bookmarkIds: number[];
}

export default function FormBookmarkCollectionAdd({ open, onClose, bookmarkIds }: FormBookmarkCollectionProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        bookmarkIds: bookmarkIds,
        collectionId: 0,
    });

    const [collections, setCollections] = useState<Collection[]>([]);

    useEffect(() => {
        loadCollections();
    }, []);

    useEffect(() => {
        setData('bookmarkIds', bookmarkIds);
        setData('collectionId', 0);

        if (open && bookmarkIds.length === 1) {
            fetch(route('bookmarks.collections', bookmarkIds[0]))
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to load bookmark collections.');
                    return res.json();
                })
                .then((data) => setData('collectionId', data.collectionId))
                .catch(() => setData('collectionId', 0));
        }
    }, [bookmarkIds, open, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('bookmarks.addToCollection'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const loadCollections = () => {
        fetch(route('collections.list'))
            .then((res) => {
                if (!res.ok) throw new Error('Failed to load collections.');
                return res.json();
            })
            .then((data) => setCollections(data.collections))
            .catch(() => setCollections([]));
    };

    return (
        <Dialog modal open={open}>
            <DialogContent forceMount>
                <DialogHeader>
                    <DialogTitle>Add to Collection</DialogTitle>
                    <DialogDescription>Add bookmark to a collection</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <fieldset>
                        <Label htmlFor="collections">Collections</Label>
                        <Select
                            name="collections"
                            value={String(data.collectionId)}
                            onValueChange={(value) => setData('collectionId', parseInt(value))}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a collection" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {collections.map((collection) => (
                                        <SelectItem key={collection.id} value={String(collection.id)}>
                                            {collection.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.bookmarkIds && <p className="text-sm text-red-500">{errors.bookmarkIds}</p>}
                    </fieldset>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onClose()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={data.collectionId === 0 || processing}>
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
