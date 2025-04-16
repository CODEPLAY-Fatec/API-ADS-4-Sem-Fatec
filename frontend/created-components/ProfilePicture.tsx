import React from "react";
import toast from "react-hot-toast";

interface ProfilePictureProps {
  profilePicture: string; // URL da foto de perfil
  name: string; // Nome do usuário
  email: string; // Email do usuário
  onPhotoUpload: (file: File) => void; // Callback para enviar o arquivo ao backend
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({
  profilePicture,
  name,
  email,
  onPhotoUpload,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Validação do arquivo
      if (file.size > 5 * 1024 * 1024) { // Limite de 5 MB
        toast.error("O arquivo deve ter no máximo 5 MB.",{duration:2000});
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Envie o arquivo de imagem.",{duration:2000});
        return;
      }

      onPhotoUpload(file); // Envia o arquivo para o callback
    }
  };

  return (
    <div className="flex flex-col items-center text-center gap-2">
      <img
        src={profilePicture || "/default-profile.png"} // Exibe a imagem ou uma padrão
        alt="Foto de perfil"
        className="w-24 h-24 rounded-full object-cover border shadow"
      />
      <label
        htmlFor="photo-upload"
        className="text-sm text-blue-500 cursor-pointer hover:underline"
      >
        Alterar foto
      </label>
      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange} // Chama a função ao selecionar um arquivo
      />
      <p className="font-semibold text-base">{name || "Usuário"}</p>
      <p className="text-sm text-gray-500">{email || "email@exemplo.com"}</p>
    </div>
  );
};