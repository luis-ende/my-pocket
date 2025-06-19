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

export default function FormBookmarkCollectionAdd({ open, onClose, bookmark }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        bookmarkId: 0,
        collectionId: 0
    });

    const [collections, setCollections] = useState([]);

    useEffect(() => {
        if (open) {
            setData('collectionId', 0);
            if (bookmark) {
                loadCollections();
                setData('bookmarkId', bookmark.id)
                loadBookmarkCollections();
            }
        }
    }, [open]);

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

    const loadBookmarkCollections = () => {
        if (bookmark) {
            fetch(route('bookmarks.collections', bookmark.id))
                .then(res => {
                    if (!res.ok) throw new Error('Failed to load bookmark collections.');
                    return res.json();
                })
                .then(data => setData('collectionId', data.collectionId))
                .catch(() => setData('collectionId', 0));
        }
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
                        {errors.collection && (
                            <p className="text-sm text-red-500">{errors.collection}</p>
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
