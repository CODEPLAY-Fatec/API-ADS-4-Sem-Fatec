import { useEffect, useState, useMemo } from "react";
import axios from "axios";

interface UserAvatarProps {
  userId: number;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  userId,
  name,
  size = 'md',
  showName = false,
  className = "",
}) => {
  const [avatarSrc, setAvatarSrc] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasImage, setHasImage] = useState<boolean>(true);

  // Definição de tamanhos
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-base",  // Default lg size, can be overridden
  };

  // Função para gerar iniciais do nome
  const initials = useMemo(() => {
    if (!name) return "?";
    
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (
      nameParts[0].charAt(0) + 
      nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  }, [name]);

  // Função para gerar cor de fundo baseada no userId
  const backgroundColor = useMemo(() => {
    // Cores do projeto com diferentes tonalidades de azul
    const colors = [
      '#1C3373', // Azul escuro primário do projeto
      '#2C4483',
      '#3C5593',
      '#4C66A3',
      '#5C77B3',
      '#6C88C3'
    ];
    
    // Usar userId para selecionar uma cor consistente
    const colorIndex = userId % colors.length;
    return colors[colorIndex];
  }, [userId]);

  useEffect(() => {
    const fetchUserAvatar = async () => {
      setIsLoading(true);
      try {
        // Tentativa de buscar a foto do usuário pelo ID
        const response = await axios.get(`/api/userAvatar/${userId}`);
        setAvatarSrc(`data:image/png;base64,${response.data.base64}`);
        setHasImage(true);
      } catch (error) {
        // Se falhar, não mostraremos uma imagem padrão, mas sim as iniciais
        setHasImage(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserAvatar();
    }
  }, [userId]);

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden border shadow flex-shrink-0 flex items-center justify-center ${className}`}>
        {isLoading ? (
          <div className={`${sizeClasses[size]} bg-gray-200 animate-pulse`}></div>
        ) : hasImage ? (
          <img
            src={avatarSrc}
            alt={name || "Usuário"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            style={{ backgroundColor }}
            className="w-full h-full flex items-center justify-center text-white font-medium"
          >
            {initials}
          </div>
        )}
      </div>
      {showName && name && (
        <span className="ml-2 text-gray-700 truncate">{name}</span>
      )}
    </div>
  );
};

export default UserAvatar;
