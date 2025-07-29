import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import React from 'react';
import { Collection } from '@/types';

interface FormEditCollectionProps {
    open: boolean;
    onClose: () => void;
    collection: Collection;
}

export default function FormEditCollection({ open,
                                             onClose,
                                             collection }: FormEditCollectionProps) {
    const { setData, patch, processing, errors, reset } = useForm({
        name: collection?.name,
        description: collection?.description,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('collections.update', collection.id), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog
            modal
            open={open}
        >
            <DialogContent forceMount>
                <DialogHeader>
                    <DialogTitle>Edit Collection</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <fieldset>
                        <Label htmlFor="name">Collection Name</Label>
                        <Input
                            id="name"
                            value={collection?.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                    </fieldset>
                    <fieldset>
                        <Label htmlFor="name">Description</Label>
                        <Input
                            id="description"
                            value={collection?.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description}</p>
                        )}
                    </fieldset>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" onClick={() => onClose()}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
