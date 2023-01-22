import { Box, Text } from "@chakra-ui/react";
import { attendanceMap } from "../constants/index";

type Props = {
    day: string
    daydata: {
        start_time: any;
        end_time?: any;
    }[] | undefined
}

const DayRecords = ({day, daydata}: Props) => {
    return (
        <Box w="100%" p={2}>
        <Text fontSize="xl">{`${day}`}</Text>
        {daydata?.map(
          (data, i) => {
            console.log(Object.keys(data)[0])
            console.log(attendanceMap.get(Object.keys(data)[0]))
            if(data.start_time.match(day)){

              return(
                <Box key={i}>
                  <Text>{attendanceMap.get(Object.keys(data)[0])} : {`${data.start_time}`}</Text>
                  <Text>{attendanceMap.get(Object.keys(data)[1])} : {`${data.end_time ?? ""}`}</Text>
                </Box>
              )
            }
          }
        )}
        </Box>
    )
}

export default DayRecords