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
import React, { useContext, useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import BookmarksContext from '@/contexts/bookmarks-context';

interface FormNewBookmarkProps {
    open: boolean;
    onClose: () => void;
    tags: object[];
}

export default function FormNewBookmark({ open,
                                          onClose,
                                          tags }: FormNewBookmarkProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        url: '',
        tags: '',
        notes: '',
        read: false,
    });

    const [selectedOptions, setSelectedOptions] = useState<object[]>([]);
    const [tagsOptions, setTagsOptions] = useState<object[]>([]);
    const [titleLoading, setTitleLoading] = useState(false);
    const { setNewBookmark } = useContext(BookmarksContext);

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
        setNewBookmark(null);
        post('/bookmarks', {
            preserveScroll: true,
            onSuccess: (page) => {
                if (page.props.new_bookmark) {
                    setNewBookmark(page.props.new_bookmark);
                }
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

    const handleProcessUrl = () => {
        if (!data.url) return;

        const url = new URL(data.url);
        if (url.protocol === "http:" || url.protocol === "https:") {
            const encodedUrl = encodeURIComponent(data.url);
            setTitleLoading(true);
            fetch(route('bookmarks.title') + `?target=${encodedUrl}`)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to load bookmark title.');
                    return res.json();
                })
                .then(json => {
                    const title = json.title ? json.title : 'Page title not found';
                    setData('title', title);
                })
                .catch(err => {
                    toast("Failed to load bookmark title.", {
                        description: err,
                        action: {
                            label: "Close",
                            onClick: () => console.log("Close"),
                        },
                    })
                })
                .finally(() => setTitleLoading(false));
        }
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
                            name="url"
                            type="url"
                            placeholder="Save a URL https://..."
                            value={data.url}
                            onBlur={handleProcessUrl}
                            onChange={(e) => setData('url', e.target.value)}
                            required
                        />
                        {errors.url && (
                            <p className="text-sm text-red-500">{errors.url}</p>
                        )}
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
                        {errors.title && (
                            <p className="text-sm text-red-500">{errors.title}</p>
                        )}
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
                        {errors.tags && (
                            <p className="text-sm text-red-500">{errors.tags}</p>
                        )}
                    </fieldset>
                    <fieldset>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            name="notes"
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
                            name="read"
                            onCheckedChange={(e) => setData('read', e)}
                        />
                        <Label htmlFor="read">Read</Label>
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
                        <Button type="submit" disabled={titleLoading || processing}>
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
