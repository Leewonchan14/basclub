import Spinner from "@/app/ui/share/Spinner";
import { NextPage } from "next";

interface Props {}

const Loading: NextPage<Props> = ({}) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner>
        <Spinner.Spin />
      </Spinner>
    </div>
  );
};

export default Loading;
