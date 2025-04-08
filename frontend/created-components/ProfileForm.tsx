import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileFormProps {
    userData: {
      name: string;
      email: string;
      phone: string;
    };
    onChange: (field: string, value: string) => void;
    onSave: () => void;
    isSaving: boolean;
  }
export const ProfileForm: React.FC<ProfileFormProps> = ({
    userData,
    onChange,
    onSave,
    isSaving,
  }) => {
    return (
      <div className="mt-15 col-span-2 rounded-xl shadow bg-white p-10">
        <h2 className="text-lg font-semibold mb-5">Informações</h2>
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={userData.name}
              onChange={(e) => onChange("name", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={userData.email}
              onChange={(e) => onChange("email", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={userData.phone}
              onChange={(e) => onChange("phone", e.target.value)}
            />
          </div>
        </div>
        <Button
          className="mt-4 w-full"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    );
  };