"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ProjectDetails from "@/created-components/ProjectDetails";
import { cn } from "@/lib/utils";
import axios from "axios";
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

type Item = {
    id: number;
    name: string;
    description: string;
    subject: string;
    institution: string;
    creator: number;
    status: "Fechado" | "Em andamento" | "Concluído";
    location: string;
    responsavel: string;
};

type User = {
    id: number;
    name: string;
};

export default function Tabela() {
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    const [data, setData] = useState<Item[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedProject, setSelectedProject] = useState<Item | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get("/api/projects");
                setData(response.data);
            } catch (error) {
                console.error("Erro ao buscar projetos:", error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get("/api/users");
                setUsers(response.data);
                console.log("Usuários carregados:", response.data);
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
            }
        };

        fetchProjects();
        fetchUsers();
    }, []);

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

    const getResponsavelName = (creatorId: number) => {
        const user = users.find((user) => user.id === creatorId);
        return user ? user.name : "Desconhecido";
    };

    return (
        <div className="space-y-4">
            {selectedProject && <ProjectDetails project={selectedProject} onClose={handleCloseProjectDetails} users={users} />}
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
                                        <div className="font-medium cursor-pointer text-blue-500" onClick={() => handleProjectClick(row)}>
                                            {row.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {/* Fechado, Em andamento, Concluído */}
                                        <Badge
                                            className={cn(
                                                row.status === "Em andamento"
                                                    ? "bg-blue-500 text-white"
                                                    : row.status === "Concluído"
                                                    ? "bg-green-500 text-white"
                                                    : "bg-red-500 text-white"
                                            )}
                                        >
                                            {row.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge className="bg-white text-black border border-black">{row.subject}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">{getResponsavelName(row.creator)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between gap-8">
                <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
                    <p className="text-muted-foreground text-sm whitespace-nowrap" aria-live="polite">
                        <span className="text-foreground">
                            {pagination.pageIndex * pagination.pageSize + 1}-{Math.min((pagination.pageIndex + 1) * pagination.pageSize, data.length)}
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
