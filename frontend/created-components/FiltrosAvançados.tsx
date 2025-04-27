import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ListFilterPlusIcon } from 'lucide-react';

type Filters = {
    searchName: string;
    searchStatus: string;
    searchCreator: string;
    searchInst: string;
    searchSubj: string;
    dateStart: string;
    dateFinish: string;
};

type Props = {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

export default function FiltrosAvancados({ filters, setFilters }: Props) {
    const [subjects, setSubjects] = useState<{ name: string }[]>([]);
    const [institutions, setInstitutions] = useState<{ name: string }[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subjectsRes, instsRes] = await Promise.all([
                    fetch('/api/projects/subjects'),
                    fetch('/api/projects/institutions'),
                ]);

                const [subjectsData, institutionsData] = await Promise.all([
                    subjectsRes.json(),
                    instsRes.json(),
                ]);

                setSubjects(subjectsData);
                setInstitutions(institutionsData);
            } catch (error) {
                console.error('Erro ao buscar filtros:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-2">
            <Dialog.Root>
                <Dialog.Trigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                        <ListFilterPlusIcon className="w-4 h-4" />
                    </Button>
                </Dialog.Trigger>

                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 backdrop-blur-sm " />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md max-w-lg w-full shadow-lg">
                        <Dialog.Title className="text-lg font-semibold">Filtros Avançados</Dialog.Title>
                        <Dialog.Description className="mb-4 text-sm text-gray-500">
                            Selecione os filtros desejados.
                        </Dialog.Description>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {/* Status */}
                            <select
                                value={filters.searchStatus}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, searchStatus: e.target.value }))
                                }
                                className="border px-3 py-2 rounded-md"
                            >
                                <option value="">Status</option>
                                <option value="Em_andamento">Em andamento</option>
                                <option value="Concluido">Concluído</option>
                                <option value="Fechado">Fechado</option>
                            </select>

                            {/* Criador */}
                            <input
                                type='text'
                                value={filters.searchCreator}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, searchCreator: e.target.value }))
                                }
                                placeholder="Criador"
                                className="border px-3 py-2 rounded-md"
                            />

                            {/* Subjects */}
                            <select
                                value={filters.searchSubj}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, searchSubj: e.target.value }))
                                }
                                className="border px-3 py-2 rounded-md"
                            >
                                <option value="">Assunto</option>
                                {subjects.map((subject, idx) => (
                                    <option key={idx} value={subject.name}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>


                            {/* Institutions */}
                            <select
                                value={filters.searchInst}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, searchInst: e.target.value }))
                                }
                                className="border px-3 py-2 rounded-md"
                            >
                                <option value="">Instituição</option>
                                {institutions.map((inst, idx) => (
                                    <option key={idx} value={inst.name}>
                                        {inst.name}
                                    </option>
                                ))}
                            </select>


                            {/* Datas */}
                            <input
                                type="date"
                                value={filters.dateStart}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, dateStart: e.target.value }))
                                }
                                className="border px-3 py-2 rounded-md"
                            />
                            <input
                                type="date"
                                value={filters.dateFinish}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, dateFinish: e.target.value }))
                                }
                                className="border px-3 py-2 rounded-md"
                            />
                        </div>

                        <div className="flex justify-end mt-4">
                            <Dialog.Close asChild>
                                <Button variant="outline">Fechar</Button>
                            </Dialog.Close>
                            <Button
                                className="ml-2"
                                onClick={() => {
                                    setFilters({
                                        searchName: "",
                                        searchStatus: "",
                                        searchCreator: "",
                                        searchInst: "",
                                        searchSubj: "",
                                        dateStart: "",
                                        dateFinish: "",
                                    });
                                }}
                            >
                                Limpar Filtros
                            </Button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}
