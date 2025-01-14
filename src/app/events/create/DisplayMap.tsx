"use client";

import { GeoPoint } from "@/entity/transformer/point.transformer";
import { NextPage } from "next";

interface Props {
  detailAddress: string;
  point: GeoPoint;
}

const DisplayMap: NextPage<Props> = ({ detailAddress, point }) => {
  const addressParam =
    new URLSearchParams({ address: detailAddress }).toString().split("=")[1] ||
    "상세 주소";

  if (!addressParam) return null;

  // 지도 보기
  const handleClickFindMap = () => {
    const url = `https://map.kakao.com/link/map/${addressParam},${point.lat},${point.lng}`;

    window.open(url);
  };

  // 길찾기
  const handleClickFindLoad = () => {
    const url = `https://map.kakao.com/link/to/${addressParam},${point.lat},${point.lng}`;

    window.open(url);
  };

  // 로드뷰
  const handleClickFindRoadView = () => {
    const url = `https://map.kakao.com/link/roadview/${point.lat},${point.lng}`;

    window.open(url);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* <Map center={{ ...point }} className="w-full h-52 md:h-96">
        <MapMarker position={{ ...point }} />
      </Map> */}
      <div className="flex gap-4">
        <button
          className="p-2 font-bold text-white bg-blue-600 rounded-lg"
          onClick={handleClickFindMap}
        >
          지도 보기
        </button>
        <button
          className="p-2 font-bold text-white bg-blue-600 rounded-lg"
          onClick={handleClickFindLoad}
        >
          길찾기
        </button>
        <button
          className="p-2 font-bold text-white bg-blue-600 rounded-lg"
          onClick={handleClickFindRoadView}
        >
          로드뷰
        </button>
      </div>
    </div>
  );
};

export default DisplayMap;
