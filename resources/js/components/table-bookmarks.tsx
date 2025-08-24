import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bookmark, BookmarksViewConfig } from '@/types';
import { RefObject, useContext, useEffect, useState } from 'react';
import BookmarksViewContext from '@/contexts/bookmarks-view-context';
import useViewConfig from '@/hooks/use-view-config';

export const columns: ColumnDef<Bookmark>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox className="align-top" checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'title',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Title
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => <div className="w-xl truncated-paragraph"><a href={row.original.url} target="_blank" className="">{row.getValue('title')}</a></div>,
    },
    {
        accessorKey: 'url_host',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Site
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => <div className="">{row.getValue('url_host')}</div>,
    },
    {
        accessorKey: 'tags',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Tags
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => <div className="">{row.getValue('tags')}</div>,
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Created at
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => {
            const bookmarkCreatedAt = new Date(row.getValue('created_at'))
                .toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });

            return (<div className="">{bookmarkCreatedAt}</div>)
        },
    },
];

interface DataTableTagsProps {
    data: Bookmark[];
    lastItemRef: RefObject<HTMLTableRowElement>;
    perPage: number;
    viewConfig: BookmarksViewConfig;
}

export function TableBookmarks({ data, lastItemRef, perPage }: DataTableTagsProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const { setSelectedBookmarks, dirtyBookmarksState } = useContext(BookmarksViewContext);
    const [loading, setLoading] = useState(false);
    const viewConfig = useViewConfig();

    const [rowSelection, setRowSelection] = useState(() => {
        setLoading(true);
        const indexes: number[] = viewConfig.selectedBookmarks.map((b: number) =>
            data.findIndex((item: Bookmark) => item.id == b));
        let sel = {};
        indexes.forEach((index: number) => index >= 0 ? sel = { ...sel, [index]: true } : sel );
        setLoading(false);

        return sel;
    });

    const table = useReactTable({
        data,
        columns,
        manualPagination: true,
        enableRowSelection: true,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    useEffect(() => {
        if (loading) return;

        setSelectedBookmarks(Object.keys(rowSelection).map((b: string) => data[Number(b)].id));
    }, [rowSelection, setSelectedBookmarks, data, loading]);

    useEffect(() => {
        if (dirtyBookmarksState.dirty === true && dirtyBookmarksState.resetSelection) {
            table.resetRowSelection();
            setSelectedBookmarks([]);
        }
    }, [dirtyBookmarksState, table, setSelectedBookmarks]);

    return (
        <div className="w-full p-5">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter..."
                    value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row, index: number) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} ref={index === ((table.getRowModel().rows.length - 1) - perPage) ? lastItemRef : null}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
