export interface User {
  id: string;
  password: string;
  code: string;
}

export const sampleUsers: User[] = [
  {
    id: 'admin',
    password: 'admin123',
    code: 'admin',
  },
]; 