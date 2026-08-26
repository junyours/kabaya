import * as React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];

    /** Optional action button displayed on the right */
    button?: React.ReactNode;

    /** Server-side pagination */
    page: number;
    lastPage: number;
    setPage: (page: number) => void;

    /** Server-side search */
    search: string;
    setSearch: (value: string) => void;

    /** Loading state */
    isLoading?: boolean;

    /** Search input placeholder */
    searchPlaceholder?: string;

    /** Text displayed when there are no records */
    emptyMessage?: string;

    /** Text displayed below empty message */
    emptyDescription?: string;

    /** Whether to show the search field */
    searchable?: boolean;

    /** Optional className for the table wrapper */
    className?: string;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    button,
    page,
    lastPage,
    setPage,
    search,
    setSearch,
    isLoading = false,
    searchPlaceholder = "Search...",
    emptyMessage = "No results found.",
    emptyDescription = "Try adjusting your search or add a new record.",
    searchable = true,
    className,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const hasData = table.getRowModel().rows.length > 0;

    const handleSearch = (value: string) => {
        setSearch(value);

        if (page !== 1) {
            setPage(1);
        }
    };

    return (
        <div className={cn("space-y-5", className)}>
            {/* Toolbar */}
            {(searchable || button) && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Search */}
                    {searchable ? (
                        <div className="relative w-full sm:max-w-sm">
                            <Search
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    size-4
                                    -translate-y-1/2
                                    text-muted-foreground
                                "
                            />

                            <Input
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder={searchPlaceholder}
                                className="h-10 pl-9"
                            />
                        </div>
                    ) : (
                        <div />
                    )}

                    {/* Action */}
                    {button && <div className="w-full sm:w-auto">{button}</div>}
                </div>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-xl border">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/40">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="hover:bg-transparent"
                                >
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="
                                                        h-11
                                                        whitespace-nowrap
                                                        px-4
                                                        text-xs
                                                        font-semibold
                                                        uppercase
                                                        tracking-wide
                                                        text-muted-foreground
                                                    "
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>

                        <TableBody>
                            {/* Loading */}
                            {isLoading ? (
                                Array.from({
                                    length: 5,
                                }).map((_, rowIndex) => (
                                    <TableRow key={`loading-row-${rowIndex}`}>
                                        {columns.map((_, columnIndex) => (
                                            <TableCell
                                                key={`loading-cell-${columnIndex}`}
                                                className="px-4 py-4"
                                            >
                                                <div
                                                    className={cn(
                                                        "h-4 animate-pulse rounded-md bg-muted",
                                                        columnIndex === 0
                                                            ? "w-32"
                                                            : "w-24",
                                                    )}
                                                />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : hasData ? (
                                /* Data */
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected()
                                                ? "selected"
                                                : undefined
                                        }
                                        className="
                                                border-b
                                                transition-colors
                                                hover:bg-muted/30
                                                data-[state=selected]:bg-muted
                                            "
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="px-4 py-3"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                /* Empty */
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-48"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-3 text-center">
                                            <div className="flex size-11 items-center justify-center rounded-full bg-muted">
                                                <Search className="size-5 text-muted-foreground" />
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium">
                                                    {emptyMessage}
                                                </p>

                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {emptyDescription}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                    Page{" "}
                    <span className="font-medium text-foreground">{page}</span>{" "}
                    of{" "}
                    <span className="font-medium text-foreground">
                        {lastPage}
                    </span>
                </p>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={isLoading || page <= 1}
                        className="h-9 gap-1.5"
                    >
                        <ChevronLeft className="size-4" />
                        Previous
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={isLoading || page >= lastPage}
                        className="h-9 gap-1.5"
                    >
                        Next
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
