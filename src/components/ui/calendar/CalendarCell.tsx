import { useRef } from "react";
import { useCalendarCell } from "react-aria";
import { isSameMonth } from "@internationalized/date";
import { Button, GridItem } from "@chakra-ui/react";
import { ICalendarCell } from "./types";

const CalendarCell = ({ state, date, currentMonth, onDateClick, children }: ICalendarCell) => {
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
      h='full' w='full' bg={'bg'}
      aspectRatio={[0.65, 3/4, 1, 4/3]}
      boxShadow={"0 0 0 .2px var(--chakra-colors-gray-solid)"} 
      margin={"0 0 .2px .2px"}
      position={'relative'}
    >
      <Button
        {...buttonProps}
        position={'absolute'} top={1} right={1}
        ref={ref}
        hidden={isOutsideMonth}
        size={["2xs", "xs"]} p={0}
        colorScheme={isInvalid ? "red" : "blue"}
        variant={isSelected ? "solid" : "ghost"}
        colorPalette={'gray'}
        onClick={() => onDateClick(date)}
        onTouchStart={() => onDateClick(date)}
      >
        {formattedDate}
      </Button>
      {!isOutsideMonth && children}
    </GridItem>
  );
}

export default CalendarCell;
