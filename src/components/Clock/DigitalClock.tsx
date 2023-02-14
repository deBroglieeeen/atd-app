import dayjs from "dayjs";
import { Text } from "@chakra-ui/react";
import { useTime } from "./useTime";

const DigitalClock = () => {
  const time = useTime(1000);
  return <Text fontSize="3xl">{dayjs(time).format("HH : mm : ss")}</Text>;
};

export { DigitalClock };
