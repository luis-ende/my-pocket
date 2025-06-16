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
import { Textarea } from "@/components/ui/textarea"
import CreatableSelect from 'react-select/creatable';
import React, { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

export default function FormNewBookmark({ open, onClose, tags }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        url: '',
        tags: '',
        notes: '',
        read: true,
    });

    const [selectedOptions, setSelectedOptions] = useState([]);

    const [tagsOptions, setTagsOptions] = useState([]);

    useEffect(() => {
        setTagsOptions([]);
        if (tags && tags.length > 0) {
            const options = tags.map(t => (
                { label: t.tag, value: t.tag, color: '#00B8D9' }
            ));
            setTagsOptions(options);
        }
    }, [tags]);

    const handleChange = (selected) => {
        setSelectedOptions(selected);
        setData('tags', selected.map(o => o.value).join('|'));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/bookmarks', {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const handleDialogOpenChange = (value : boolean) => {
        reset();
        setSelectedOptions([]);
        return !value && onClose();
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Bookmark</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <fieldset>
                        <Label htmlFor="url">URL</Label>
                        <Input
                            id="url"
                            type="url"
                            placeholder="Save a URL https://..."
                            value={data.url}
                            onChange={(e) => setData('url', e.target.value)}
                        />
                        {errors.url && (
                            <p className="text-sm text-red-500">{errors.url}</p>
                        )}
                    </fieldset>
                    <fieldset>
                        <Label htmlFor="tags">Tags</Label>
                        <CreatableSelect
                            id="tags"
                            isClearable
                            isMulti
                            options={tagsOptions}
                            onChange={handleChange}
                            value={selectedOptions}
                        />
                        {errors.tags && (
                            <p className="text-sm text-red-500">{errors.tags}</p>
                        )}
                    </fieldset>
                    <fieldset>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                        />
                        {errors.notes && (
                            <p className="text-sm text-red-500">{errors.notes}</p>
                        )}
                    </fieldset>
                    <fieldset className="flex items-center gap-3">
                        <Checkbox
                            id="read"
                            defaultChecked
                            onCheckedChange={(e) => setData('read', e)}
                        />
                        <Label htmlFor="read">Mark as read</Label>
                        {errors.read && (
                            <p className="text-sm text-red-500">{errors.read}</p>
                        )}
                    </fieldset>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
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
