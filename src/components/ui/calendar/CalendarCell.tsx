import { forwardRef, useRef } from "react";
import { useCalendarCell } from "react-aria";
import { isSameMonth } from "@internationalized/date";
import { Box, Button, GridItem, VStack } from "@chakra-ui/react";
import { ICalendarCell } from "./types";

const CalendarCell = forwardRef<HTMLDivElement, ICalendarCell>(({ state, date, currentMonth, onDateClick, children }, cellRef) => {
  let ref = useRef<HTMLButtonElement | null>(null);
  let {
    cellProps,
    buttonProps,
    isSelected,
    isInvalid,
    formattedDate
  } = useCalendarCell({ date }, state, ref);

  let isOutsideMonth = currentMonth ? !isSameMonth(currentMonth, date) : true;

  return (
    <GridItem 
      {...cellProps} 
      h='full' w='full' bg={isOutsideMonth ? 'gray.200' : 'bg'}
      aspectRatio={[0.65, 3/4, 1, 4/3]}
      boxShadow={"0 0 0 .2px var(--chakra-colors-gray-solid)"} 
      margin={"0 0 .2px .2px"}
      ref={cellRef}
    >
      <VStack w='full' h='full' gap={0.5}>
        <Box w='full' p={0.5} display='flex' justifyContent='center'>
          <Button
            {...buttonProps}
            ref={ref}
            minH='15px' minW='15px' h='unset' w={['15%', '20%']} aspectRatio={1}
            p={0}
            fontSize={['10px', '2xs', 'xs']}
            hidden={isOutsideMonth}
            colorScheme={isInvalid ? "red" : "blue"}
            variant={isSelected ? "solid" : "ghost"}
            colorPalette={'gray'}
            onClick={() => onDateClick(date)}
            onTouchStart={() => onDateClick(date)}
          >
            {formattedDate}
          </Button>
        </Box>
        <Box w='full' flexGrow={1}>
          {!isOutsideMonth && children}
        </Box>
      </VStack>
    </GridItem>
  );
});

export default CalendarCell;
