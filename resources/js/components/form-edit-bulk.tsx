import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import React, { useContext, useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import useLoadTags from '@/hooks/use-load-tags';
import BookmarksViewContext from '@/contexts/bookmarks-view-context';

interface FormEditBookmarkProps {
    open: boolean;
    onClose: () => void;
    bookmarkIds: number[];
}

export default function FormEditBulk({ open, onClose, bookmarkIds }: FormEditBookmarkProps) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        bookmark_ids: bookmarkIds,
        tags: null,
        checked: null,
        is_fav: null,
        is_archived: null,
    });

    const { tagsOptions } = useLoadTags('/tags/all');
    const [selectedOptions, setSelectedOptions] = useState<object[]>([]);
    const { setDirtyBookmarksState } = useContext(BookmarksViewContext);

    useEffect(() => {
        if (open) {
            setData('bookmark_ids', bookmarkIds);
            setData('tags', null);
            setData('checked', null);
            setData('is_fav', null);
            setData('is_archived', null);
            setSelectedOptions([]);
        }
    }, [open, setData, bookmarkIds]);

    const handleChange = (selected) => {
        setSelectedOptions(selected);
        setData('tags', selected.map((o) => o.value).join('|'));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('bookmarks.bulk.update'), {
            preserveScroll: true,
            onSuccess: () => {
                const { bookmark_ids, ...dto } = data;
                const path = window.location.pathname;
                const resetSelection = (path.includes('/favorites') && dto.is_fav === false)
                    || (path.includes('/archive') && dto.is_archived === false)
                    || (path.includes('/dashboard') && dto.checked === false);

                setDirtyBookmarksState({
                    dirty: true,
                    operation: 'update',
                    resetSelection: resetSelection,
                    ids: bookmark_ids,
                    data: dto,
                });
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog modal open={open}>
            <DialogContent forceMount>
                <DialogHeader>
                    <DialogTitle>Bulk Edit</DialogTitle>
                    <DialogDescription>Edit bookmarks</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <fieldset className="flex items-center gap-3">
                        <Checkbox id="read" className={data.checked === null ? 'bg-blue-200' : ''} onCheckedChange={(e) => setData('checked', e)} />
                        <Label htmlFor="read">Marked as read</Label>
                        {errors.checked && <p className="text-sm text-red-500">{errors.checked}</p>}
                    </fieldset>
                    <fieldset className="flex items-center gap-3">
                        <Checkbox id="isFav" className={data.is_fav === null ? 'bg-blue-200' : ''} onCheckedChange={(e) => setData('is_fav', e)} />
                        <Label htmlFor="isFav">Marked as favorite</Label>
                        {errors.is_fav && <p className="text-sm text-red-500">{errors.is_fav}</p>}
                    </fieldset>
                    <fieldset className="flex items-center gap-3">
                        <Checkbox id="isArchived" className={data.is_archived === null ? 'bg-blue-200' : ''} onCheckedChange={(e) => setData('is_archived', e)} />
                        <Label htmlFor="isArchived">Marked as archived</Label>
                        {errors.is_archived && <p className="text-sm text-red-500">{errors.is_archived}</p>}
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
