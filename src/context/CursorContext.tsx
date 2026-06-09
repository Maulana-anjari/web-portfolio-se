import { createContext, useContext, useState, type ReactNode } from "react";

interface CursorContextType {
  isHoveringProject: boolean;
  isHoveringButton: boolean;
  accentColor: "neon-mint" | "amber";
  setIsHoveringProject: (v: boolean) => void;
  setIsHoveringButton: (v: boolean) => void;
  setAccentColor: (v: "neon-mint" | "amber") => void;
}

const CursorContext = createContext<CursorContextType>({
  isHoveringProject: false,
  isHoveringButton: false,
  accentColor: "neon-mint",
  setIsHoveringProject: () => {},
  setIsHoveringButton: () => {},
  setAccentColor: () => {},
});

export function CursorProvider({ children }: { children: ReactNode }) {
  const [isHoveringProject, setIsHoveringProject] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [accentColor, setAccentColor] = useState<"neon-mint" | "amber">("neon-mint");

  return (
    <CursorContext.Provider
      value={{
        isHoveringProject,
        isHoveringButton,
        accentColor,
        setIsHoveringProject,
        setIsHoveringButton,
        setAccentColor,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  return useContext(CursorContext);
}
