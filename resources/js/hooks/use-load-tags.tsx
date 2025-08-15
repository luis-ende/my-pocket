import { useEffect, useState } from 'react';

export default function useLoadTags(fetchUrl: string) {
    const [tags, setTags] = useState([]);
    const [tagsOptions, setTagsOptions] = useState<object[]>([]);

    useEffect(() => {
        fetch(fetchUrl)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to load tags');
                return res.json();
            })
            .then((data) => setTags(data.tags))
            .catch(() => setTags([]));
    }, [fetchUrl]);

    useEffect(() => {
        setTagsOptions([]);
        if (tags && tags.length > 0) {
            const options = tags.map((t) => ({ label: t.tag, value: t.tag, color: '#00B8D9' }));
            setTagsOptions(options);
        }
    }, [tags]);

    return { tags, setTags, tagsOptions, setTagsOptions };
}
