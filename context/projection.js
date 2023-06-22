import { createContext, useState, useEffect, useContext } from "react";

const ProjectionContext = createContext();

const ProjectionProvider = ({ children }) => {
  const [projection, setProjection] = useState(() => {
    // Récupère la projection depuis localStorage ou utilise null s'il n'y a pas de données
    const storedProjection = typeof window !== "undefined" && localStorage.getItem("projection");
    return storedProjection ? JSON.parse(storedProjection) : null;
  });

  useEffect(() => {
    // Stocke la projection dans localStorage lorsqu'elle est mise à jour
    if (typeof window !== "undefined") {
      localStorage.setItem("projection", JSON.stringify(projection));
    }
  }, [projection]);

  const exposed = { projection, setProjection };

  return <ProjectionContext.Provider value={exposed}>{children}</ProjectionContext.Provider>;
};

export const useProjection = () => useContext(ProjectionContext);
export const useSetProjection = () => useContext(ProjectionContext);

export default ProjectionProvider;
