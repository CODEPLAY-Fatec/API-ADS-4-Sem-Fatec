type User = {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  password: string;
  bio?: string;
  location?: string;
  linkedin?: string;
  lastAccess?: string;
};

export type { User };