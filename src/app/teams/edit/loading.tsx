import Spinner from "@/app/ui/share/Spinner";
import { NextPage } from "next";

interface Props {}

const Loading: NextPage<Props> = ({}) => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner>
        <Spinner.Spin />
      </Spinner>
    </div>
  );
};

export default Loading;
