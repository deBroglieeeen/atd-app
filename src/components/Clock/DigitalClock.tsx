import dayjs from "dayjs";
import { Text } from "@chakra-ui/react";
import { Time } from "./Time";

const DigitalClock = () => {
  const time = Time(1000);
  return <Text fontSize="3xl">{dayjs(time).format("HH:mm:ss")}</Text>;
};

export { DigitalClock };
