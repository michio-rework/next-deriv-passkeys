import create from "zustand";
import { TSecureUser } from "../types/user.type";

export interface StoreState {
  accessToken: string;
  user: TSecureUser;
  appLoading: boolean;
  setAccessToken: (input: string) => void;
  removeAccessToken: () => void;
  setUser: (input: TSecureUser) => void;
  removeUser: () => void;
  logout: () => void;
  setAppLoading: (loading: boolean) => void;
}

const initialUser: TSecureUser = {
  id: -1,
  email: "",
};

export const useAppStore = create<StoreState>((set) => ({
  accessToken: "",
  user: { ...initialUser },
  appLoading: false,
  setAccessToken: (input) => set(() => ({ accessToken: input })),
  removeAccessToken: () => set({ accessToken: undefined }),
  setUser: (input) => set(() => ({ user: input })),
  removeUser: () => set({ user: undefined }),
  logout: () => set({ user: { ...initialUser }, accessToken: "" }),
  setAppLoading: (loading) => set({ appLoading: loading }),
}));
