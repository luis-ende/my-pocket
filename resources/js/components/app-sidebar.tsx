import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Archive, Bookmark, House, LibraryBig, ScanSearch, Star, Tags } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Home',
        href: '/dashboard',
        icon: House,
    },
    {
        title: 'Saves',
        href: '/bookmarks',
        icon: Bookmark,
    },
    {
        title: 'Collections',
        href: '/collections',
        icon: LibraryBig,
    },
    {
        title: 'Favorites',
        href: '/favorites',
        icon: Star,
    },
    {
        title: 'Tags',
        href: '/search-by-tags',
        icon: Tags,
    },
    {
        title: 'Archive',
        href: '/archive',
        icon: Archive,
    },
    {
        title: 'Search',
        href: '/search',
        icon: ScanSearch,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
            </SidebarFooter>
        </Sidebar>
    );
}
