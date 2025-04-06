"use client";

import { useEditTeamContext } from "@/app/teams/edit/EditTeamContext";
import PrimaryButton from "@/app/ui/share/PrimaryButton";
import { DragDropContext, OnDragEndResponder } from "@hello-pangea/dnd";
import _ from "lodash";
import { FaPlusCircle } from "react-icons/fa";
import { FaShuffle } from "react-icons/fa6";
import { DroppableNotJoinTeam } from "./DroppableNotJoinTeam";
import { DroppableTeam } from "./DroppableTeam";

export const EditTeam: React.FC<{}> = () => {
  const { teams, setTeams } = useEditTeamContext();

  const onDragEnd: OnDragEndResponder<string> = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceDI = Number(source.droppableId);
    const desDI = Number(destination.droppableId);

    const select = teams[sourceDI][source.index];

    // source 제거
    _.remove(teams[sourceDI], (_, i) => i === source.index);

    // destination 추가
    teams[desDI].splice(destination.index, 0, select);

    setTeams(() => teams);
  };

  const handleClickRandomizeTeam = () => {
    if (teams.length <= 1) return;
    const stack = _.shuffle(_.flatten(teams));
    const newTeams = _.range(teams.length).map(() => []) as typeof teams;

    stack.forEach((item, index) => {
      const teamIdx = (index % (teams.length - 1)) + 1; // 팀 1번부터 시작
      newTeams[teamIdx].push(item);
    });

    setTeams(() => newTeams);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <PrimaryButton
        onClick={handleClickRandomizeTeam}
        className="flex w-full gap-2"
      >
        <FaShuffle className="text-lg" /> 무작위 팀 섞기
      </PrimaryButton>

      {/* Teams */}
      <Teams />

      {/* 대기열 */}
      <DroppableNotJoinTeam />
    </DragDropContext>
  );
};

const Teams = () => {
  const { groupedTeam, setTeams } = useEditTeamContext();

  const addTeam = () => {
    setTeams((teams) => [...teams, []]);
  };

  return (
    <div className="flex flex-col gap-4">
      {groupedTeam.map((teams, idx) => (
        <DroppableTeam key={idx + 1} teams={teams} group={idx + 1} />
      ))}
      <AddTeamButton addTeam={addTeam} />
    </div>
  );
};

const AddTeamButton = ({ addTeam }: { addTeam: () => void }) => {
  return (
    <PrimaryButton onClick={addTeam} className="flex w-full gap-2 font-bold">
      <FaPlusCircle className="text-lg" /> 팀추가
    </PrimaryButton>
  );
};
