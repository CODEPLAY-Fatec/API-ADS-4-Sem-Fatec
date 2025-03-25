import Tabela from "@/components/comp-483";
import Component2 from "@/components/comp-97"; // Botão p/ form
import { toast } from 'react-hot-toast';// Notificaçao feedback
import Navbar from "@/created-components/Navbar";

export default function Projetos() {
    return (
        <div className="min-h-screen flex flex-col relative">
            <Navbar />
            <div className="flex justify-center items-center flex-grow px-4 py-8">
                <div className="w-full max-w-7xl">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-semibold">Projetos</h1>
                        <Component2 />
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
