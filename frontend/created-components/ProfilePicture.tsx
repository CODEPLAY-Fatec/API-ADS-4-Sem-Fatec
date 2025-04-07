import React from "react";

interface ProfilePictureProps {
  profilePicture: string;
  name: string;
  email: string;
  onPhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({
  profilePicture,
  name,
  email,
  onPhotoUpload,
}) => {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <img
        src={profilePicture || "/default-profile.png"}
        alt=""
        className="mt-15 w-35 h-35 rounded-full object-cover border shadow"
      />
      <label
        htmlFor="photo-upload"
        className="mt-5 text-sm text-blue-500 cursor-pointer hover:underline"
      >
        Alterar foto
      </label>
      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onPhotoUpload}
      />
      <p className="font-semibold text-lg">{name || "Usuário"}</p>
      <p className="text-sm text-gray-500">{email || "email@exemplo.com"}</p>
    </div>
  );
};