"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useId, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ProjectDetails from "@/created-components/ProjectDetails";
import { cn } from "@/lib/utils";

const customData = [
    { id: "1", name: "Projeto A", email: "projetoA@example.com", location: "Desenvolvimento", status: "Active", responsavel: "Ana Silva" },
    { id: "2", name: "Projeto B", email: "projetoB@example.com", location: "Design", status: "Inactive", responsavel: "Carlos Souza" },
    { id: "3", name: "Projeto C", email: "projetoC@example.com", location: "Gestão", status: "Active", responsavel: "Beatriz Lima" },
    { id: "4", name: "Projeto D", email: "projetoD@example.com", location: "Marketing", status: "Inactive", responsavel: "Diego Martins" },
    { id: "5", name: "Projeto E", email: "projetoE@example.com", location: "Pesquisa", status: "Fechado", responsavel: "Fernanda Rocha" },
    { id: "6", name: "Projeto F", email: "projetoF@example.com", location: "Consultoria", status: "Fechado", responsavel: "Lucas Alves" },
    { id: "7", name: "Projeto G", email: "projetoG@example.com", location: "Desenvolvimento", status: "Active", responsavel: "Mariana Duarte" },
    { id: "8", name: "Projeto H", email: "projetoH@example.com", location: "Design", status: "Fechado", responsavel: "Roberto Nunes" },
];

type Item = {
    id: string;
    name: string;
    email: string;
    location: string;
    status: "Active" | "Inactive" | "Fechado";
    responsavel: string;
};

export default function Tabela() {
    const id = useId();
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    const [data, setData] = useState<Item[]>(customData);
    const [selectedProject, setSelectedProject] = useState<Item | null>(null);

    const handleProjectClick = (project: Item) => setSelectedProject(project);
    const handleCloseProjectDetails = () => setSelectedProject(null);

    const currentPageData = data.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize);

    const totalPages = Math.ceil(data.length / pagination.pageSize);

    const handleNextPage = () => {
        if (pagination.pageIndex < totalPages - 1) {
            setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
        }
    };

    const handlePreviousPage = () => {
        if (pagination.pageIndex > 0) {
            setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }));
        }
    };

    const handleFirstPage = () => {
        setPagination({ ...pagination, pageIndex: 0 });
    };

    const handleLastPage = () => {
        setPagination({ ...pagination, pageIndex: totalPages - 1 });
    };

    return (
        <div className="space-y-4">
            {selectedProject && <ProjectDetails project={selectedProject} onClose={handleCloseProjectDetails} />}
            <div className="bg-background overflow-hidden rounded-md border">
                <Table className="table-fixed">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="h-11 text-center">
                                <span className="bg-blue-900 text-white px-3 py-1 rounded-full text-sm">Nome</span>
                            </TableHead>
                            <TableHead className="h-11 text-center">
                                <span className="bg-blue-900 text-white px-3 py-1 rounded-full text-sm">Status</span>
                            </TableHead>
                            <TableHead className="h-11 text-center">
                                <span className="bg-blue-900 text-white px-3 py-1 rounded-full text-sm">Área de Atuação</span>
                            </TableHead>
                            <TableHead className="h-11 text-center">
                                <span className="bg-blue-900 text-white px-3 py-1 rounded-full text-sm">Responsável</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentPageData.length ? (
                            currentPageData.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell className="text-center">
                                        <div className="font-medium cursor-pointer text-blue-500" onClick={() => handleProjectClick(row)}>{row.name}</div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge className={cn(row.status === "Active" ? "bg-blue-500 text-white" : row.status === "Inactive" ? "bg-green-500 text-white" : "bg-red-500 text-white")}>{row.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge className="bg-white text-black border border-black">{row.location}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">{row.responsavel}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">No results.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between gap-8">
                <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
                    <p className="text-muted-foreground text-sm whitespace-nowrap" aria-live="polite">
                        <span className="text-foreground">
                            {pagination.pageIndex * pagination.pageSize + 1}-
                            {Math.min((pagination.pageIndex + 1) * pagination.pageSize, data.length)}
                        </span>{" "}
                        of <span className="text-foreground">{data.length}</span>
                    </p>
                </div>

                <div>
                    <div className="flex gap-4">
                        <Button size="icon" variant="outline" onClick={handleFirstPage} disabled={pagination.pageIndex === 0}>
                            <ChevronFirstIcon size={16} />
                        </Button>
                        <Button size="icon" variant="outline" onClick={handlePreviousPage} disabled={pagination.pageIndex === 0}>
                            <ChevronLeftIcon size={16} />
                        </Button>
                        <Button size="icon" variant="outline" onClick={handleNextPage} disabled={pagination.pageIndex === totalPages - 1}>
                            <ChevronRightIcon size={16} />
                        </Button>
                        <Button size="icon" variant="outline" onClick={handleLastPage} disabled={pagination.pageIndex === totalPages - 1}>
                            <ChevronLastIcon size={16} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
