/*import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';*/
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import AppHeaderLayout from '@/layouts/app/app-header-layout';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppHeaderLayout breadcrumbs={breadcrumbs} {...props}>
        {children}
    </AppHeaderLayout>
);
