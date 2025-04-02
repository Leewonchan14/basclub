import { Spinner } from "flowbite-react";
import { NextPage } from "next";

interface Props {}

const Loading: NextPage<Props> = ({}) => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner color="warning" />
    </div>
  );
};

export default Loading;
