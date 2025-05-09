import { AriaCalendarGridProps, useCalendarGrid } from "react-aria";
import { endOfMonth } from "@internationalized/date";
import CalendarCell from "./CalendarCell";
import { Box, Text, GridItem, SimpleGrid } from "@chakra-ui/react";
import { ICalendarGrid } from "./types";
import WeekCell from "./WeekCell";
import { useRef } from "react";

const CalendarGrid = <T,>({ state, events, renderInCell, renderInWeek, onDayClick, view, startHour, totalHours }: ICalendarGrid<T>) => {
  let cellRefs = useRef<HTMLDivElement[]>([]);
  let startDate = state.visibleRange.start.copy()
  let endDate = endOfMonth(startDate);
  let props: AriaCalendarGridProps = view === 'weeks' ? {} : { 
    startDate, 
    endDate
  }
  let { gridProps, headerProps, weekDays } = useCalendarGrid({...props, weekdayStyle: 'short'}, state);

  return (
    <Box {...gridProps}>
      <SimpleGrid {...headerProps} columns={7}>
        {weekDays.map((day, index) => (
          <GridItem key={index} textAlign={'center'} textTransform={'uppercase'} fontWeight={'bold'}>
            <Text fontSize={['2xs', 'xs', 'xs', 'sm']}>{day}</Text>
          </GridItem>
        ))}
      </SimpleGrid>
      <SimpleGrid columns={1}>
        {[...new Array(view === 'weeks' ? 1 : 6).keys()].map((weekIndex) => (
          <SimpleGrid key={weekIndex} columns={7} autoRows={"1fr"}>
            {state
              .getDatesInWeek(weekIndex, view === 'weeks' ? undefined : startDate)
              .map((date, i) => {
                if(!date) return <GridItem key={i} />

                const dateString = date.toString()
                const thisDayEvents = events[dateString];

                if(view === 'weeks') {
                  return (
                    <WeekCell 
                      key={i}
                      state={state} 
                      date={date} 
                      weekDayIndex={i}
                      onDateClick={onDayClick} 
                      startHour={startHour}
                      totalHours={totalHours}
                    >
                      {renderInWeek(date, thisDayEvents)}
                    </WeekCell>
                  )
                }

                return (
                  <CalendarCell
                    ref={cellRef => {
                      if(cellRef)
                      cellRefs.current[i] = cellRef
                    }}
                    key={i}
                    state={state}
                    date={date}
                    weekDayIndex={i}
                    currentMonth={startDate}
                    onDateClick={onDayClick}
                  >
                    {renderInCell(date, cellRefs.current[i], thisDayEvents)}
                  </CalendarCell>
                )
              }
            )}
          </SimpleGrid>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default CalendarGrid;
