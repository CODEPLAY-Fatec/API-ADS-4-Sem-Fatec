"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ProjectDetails from "@/created-components/ProjectDetails";
import { cn } from "@/lib/utils";
import axios from "axios";
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import ProjectType from "@shared/Project";

type User = {
    id: number;
    name: string;
};

type Project = ProjectType & { member_ids: number[], member_names: string[], member_emails: string[] }

export default function Tabela() {
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    const [data, setData] = useState<Project[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const fetchProjects = async () => {
        try {
            const response = await axios.get("/api/projects");
            const sortedProjects = response.data.result.sort((a: Project, b: Project) => b.id - a.id);
            setData(sortedProjects);
            setUsers(response.data.users);
        } catch (error) {
            console.error("Erro ao buscar projetos:", error);
        }
    };

    useEffect(() => {
        fetchProjects();
        const interval = setInterval(() => {
            fetchProjects();
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleProjectClick = (project: Project) => setSelectedProject(project);
    const handleCloseProjectDetails = () => { 
        setSelectedProject(null);
        fetchProjects();
    };

    const currentPageData = data.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize);
    const totalPages = Math.ceil(data.length / pagination.pageSize);

    return (
        <div className="space-y-4">
            {selectedProject && <ProjectDetails project={selectedProject} onClose={handleCloseProjectDetails} users={users} />}
            <div className="bg-background overflow-hidden rounded-md border">
                <Table className="table-fixed">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="h-11 text-center">Nome</TableHead>
                            <TableHead className="h-11 text-center">Status</TableHead>
                            <TableHead className="h-11 text-center">Área de Atuação</TableHead>
                            <TableHead className="h-11 text-center">Responsável</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentPageData.length ? (
                            currentPageData.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell className="text-center cursor-pointer text-blue-500" onClick={() => handleProjectClick(row)}>
                                        {row.name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge className={cn(
                                            row.status === "Em andamento" ? "bg-blue-500 text-white"
                                            : row.status === "Concluído" ? "bg-green-500 text-white"
                                            : "bg-red-500 text-white"
                                        )}>
                                            {row.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge className="bg-white text-black border border-black">{row.subject}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">{users.find(u => u.id === row.creator)?.name || "Desconhecido"}</TableCell>
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
                {data.length > 0 && (
                    <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
                        <p className="text-muted-foreground text-sm whitespace-nowrap">
                            {pagination.pageIndex * pagination.pageSize + 1}-{Math.min((pagination.pageIndex + 1) * pagination.pageSize, data.length)} de {data.length}
                        </p>
                    </div>
                )}

                <div className="flex gap-4">
                    <Button size="icon" variant="outline" onClick={() => setPagination({ ...pagination, pageIndex: 0 })} disabled={pagination.pageIndex === 0 || data.length === 0}>
                        <ChevronFirstIcon size={16} />
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }))} disabled={pagination.pageIndex === 0 || data.length === 0}>
                        <ChevronLeftIcon size={16} />
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))} disabled={pagination.pageIndex === totalPages - 1 || data.length === 0}>
                        <ChevronRightIcon size={16} />
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => setPagination({ ...pagination, pageIndex: totalPages - 1 })} disabled={pagination.pageIndex === totalPages - 1 || data.length === 0}>
                        <ChevronLastIcon size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
}