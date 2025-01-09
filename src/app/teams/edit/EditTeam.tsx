"use client";

import { useEditTeamContext } from "@/app/teams/edit/EditTeamContext";
import { DragDropContext, OnDragEndResponder } from "@hello-pangea/dnd";
import _ from "lodash";
import { DroppableNotJoinTeam } from "./DroppableNotJoinTeam";
import { DroppableTeam } from "./DroppableTeam";

export const EditTeam: React.FC<{}> = () => {
  const { teams, setTeams, scoreMap } = useEditTeamContext();

  const onDragEnd: OnDragEndResponder<string> = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const newTeams = _.cloneDeep(teams);
    const sourceDI = Number(source.droppableId);
    const desDI = Number(destination.droppableId);

    const select = teams[sourceDI][source.index];

    // source 제거
    newTeams[sourceDI] = teams[sourceDI].filter((_, i) => i !== source.index);

    // destination 추가
    newTeams[desDI] = [
      ...newTeams[desDI].slice(0, destination.index),
      select,
      ...newTeams[desDI].slice(destination.index),
    ];

    // score로 정렬
    newTeams[desDI].sort(
      (a, b) => scoreMap[a.member.id] - scoreMap[b.member.id]
    );

    setTeams(() => newTeams);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">팀 빌딩</h1>
        <div className="text-gray-500">
          팀원은 평균 득점에 의해 자동 정렬 됩니다.
        </div>

        {/* Teams */}
        <Teams />

        {/* 대기열 */}
        <DroppableNotJoinTeam />
      </div>
    </DragDropContext>
  );
};

const Teams = () => {
  const { groupedTeam, setTeams } = useEditTeamContext();

  const addTeam = () => {
    setTeams((teams) => [...teams, []]);
  };

  return (
    <div className="flex gap-4">
      {groupedTeam.map((teams, idx) => (
        <DroppableTeam key={idx + 1} teams={teams} group={idx + 1} />
      ))}
      <AddTeamButton addTeam={addTeam} />
    </div>
  );
};

const AddTeamButton = ({ addTeam }: { addTeam: () => void }) => {
  return (
    <button
      onClick={addTeam}
      className="p-2 font-bold text-white bg-orange-500 rounded-lg"
    >
      팀추가
    </button>
  );
};
