import Tabela from "@/components/comp-483"; 
import Component2 from "@/components/comp-97"; // Botão p/ form
import { toast } from 'react-hot-toast';// Notificaçao feedback

export default function Projetos() {
    return (
        <div className="flex justify-center items-center min-h-screen px-4 py-8 relative">
            <div className="w-full max-w-7xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-semibold">Projetos</h1>
                    <Component2 />
                </div>

                <Tabela />
            </div>
        </div>
    );
}

export const useToast = () => ({
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  loading: (message: string) => toast.loading(message),
});
