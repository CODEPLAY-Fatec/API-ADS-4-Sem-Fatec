import Tabela from "@/components/comp-483";
import BotaoNovoProjeto from "@/components/comp-97"; // Botão p/ form
import Navbar from "@/created-components/Navbar";
import { toast } from "react-hot-toast"; // Notificaçao feedback

export default function Projetos() {
    return (
        <div className="min-h-screen flex flex-col relative">
            <Navbar />
            <div className="flex flex-col flex-grow px-4 py-8">
                <div className="w-full max-w-7xl pt-20 mx-auto">
                    <div className="flex justify-between items-center mb-6 sticky top-4 z-10 py-4">
                        <h1 className="text-3xl font-semibold">Projetos</h1>
                        <BotaoNovoProjeto />
                    </div>
                    <Tabela />
                </div>
            </div>
        </div>
    );
}

export const useToast = () => ({
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    loading: (message: string) => toast.loading(message),
});
