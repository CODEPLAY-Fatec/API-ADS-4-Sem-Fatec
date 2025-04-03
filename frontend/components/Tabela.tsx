"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Dispatch, useEffect, useState } from "react";
import ProjectType from "@shared/Project";

type FetchedProject = ProjectType & {
    creatorInfo: User;
    users: User[];
}

type User = {
    id: number;
    name: string;
    email: string;
};

type TabelaProps = {
    setSelectedProject: any; 
}

export default function Tabela(props: TabelaProps) {
    const router = useRouter();
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    const [data, setData] = useState<FetchedProject[]>([]);

    const fetchProjects = async () => {
        try {
            const response = await axios.get("/api/projects");
            const sortedProjects = response.data.result.sort((a: FetchedProject, b: FetchedProject) => a.id - b.id);
            setData(sortedProjects);
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

    const handleProjectClick = (project: FetchedProject) => {
        props.setSelectedProject(project) 
        //router.push(`projetos/descricao/${project.id}`);
    };

    const currentPageData = data.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize);
    const totalPages = Math.ceil(data.length / pagination.pageSize);

    return (
        <div className="space-y-4">
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
                                            row.status === "Em_andamento" ? "bg-blue-500 text-white"
                                            : row.status === "Concluido" ? "bg-green-500 text-white"
                                            : "bg-red-500 text-white"
                                        )}>
                                            {row.status.replace("_", " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge className="bg-white text-black border border-black">{row.subject}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">{row.creatorInfo?.name || "Desconhecido"}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">Nenhum resultado encontrado.</TableCell>
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
