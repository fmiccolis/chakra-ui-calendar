import { GridItem, Button, SimpleGrid, Box, Group, Show, Text } from "@chakra-ui/react";
import { useRef } from "react";
import { mergeProps, useCalendarCell, useDateFormatter, useFocusRing } from "react-aria";
import { ICalendarCell } from "./types";
import { now, getLocalTimeZone } from "@internationalized/date";
import { convert } from "./utils";

const ONE_HOUR = 60;

const WeekCell = ({ state, date, onDateClick, children, weekDayIndex, startHour = 0, totalHours = 24 }: ICalendarCell) => {
  let ref = useRef<HTMLButtonElement | null>(null);
  let { cellProps, buttonProps } = useCalendarCell({date}, state, ref);

  let dateFormatter = useDateFormatter({
    day: "numeric",
    timeZone: state.timeZone,
    calendar: date.calendar.identifier
  });
  const totalMinutes = totalHours * ONE_HOUR;
  const proportioner = 100 / totalMinutes;

  let isSelected = state.isSelected(date);
  let { focusProps } = useFocusRing();
  const todayDate = now(getLocalTimeZone())
  const isToday = todayDate.toAbsoluteString().split('T')[0] === date.toString()

  return (
    <GridItem {...cellProps} display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
      <Button
        ref={ref}
        {...mergeProps(buttonProps, focusProps)}
        variant={isSelected ? "solid" : "ghost"}
        colorPalette={'gray'}
        onClick={() => onDateClick(date)}
        onTouchStart={() => onDateClick(date)}
      >
        {dateFormatter.format(date.toDate(state.timeZone))}
      </Button>
      <Group attached w='full'>
        <SimpleGrid columns={1} gap={0} w='full' position={'relative'}>
          {[...Array(totalHours).fill("ciao")].map((_c, index) => {
            const startTime = (startHour + index) * ONE_HOUR
            
            return (
              <Box 
                key={date.toString() + startTime}
                borderWidth={"1px"}
                aspectRatio={[1.5, 2.5]}
                bg={isToday ? 'gray.emphasized' : 'bg'}
                onClick={() => onDateClick(date, startTime)}
              >
                <Show when={weekDayIndex === 0}>
                  <Text
                    color={'gray.solid'} 
                    fontSize={['xx-small', 'xx-small', 'xx-small', 'xs', 'sm']}
                    textOverflow={'clip'} 
                    whiteSpace={'nowrap'} 
                    overflow={'hidden'}
                    opacity={[0.2, 0.5, 0.7, 1]}
                    smDown={{  width: "100%" }}
                  >
                    {convert(startTime)}
                  </Text>
                </Show>
              </Box>
            )
          })}
          {children}
          <Show when={isToday}>
            <Box 
              position={'absolute'} 
              top={(ONE_HOUR*(todayDate.hour - startHour) + todayDate.minute + (todayDate.second / ONE_HOUR)) * proportioner + "%"} 
              bg={'gray.500'} 
              w='full' 
              h={['1px', '2px']} 
              _before={{ 
                content: '""',
                width: ["6px", "10px"],
                height: ["6px", "10px"],
                bgColor: 'gray.500',
                borderRadius: '50%',
                top: ["-2.5px", "-4px"],
                left: ["-3px", "-5px"],
                position: "absolute"
              }}
            />
          </Show>
        </SimpleGrid>
      </Group>
    </GridItem>
  );
}

export default WeekCell;
