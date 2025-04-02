"use client";

import { GeoPoint } from "@/entity/transformer/point.transformer";
import { Button } from "flowbite-react";
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

  const buttons = [
    {
      label: "지도 보기",
      onClick: handleClickFindMap,
    },
    {
      label: "길찾기",
      onClick: handleClickFindLoad,
    },
    {
      label: "로드뷰",
      onClick: handleClickFindRoadView,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* <Map center={{ ...point }} className="w-full h-52 md:h-96">
        <MapMarker position={{ ...point }} />
      </Map> */}
      <div className="flex gap-2 text-sm">
        {buttons.map((button) => (
          <Button
            color="primary"
            key={button.label}
            className="px-3 py-2"
            onClick={button.onClick}
          >
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DisplayMap;
