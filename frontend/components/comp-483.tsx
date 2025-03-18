"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ProjectDetails from "@/created-components/ProjectDetails";
import { cn } from "@/lib/utils";
import { PaginationState, SortingState, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useId, useState } from "react";

const customData = [
    {
        id: "1",
        name: "Projeto A",
        email: "projetoA@example.com",
        location: "Desenvolvimento",
        flag: "BR",
        status: "Active",
        balance: 1000,
    },
    {
        id: "2",
        name: "Projeto B",
        email: "projetoB@example.com",
        location: "Design",
        flag: "US",
        status: "Inactive",
        balance: 1500,
    },
    {
        id: "3",
        name: "Projeto C",
        email: "projetoC@example.com",
        location: "Gestão",
        flag: "FR",
        status: "Active",
        balance: 800,
    },
    {
        id: "4",
        name: "Projeto D",
        email: "projetoD@example.com",
        location: "Marketing",
        flag: "DE",
        status: "Inactive",
        balance: 1200,
    },
    {
        id: "5",
        name: "Projeto E",
        email: "projetoE@example.com",
        location: "Pesquisa",
        flag: "JP",
        status: "Fechado",
        balance: 500,
    },
    {
        id: "6",
        name: "Projeto F",
        email: "projetoF@example.com",
        location: "Consultoria",
        flag: "IN",
        status: "Fechado",
        balance: 2000,
    },
    {
        id: "7",
        name: "Projeto G",
        email: "projetoG@example.com",
        location: "Desenvolvimento",
        flag: "CN",
        status: "Active",
        balance: 1300,
    },
    {
        id: "8",
        name: "Projeto H",
        email: "projetoH@example.com",
        location: "Design",
        flag: "IT",
        status: "Fechado",
        balance: 750,
    },
];

type Item = {
    id: string;
    name: string;
    email: string;
    location: string;
    flag: string;
    status: "Active" | "Inactive" | "Fechado";
    balance: number;
};

export default function Component() {
    const id = useId();
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
    });

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "name",
            desc: false,
        },
    ]);

    const [data, setData] = useState<Item[]>(customData);
    const [selectedProject, setSelectedProject] = useState<Item | null>(null);

    const handleProjectClick = (project: Item) => {
        setSelectedProject(project);
    };

    const handleCloseProjectDetails = () => {
        setSelectedProject(null);
    };

    const table = useReactTable({
        data,
        columns: [
            {
                header: "Nome",
                accessorKey: "name",
                cell: ({ row }) => (
                    <div className="font-medium cursor-pointer text-blue-500" onClick={() => handleProjectClick(row.original)}>
                        {row.getValue("name")}
                    </div>
                ),
                size: 180,
            },
            {
                header: "Status",
                accessorKey: "status",
                cell: ({ row }) => (
                    <Badge
                        className={cn(
                            row.getValue("status") === "Active" ? "bg-blue-500 text-white" : "",
                            row.getValue("status") === "Inactive" ? "bg-green-500 text-white" : "",
                            row.getValue("status") === "Fechado" ? "bg-red-500 text-white" : ""
                        )}
                    >
                        {row.getValue("status") === "Active"
                            ? "Iniciado"
                            : row.getValue("status") === "Inactive"
                            ? "Concluído"
                            : row.getValue("status") === "Fechado"
                            ? "Fechado"
                            : ""}
                    </Badge>
                ),
                size: 120,
            },
            {
                header: "Área de Atuação",
                accessorKey: "location",
                cell: ({ row }) => <Badge className="bg-white text-black border border-black">{row.getValue("location")}</Badge>,
                size: 180,
            },
            {
                header: "Responsável",
                accessorKey: "balance",
                cell: ({ row }) => {
                    const amount = parseFloat(row.getValue("balance"));
                    const formatted = new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                    }).format(amount);
                    return formatted;
                },
                size: 120,
            },
        ],
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        enableSortingRemoval: false,
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            sorting,
            pagination,
        },
    });

    return (
        <div className="space-y-4">
            {selectedProject && <ProjectDetails project={selectedProject} onClose={handleCloseProjectDetails} />}
            <div className="bg-background overflow-hidden rounded-md border">
                <Table className="table-fixed">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} style={{ width: `${header.getSize()}px` }} className="h-11 text-center">
                                            {header.isPlaceholder ? null : (
                                                <div className="bg-blue-900 text-white px-3 py-1 rounded-full text-sm w-fit mx-auto">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </div>
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-center">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between gap-8">
                {/* Page number information */}
                <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
                    <p className="text-muted-foreground text-sm whitespace-nowrap" aria-live="polite">
                        <span className="text-foreground">
                            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
                            {Math.min(
                                Math.max(
                                    table.getState().pagination.pageIndex * table.getState().pagination.pageSize + table.getState().pagination.pageSize,
                                    0
                                ),
                                table.getRowCount()
                            )}
                        </span>{" "}
                        of <span className="text-foreground">{table.getRowCount().toString()}</span>
                    </p>
                </div>

                {/* Pagination buttons */}
                <div>
                    <Pagination>
                        <PaginationContent>
                            {/* First page button */}
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="disabled:pointer-events-none disabled:opacity-50"
                                    onClick={() => table.firstPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    aria-label="Go to first page"
                                >
                                    <ChevronFirstIcon size={16} aria-hidden="true" />
                                </Button>
                            </PaginationItem>
                            {/* Previous page button */}
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="disabled:pointer-events-none disabled:opacity-50"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    aria-label="Go to previous page"
                                >
                                    <ChevronLeftIcon size={16} aria-hidden="true" />
                                </Button>
                            </PaginationItem>
                            {/* Next page button */}
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="disabled:pointer-events-none disabled:opacity-50"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    aria-label="Go to next page"
                                >
                                    <ChevronRightIcon size={16} aria-hidden="true" />
                                </Button>
                            </PaginationItem>
                            {/* Last page button */}
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="disabled:pointer-events-none disabled:opacity-50"
                                    onClick={() => table.lastPage()}
                                    disabled={!table.getCanNextPage()}
                                    aria-label="Go to last page"
                                >
                                    <ChevronLastIcon size={16} aria-hidden="true" />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}
