import React from "react";
import toast from "react-hot-toast";
import UserAvatar from "./UserAvatar"; // Import UserAvatar component

interface ProfilePictureProps {
  profilePicture: string; // URL da foto de perfil 
  name: string; // Nome do usuário
  email: string; // Email do usuário
  userId: number; // ID do usuário pro useravatar
  onPhotoUpload: (file: File) => void; // Callback para enviar o arquivo ao backend
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({
  profilePicture,
  name,
  email,
  userId,
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
    <div className="flex flex-col items-center text-center gap-2 py-2">
      <div className="flex justify-center mb-2">
        <div className="w-28 h-28"> 
          <UserAvatar
            userId={userId}
            name={name}
            size="lg"
            className="!w-28 !h-28 !text-2xl" 
          />
        </div>
      </div>
      
      <label
        htmlFor="photo-upload"
        className="text-blue-500 cursor-pointer hover:underline text-sm" /* Smaller text */
      >
        Alterar foto
      </label>
      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      
      <div className="text-center mt-0"> 
        <p className="font-semibold text-lg">{name || "Usuário"}</p> 
        <p className="text-gray-500 text-sm mt-0">{email || "email@exemplo.com"}</p> 
      </div>
    </div>
  );
};