"use client";

import { useEditTeamContext } from "@/app/teams/edit/EditTeamContext";
import PrimaryButton from "@/app/ui/share/PrimaryButton";
import { DragDropContext, OnDragEndResponder } from "@hello-pangea/dnd";
import _ from "lodash";
import { FaPlusCircle } from "react-icons/fa";
import { FaShuffle } from "react-icons/fa6";
import { DroppableNotJoinTeam } from "./DroppableNotJoinTeam";
import { DroppableTeam } from "./DroppableTeam";
import { produce } from "immer";
import { EPosition } from "@/entity/enum/position";

export const EditTeam: React.FC<{}> = () => {
  const { teams, setTeams } = useEditTeamContext();

  const onDragEnd: OnDragEndResponder<string> = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    setTeams(
      produce((teams) => {
        const sourceDI = Number(source.droppableId);
        const desDI = Number(destination.droppableId);

        const select = teams[sourceDI][source.index];

        teams[sourceDI].splice(source.index, 1);
        teams[desDI].splice(destination.index, 0, select);
      }),
    );
  };

  const handleClickRandomizeTeam = () => {
    if (teams.length <= 1) return;

    setTeams((teams) => {
      const newTeams = teams.map((team) => team.filter((t) => t.isPinned));
      const notPinnedMembers = _.flatten(teams).filter((t) => !t.isPinned);

      let membersByPosition: Record<string, (typeof teams)[number]> = {
        // 1st
        [EPosition.CENTER]: [],
        // 2nd
        [EPosition.GUARD]: [],
        // 3rd
        [EPosition.FORWARD]: [],
        OTHER: [],
      };

      notPinnedMembers.forEach((t) => {
        if (t.member.positions.length === 0) {
          membersByPosition["OTHER"].push(t);
          return;
        }
        t.member.positions.forEach((p) => {
          membersByPosition[p].push(t);
        });
      });

      Object.keys(membersByPosition).forEach((key) => {
        while (membersByPosition[key].length) {
          const team = membersByPosition[key][0];

          console.log(team.member.nickname);

          const countGroup = newTeams
            // [pos count,mem count, group]
            .map((t, idx) => [
              t.filter((_t) => _t.member.positions.includes(key as EPosition))
                .length,
              t.length,
              idx,
            ]);

          console.log(countGroup);

          const group = _.sortBy(
            countGroup.slice(1),
            (t) => t[0] * 10000 + t[1] * 100 + t[2],
          )[0][2];

          // push team to teams
          newTeams[group].push(team);
          // remove team from membersByPosition
          membersByPosition = Object.fromEntries(
            Object.entries(membersByPosition).map(([pos, teams]) => [
              pos,
              teams.filter((t) => t.member.id !== team.member.id),
            ]),
          );

          console.log(newTeams.map((t) => t.length));
        }
      });

      return newTeams;
    });
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
