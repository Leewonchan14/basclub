"use client";

import { GeoPoint } from "@/entity/transformer/point.transformer";
import { NextPage } from "next";
import { Map, MapMarker } from "react-kakao-maps-sdk";

interface Props {
  address?: string;
  point: GeoPoint;
}

const DisplayMap: NextPage<Props> = ({ address, point }) => {
  if (!address) return null;

  // 지도 보기
  const handleClickFindMap = () => {
    const addressParam = new URLSearchParams({ address })
      .toString()
      .split("=")[1];

    const url = `https://map.kakao.com/link/map/${addressParam},${point.lat},${point.lng}`;

    window.open(url);
  };

  // 길찾기
  const handleClickFindLoad = () => {
    const addressParam = new URLSearchParams({ address })
      .toString()
      .split("=")[1];

    const url = `https://map.kakao.com/link/to/${addressParam},${point.lat},${point.lng}`;

    window.open(url);
  };

  // 로드뷰
  const handleClickFindRoadView = () => {
    const url = `https://map.kakao.com/link/roadview/${point.lat},${point.lng}`;

    window.open(url);
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="w-full overflow-clip rounded-lg border-2 border-orange-500">
        <Map center={{ ...point }} style={{ height: "350px", width: "350px" }}>
          <MapMarker position={{ ...point }} />
        </Map>
      </div>
      <div className="flex justify-center gap-4">
        <button
          className="rounded-lg border-[1px] border-gray-300 p-2 font-bold"
          onClick={handleClickFindMap}
        >
          지도 보기
        </button>
        <button
          className="rounded-lg border-[1px] border-gray-300 p-2 font-bold"
          onClick={handleClickFindLoad}
        >
          길찾기
        </button>
        <button
          className="rounded-lg border-[1px] border-gray-300 p-2 font-bold"
          onClick={handleClickFindRoadView}
        >
          로드뷰
        </button>
      </div>
    </div>
  );
};

export default DisplayMap;
