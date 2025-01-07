"use client";

import { GeoPoint } from "@/entity/transformer/point.transformer";
import { NextPage } from "next";

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
    <div className="flex gap-4">
      <button
        className="p-1 font-bold text-white bg-blue-600 rounded-lg"
        onClick={handleClickFindMap}
      >
        지도 보기
      </button>
      <button
        className="p-1 font-bold text-white bg-blue-600 rounded-lg"
        onClick={handleClickFindLoad}
      >
        길찾기
      </button>
      <button
        className="p-1 font-bold text-white bg-blue-600 rounded-lg"
        onClick={handleClickFindRoadView}
      >
        로드뷰
      </button>
    </div>
  );
};

export default DisplayMap;
