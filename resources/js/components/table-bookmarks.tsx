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
import { ArrowUpDown, Ellipsis } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bookmark } from '@/types';
import { RefObject, useContext, useEffect, useState } from 'react';
import BookmarksViewContext from '@/contexts/bookmarks-view-context';
import useViewConfig from '@/hooks/use-view-config';
import { Icon } from '@/components/icon';
import DropdownMenuBookmark from '@/components/dropdown-menu-bookmark';
import useDropDownMenuState from '@/hooks/use-dropdown-menu-state';

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
}

export function TableBookmarks({ data, lastItemRef, perPage }: DataTableTagsProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const { setSelectedBookmarks, dirtyBookmarksState } = useContext(BookmarksViewContext);
    const [loading, setLoading] = useState(false);
    const viewConfig = useViewConfig();
    const { dropdownOpen, setDropdownOpen, positionDropDown, currentBookmark, handleOpenDropDown } = useDropDownMenuState();

    const [rowSelection, setRowSelection] = useState(() => {
        setLoading(true);
        const indexes: number[] = viewConfig.selectedBookmarks.map((b: number) =>
            data.findIndex((item: Bookmark) => item.id == b));
        let sel = {};
        indexes.forEach((index: number) => index >= 0 ? sel = { ...sel, [index]: true } : sel );
        setLoading(false);

        return sel;
    });

    columns[0].cell = ({ row }) => (
        <div className="flex flex-row w-14">
            <Button variant="outline" className="h-[12px] w-[12px] mr-2" data-bookmark-id={row.original.id}
                    onClick={(e) =>
                        handleOpenDropDown(e, table.getRowModel().rows.map(r => r.original)) }
            >
                <Icon iconNode={Ellipsis} className="size-5 opacity-80 group-hover:opacity-100" />
            </Button>
            <Checkbox className="align-top" checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
        </div>
    )

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
            {currentBookmark && <DropdownMenuBookmark
                currentBookmark={currentBookmark}
                menuTrigger={
                    <button
                        aria-label="Open actions"
                        style={{
                            position: 'fixed',
                            left: positionDropDown.x,
                            top: positionDropDown.y,
                            width: '1px',
                            height: '1px',
                            padding: '0',
                            border: 'none',
                            background: 'none',
                        }}
                    ></button>}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                setLoading={setLoading}
            />}

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
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    ref={index === table.getRowModel().rows.length - 1 - perPage ? lastItemRef : null}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="max-w-60 overflow-hidden">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
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
