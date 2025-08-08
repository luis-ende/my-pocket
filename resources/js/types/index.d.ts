import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Bookmark {
    id: number;
    title: string;
    url: string;
    tags: string;
    checked: boolean;
    is_fav: boolean;
    is_broken_link: boolean;
    preview_image_url?: string;
    is_archived?: boolean;
    created_at: string;
}

export interface Tag {
    id: number;
    title: string;
    count?: number;
}

export interface Collection {
    id: number;
    name: string;
    description: string;
    bookmarks_count: number;
}

export type CursorPaginatedData<T> = {
    data: T[];
    path: string;
    per_page: number;
    next_cursor: string;
    next_page_url: string;
    prev_cursor: string;
    prev_page_url: string;
    tagsQueryString?: string;
};

export type PaginatedData<T> = {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: null | string;
        label: string;
        active: boolean;
    }[];
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url: string;
    to: number;
    total: number;
    tagsQueryString?: string;
};

export type Stats = {
    bookmarks_count: number;
    tags_count: number;
    collections_count: number;
    to_read_count: number;
    favorites_count: number;
    archived_count: number;
    broken_count: number;
};

export interface Collection {
    id: number;
    name: string;
    description: string;
}
