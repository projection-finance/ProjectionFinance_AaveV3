import { createContext, useState, useEffect, useContext } from "react";

const PositionsContext = createContext();

const PositionsProvider = ({ children }) => {
  const [positions, setPositions] = useState(() => {
    // Récupère les positions depuis localStorage ou utilise un tableau vide s'il n'y a pas de données
    const storedPositions = typeof window !== "undefined" && localStorage.getItem("positions");
    return storedPositions ? JSON.parse(storedPositions) : [];
  });

  useEffect(() => {
    // Stocke les positions dans localStorage lorsqu'elles sont mises à jour
    if (typeof window !== "undefined") {
      localStorage.setItem("positions", JSON.stringify(positions));
    }
  }, [positions]);

  const exposed = { positions, setPositions };

  return <PositionsContext.Provider value={exposed}>{children}</PositionsContext.Provider>;
};

export const usePositions = () => useContext(PositionsContext);
export const useSetPositions = () => useContext(PositionsContext);

export default PositionsProvider;