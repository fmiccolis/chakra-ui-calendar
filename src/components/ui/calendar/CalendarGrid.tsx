import { AriaCalendarGridProps, useCalendarGrid, useLocale } from "react-aria";
import { getWeeksInMonth, endOfMonth } from "@internationalized/date";
import CalendarCell from "./CalendarCell";
import { Box, GridItem, SimpleGrid } from "@chakra-ui/react";
import { ICalendarGrid } from "./types";
import WeekCell from "./WeekCell";

const CalendarGrid = <T,>({ state, events, maxEventsToShow, renderInCell, renderInWeek, onDayClick, view, startHour, totalHours }: ICalendarGrid<T>) => {
  let { locale } = useLocale();
  let startDate = state.visibleRange.start.copy()
  let endDate = endOfMonth(startDate);
  let props: AriaCalendarGridProps = view === 'weeks' ? {} : { 
    startDate, 
    endDate
  }
  let { gridProps, headerProps, weekDays } = useCalendarGrid({...props, weekdayStyle: 'short'}, state);

  // Get the number of weeks in the month so we can render the proper number of rows.
  let weeksInMonth = view === 'weeks' ? 1 : getWeeksInMonth(state.visibleRange.start, locale);

  return (
    <Box {...gridProps}>
      <SimpleGrid {...headerProps} columns={7}>
        {weekDays.map((day, index) => (
          <GridItem key={index} textAlign={'center'} textTransform={'uppercase'} fontWeight={'bold'}>
            {day}
          </GridItem>
        ))}
      </SimpleGrid>
      <SimpleGrid columns={1}>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <SimpleGrid key={weekIndex} columns={7} autoRows={"1fr"}>
            {state
              .getDatesInWeek(weekIndex, view === 'weeks' ? undefined : startDate)
              .map((date, i) => {
                if(!date) return <GridItem key={i} />

                const dateString = date.toString()
                const thisDayEvents = events[dateString];
                let toShow: T[] = [];
                let excluded: T[] = [];
                if(thisDayEvents) {
                  toShow = [...thisDayEvents]
                  const totalEvents = toShow.length;
                  if(totalEvents > maxEventsToShow) {
                    const toRemove = totalEvents - maxEventsToShow + 1;
                    excluded = toShow.splice(-toRemove, toRemove)
                  }
                }

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
                    key={i}
                    state={state}
                    date={date}
                    weekDayIndex={i}
                    currentMonth={startDate}
                    onDateClick={onDayClick}
                  >
                    {renderInCell(date, toShow, excluded)}
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
