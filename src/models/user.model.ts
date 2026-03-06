export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  role: 'user' | 'admin';
  avatar_url: string | null;
  is_suspended: boolean;
  created_at: Date;
  updated_at: Date;
}