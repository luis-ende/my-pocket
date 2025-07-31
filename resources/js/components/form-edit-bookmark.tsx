import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bookmark } from '@/types';
import { useForm } from '@inertiajs/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import BookmarksContext from '@/contexts/bookmarks-context';

interface FormEditBookmarkProps {
    open: boolean;
    onClose: () => void;
    bookmark: Bookmark;
    tags: object[];
}

export default function FormEditBookmark({ open, onClose, bookmark, tags }: FormEditBookmarkProps) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        url: bookmark?.url,
        tags: bookmark?.tags,
        notes: '',
        read: bookmark?.checked,
    });

    const [selectedOptions, setSelectedOptions] = useState<object[]>([]);
    const [tagsOptions, setTagsOptions] = useState<object[]>([]);
    const inputRef = useRef(null);
    const { setSavedBookmark } = useContext(BookmarksContext);

    useEffect(() => {
        setTagsOptions([]);
        if (tags && tags.length > 0) {
            const options = tags.map((t) => ({ label: t.tag, value: t.tag, color: '#00B8D9' }));
            setTagsOptions(options);
        }
    }, [tags]);

    const handleChange = (selected) => {
        setSelectedOptions(selected);
        setData('tags', selected.map((o) => o.value).join('|'));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('bookmarks.update', bookmark.id), {
            preserveScroll: true,
            onSuccess: (page) => {
                if (page.props?.flash?.saved_bookmark) {
                    const savedBookmark = page.props.flash.saved_bookmark as Bookmark;
                    setSavedBookmark(savedBookmark);
                    bookmark.tags = savedBookmark.tags;
                    bookmark.checked = savedBookmark.checked;
                    bookmark.is_fav = savedBookmark.is_fav;
                    bookmark.is_archived = savedBookmark.is_archived;
                    bookmark.preview_image_url = savedBookmark.preview_image_url;
                }
                reset();
                onClose();
            },
        });
    };

    useEffect(() => {
        if (bookmark?.tags) {
            setSelectedOptions(bookmark?.tags.split('|').map((t: string) => ({ label: t, value: t, color: '#00B8D9' })));
        } else {
            setSelectedOptions([]);
        }
    }, [bookmark]);

    return (
        <Dialog modal open={open}>
            <DialogContent forceMount>
                <DialogHeader>
                    <DialogTitle>Edit Bookmark</DialogTitle>
                    <DialogDescription>{bookmark?.title}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <fieldset>
                        <Label htmlFor="url">URL</Label>
                        <Input className="bg-gray-100" ref={inputRef} id="url" type="url" value={bookmark?.url} readOnly={true} />
                    </fieldset>
                    <fieldset>
                        <Label htmlFor="tags">Tags</Label>
                        <CreatableSelect
                            id="tags"
                            name="tags"
                            autoFocus
                            isClearable
                            isMulti
                            options={tagsOptions}
                            onChange={handleChange}
                            value={selectedOptions}
                        />
                        {errors.tags && <p className="text-sm text-red-500">{errors.tags}</p>}
                    </fieldset>
                    <fieldset>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
                        {errors.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
                    </fieldset>
                    <fieldset className="flex items-center gap-3">
                        <Checkbox id="read" defaultChecked={bookmark?.checked} onCheckedChange={(e) => setData('read', e)} />
                        <Label htmlFor="read">Read</Label>
                        {errors.read && <p className="text-sm text-red-500">{errors.read}</p>}
                    </fieldset>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                        >
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
