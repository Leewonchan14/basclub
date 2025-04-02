import { Spinner } from "flowbite-react";
import { NextPage } from "next";

interface Props {}

const Loading: NextPage<Props> = ({}) => {
  return <Spinner color="warning" />;
};

export default Loading;
