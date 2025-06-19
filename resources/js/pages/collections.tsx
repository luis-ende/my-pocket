import type { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import CardCollection from '@/components/card-collection';
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icon';
import { ListPlus } from 'lucide-react';
import FormNewCollection from '@/components/form-new-collection';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Collections',
        href: '/collections',
    },
];

export default function Collections() {
    const { collections } = usePage().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Collections" />
            <div className="px-10 pt-10">
                <FormNewCollection
                    trigger={
                        <Button
                            variant="outline"
                        >
                            <Icon iconNode={ListPlus}
                                  className="size-5 opacity-80 group-hover:opacity-100" />
                            Create Collection
                        </Button>
                    }
                />
            </div>
            <div className="px-10 py-10 grid md:grid-cols-3 sm:grid-cols-1 gap-6 sm:gap-3">
                {collections.map((collection) => {
                    return (
                        <CardCollection
                            key={collection.id}
                            id={collection.id}
                            name={collection.name}
                            description={collection.description}
                            bookmarksCount={collection.bookmarks_count}
                        />
                    );
                })}
            </div>
        </AppLayout>
    );
}
