import FormNewCollection from '@/components/forms/form-new-collection';
import GridCollections from '@/components/views/grid-collections';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ListPlus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Collections',
        href: '/collections',
    },
];

export default function Collections() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Collections" />
            <div className="px-10 pt-10">
                <FormNewCollection
                    trigger={
                        <Button variant="outline">
                            <Icon iconNode={ListPlus} className="size-5 opacity-80 group-hover:opacity-100" />
                            Create Collection
                        </Button>
                    }
                />
            </div>
            <GridCollections />
        </AppLayout>
    );
}
