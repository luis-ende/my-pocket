import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBookmarksViewContext } from '@/contexts/bookmarks-view-context';
import { useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { toast } from 'sonner';
import { Bookmark } from '@/types';
import useLoadTags from '@/hooks/use-load-tags';

interface FormNewBookmarkProps {
    open: boolean;
    onClose: () => void;
}

export default function FormNewBookmark({ open, onClose }: FormNewBookmarkProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        url: '',
        tags: '',
        read: false,
    });

    const { tagsOptions } = useLoadTags('/tags/all');
    const [selectedOptions, setSelectedOptions] = useState<object[]>([]);
    const [titleLoading, setTitleLoading] = useState(false);
    const { setSavedBookmark } = useBookmarksViewContext();

    useEffect(() => {
        if (open) {
            setData('title', '');
            setData('url', '');
            setData('tags', '');
            setData('read', false);
            setSelectedOptions([]);
        }
    }, [open, setData]);

    const handleChange = (selected) => {
        setSelectedOptions(selected);
        setData('tags', selected.map((o) => o.value).join('|'));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSavedBookmark(null);
        post(route('bookmarks.store'), {
            preserveScroll: true,
            onSuccess: (page) => {
                if (page.props?.flash?.saved_bookmark) {
                    const savedBookmark = page.props.flash.saved_bookmark as Bookmark;
                    setSavedBookmark(savedBookmark);
                }
                onClose();
            },
        });
    };

    const handleDialogOpenChange = (value: boolean) => {
        return !value && onClose();
    };

    const handleProcessUrl = () => {
        if (!data.url) return;

        const url = new URL(data.url);
        if (url.protocol === 'http:' || url.protocol === 'https:') {
            const encodedUrl = encodeURIComponent(data.url);
            setTitleLoading(true);
            fetch(route('bookmarks.title') + `?target=${encodedUrl}`)
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to load bookmark title.');
                    return res.json();
                })
                .then((json) => {
                    const title = json.title ? json.title : 'Page title not found';
                    setData('title', title);
                })
                .catch((err) => {
                    toast('Failed to load bookmark title.', {
                        description: err,
                        action: {
                            label: 'Close',
                            onClick: () => console.log('Close'),
                        },
                    });
                })
                .finally(() => setTitleLoading(false));
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Bookmark</DialogTitle>
                    <DialogDescription>Create a new bookmark with:</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <fieldset>
                        <Label htmlFor="url">URL</Label>
                        <Input
                            id="url"
                            name="url"
                            type="url"
                            placeholder="Save a URL https://..."
                            value={data.url}
                            onBlur={handleProcessUrl}
                            onChange={(e) => setData('url', e.target.value)}
                            required
                        />
                        {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
                    </fieldset>
                    <fieldset>
                        <Label htmlFor="title">{titleLoading ? ' Loading bookmark title...' : 'Title'}</Label>
                        <Input
                            id="title"
                            name="title"
                            type="title"
                            readOnly={titleLoading}
                            className={titleLoading ? 'text-gray-400' : ''}
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                    </fieldset>
                    <fieldset>
                        <Label htmlFor="tags">Tags</Label>
                        <CreatableSelect
                            id="tags"
                            name="tags"
                            isClearable
                            isMulti
                            options={tagsOptions}
                            onChange={handleChange}
                            value={selectedOptions}
                        />
                        {errors.tags && <p className="text-sm text-red-500">{errors.tags}</p>}
                    </fieldset>
                    <fieldset className="flex items-center gap-3">
                        <Checkbox id="read" name="read" onCheckedChange={(e) => setData('read', e)} />
                        <Label htmlFor="read">Marked as read</Label>
                        {errors.read && <p className="text-sm text-red-500">{errors.read}</p>}
                    </fieldset>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={titleLoading || processing}>
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
