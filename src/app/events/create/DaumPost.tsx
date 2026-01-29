"use client";

import { useEventCreateContext } from "@/app/events/create/EventCreateContext";
import PrimaryButton from "@/app/ui/share/PrimaryButton";
import type { GeoPoint } from "@/entity/transformer/point.transformer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/share/ui/tooltip";
import { NextPage } from "next";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { TbMapSearch } from "react-icons/tb";

interface Props {
  buttonText: string;
  className?: string;
}

const DaumPost: NextPage<Props> = ({ buttonText, className }) => {
  const open = useDaumPostcodePopup();
  const { setAddressPoint } = useEventCreateContext();

  const handleComplete = async (data: AddressInterface) => {
    const { address, fullAddress } = await getAddress(data);
    const geoCode = await getGeoCode(address);
    setAddressPoint(fullAddress, geoCode);
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <PrimaryButton
            className={`mt-2 w-full ${className}`}
            onClick={handleClick}
          >
            <TbMapSearch className="mr-2 text-xl" />
            {buttonText}
          </PrimaryButton>
        </TooltipTrigger>
        <TooltipContent>주소 검색으로 일정장소 입력하기</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface AddressInterface {
  address: string;
  addressType: "R" | "J";
  bname: string;
  buildingName: string;
}

const getAddress = async (data: AddressInterface) => {
  const address = data.address;
  let fullAddress = data.address;
  let extraAddress = "";

  if (data.addressType === "R") {
    if (data.bname !== "") {
      extraAddress += data.bname;
    }
    if (data.buildingName !== "") {
      extraAddress +=
        extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
    }

    fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
  }

  return { address, fullAddress };
};

const getGeoCode = async (address: string): Promise<GeoPoint> => {
  const query = new URLSearchParams({
    query: address,
    page: "1",
    size: "1",
  }).toString();
  const response = await fetch(
    `https://dapi.kakao.com/v2/local/search/address.json?${query}`,
    {
      headers: {
        Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_REST_API_KEY!}`,
      },
    },
  );

  const body = (await response.json()) as {
    documents: {
      x: string;
      y: string;
    }[];
  };

  const { documents } = body;

  const { x, y } = documents[0];

  return {
    lat: Number(y),
    lng: Number(x),
  };
};

export default DaumPost;
