import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { Textarea } from "@/components/ui/textarea"
import CreatableSelect from 'react-select/creatable';
import React, { useState, useRef, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

export default function FormEditBookmark({ open, onClose, bookmark, tags }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        url: '',
        tags: '',
        notes: '',
        read: false,
    });

    const [selectedOptions, setSelectedOptions] = useState([]);
    const inputRef = useRef(null);
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
        patch(route('bookmarks.update', bookmark.id), {
            onSuccess: () => {
                bookmark.tags = data.tags
                reset();
                onClose();
            },
        });
    };

    useEffect(() => {
        reset();
        if (bookmark) {
            setData('url', bookmark.url);
            setData('tags', bookmark.tags);
            if (bookmark.tags) {
                setSelectedOptions(bookmark?.tags
                    .split('|')
                    .map((t: string) => ({ label: t, value: t, color: '#00B8D9' })));
            } else {
                setSelectedOptions([]);
            }
            setData('notes', bookmark.notes);
            setData('read', bookmark.checked);
        }
    }, [bookmark]);

    return (
        <Dialog
            modal
            open={open}
        >
            <DialogContent forceMount>
                <DialogHeader>
                    <DialogTitle>Edit Bookmark</DialogTitle>
                    <DialogDescription>{bookmark?.title}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <fieldset>
                        <Label htmlFor="url">URL</Label>
                        <Input
                            className="bg-gray-100"
                            ref={inputRef}
                            id="url"
                            type="url"
                            value={data.url}
                            readOnly={true}
                        />
                    </fieldset>
                    <fieldset>
                        <Label htmlFor="tags">Tags</Label>
                        <CreatableSelect
                            autoFocus
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
