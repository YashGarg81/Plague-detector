import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)
    : null,
  token: localStorage.getItem('token'),
  isLoading: false,
  login: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null });
  },
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
}));

interface Document {
  id: string;
  originalName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  analysis?: {
    aiScore?: number;
    plagiarismScore?: number;
  } | null;
}

interface DocumentStore {
  documents: Document[];
  currentDocument: Document | null;
  setDocuments: (docs: Document[]) => void;
  setCurrentDocument: (doc: Document | null) => void;
  addDocument: (doc: Document) => void;
  removeDocument: (id: string) => void;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],
  currentDocument: null,
  setDocuments: (documents) => set({ documents }),
  setCurrentDocument: (currentDocument) => set({ currentDocument }),
  addDocument: (document) =>
    set((state) => ({ documents: [document, ...state.documents] })),
  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
    })),
}));
