import { ReactNode } from "react";
import ReduxProvider from "./ReduxProvider";

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  return <ReduxProvider>{children}</ReduxProvider>;
};

export default AppProvider;