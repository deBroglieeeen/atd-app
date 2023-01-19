import { Box, Text } from "@chakra-ui/react";

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
            if(data.start_time.match(day)){
              if(data.end_time === null) {
                data.end_time =  ""
              }
              return(
                <Box key={i}>
                  <Text>{`${data.start_time}`}</Text>
                  <Text>{`${data.end_time}`}</Text>
                </Box>
              )
            }
          }
        )}
        </Box>
    )
}

export default DayRecords