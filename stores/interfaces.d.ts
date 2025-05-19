interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}
