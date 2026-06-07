import { createContext, useContext, useState, type ReactNode } from "react";

interface CursorContextType {
  isHoveringProject: boolean;
  isHoveringButton: boolean;
  setIsHoveringProject: (v: boolean) => void;
  setIsHoveringButton: (v: boolean) => void;
}

const CursorContext = createContext<CursorContextType>({
  isHoveringProject: false,
  isHoveringButton: false,
  setIsHoveringProject: () => {},
  setIsHoveringButton: () => {},
});

export function CursorProvider({ children }: { children: ReactNode }) {
  const [isHoveringProject, setIsHoveringProject] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  return (
    <CursorContext.Provider
      value={{
        isHoveringProject,
        isHoveringButton,
        setIsHoveringProject,
        setIsHoveringButton,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  return useContext(CursorContext);
}
