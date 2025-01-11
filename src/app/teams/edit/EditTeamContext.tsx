"use client";

import { PlainTeam } from "@/entity/team.entity";
import { createContext, useContext, useState } from "react";

interface EditTeamContextType {
  teams: PlainTeam[][];
  setTeams: (fn: (old: PlainTeam[][]) => PlainTeam[][]) => void;
  scoreMap: { [k: string]: number };
  groupedTeam: PlainTeam[][];
  notGroupedTeam: PlainTeam[];
}

const EditTeamContext = createContext<EditTeamContextType | undefined>(
  undefined
);

export const EditTeamProvider: React.FC<
  React.PropsWithChildren & {
    initTeams: PlainTeam[][];
    scoreMap: { [k: string]: number };
  }
> = ({ children, initTeams, scoreMap }) => {
  const [teams, setTeams] = useState(initTeams);
  const groupedTeam = teams.slice(1);
  const notGroupedTeam = teams[0];
  return (
    <EditTeamContext.Provider
      value={{ setTeams, teams, scoreMap, groupedTeam, notGroupedTeam }}
    >
      {children}
    </EditTeamContext.Provider>
  );
};

export const useEditTeamContext = () => {
  const context = useContext(EditTeamContext);
  if (!context) {
    throw new Error("useEditTeamContext must be used within EditTeamProvider");
  }
  return context;
};
