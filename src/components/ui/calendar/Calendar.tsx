import { useEffect, useRef } from "react";
import { useCalendarState } from "react-stately";
import { AriaCalendarProps, I18nProvider, useCalendar, useDateFormatter, useLocale } from "react-aria";
import { CalendarDate, createCalendar, today, getLocalTimeZone } from "@internationalized/date";
import CalendarGrid from "./CalendarGrid";
import { Box, Button, ConditionalValue, createListCollection, HStack, IconButton, Show, Text } from "@chakra-ui/react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from "../select";
import CalendarButton from "./CalendarButton";
import { ICalendarProps } from "./types";
import { groupBy } from "./utils";

const TOPBAR_BUTTON_SIZES: ConditionalValue<"sm" | "md" | "lg" | "xl" | "2xl" | "2xs" | "xs" | undefined> = ['xs', 'sm', 'sm', 'md'];

const Calendar = <T extends Record<K, {}>, K extends keyof T>({
  hoursToShow = [0, 24],
  view = 'months',
  onViewChange = (_nv) => {},
  dateRef = today(getLocalTimeZone()),
  onDateRefChange = (_ndr) => {},
  canChangeView = true,
  showActionBar = true,
  colorPalette = 'gray',
  events = [],
  groupProperties,
  onDayClick = (_day, _minute) => {},
  onRangeChange = (_start, _end) => {},
  renderInCell = (_d, _e, _s) => <></>,
  renderInWeek = (_d, _s) => <></>
}: ICalendarProps<T, K>) => {
  let calendarRef = useRef();
  let { locale } = useLocale();

  const eventsByDate = groupBy(events, groupProperties.date)
  const [startHour, endHour] = hoursToShow
  const totalHours = endHour - startHour;

  const props: AriaCalendarProps<CalendarDate> = { 
    value: dateRef, 
    onChange: onDateRefChange,
    focusedValue: dateRef
  }
  let state = useCalendarState({...props, visibleDuration: { [view]: 1 }, locale, createCalendar });
  let { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(props, state);

  let startDate = state.visibleRange.start;

  let dateFormatter = useDateFormatter({
    dateStyle: "long",
    calendar: startDate.calendar.identifier
  });

  useEffect(() => onRangeChange(state.visibleRange.start, state.visibleRange.end), [state])
  
  return (
    <Box 
      {...calendarProps} 
      ref={calendarRef} 
      w='full' h='full' gap={2}
      display='flex' flexDirection='column' 
      alignItems='start' justifyContent='space-between'
      colorPalette={colorPalette}
    >
      <Show when={showActionBar}>
        <HStack w='full' maxH={'40px'} gap={0} justify='space-between'>
          <HStack gap={1}>
            <Button size={TOPBAR_BUTTON_SIZES} onClick={() => onDateRefChange(today(getLocalTimeZone()))}>
              Oggi
            </Button>
            <CalendarButton {...prevButtonProps} onPress={() => onDateRefChange(dateRef.subtract({[view]: 1}).copy())}>
              <IconButton size={TOPBAR_BUTTON_SIZES} variant='ghost' colorPalette={'gray'}>
                <FaChevronLeft />
              </IconButton>
            </CalendarButton>
            <CalendarButton {...nextButtonProps} onPress={() => onDateRefChange(dateRef.add({[view]: 1}).copy())}>
              <IconButton size={TOPBAR_BUTTON_SIZES} variant='ghost' colorPalette={'gray'}>
                <FaChevronRight />
              </IconButton>
            </CalendarButton>
            <Text fontSize={TOPBAR_BUTTON_SIZES} textTransform='capitalize'>
              {view === 'weeks' ? dateFormatter.formatRange(
                state.visibleRange.start.toDate(state.timeZone),
                state.visibleRange.end.toDate(state.timeZone)
              ) : title}
            </Text>
          </HStack>
          <Show when={canChangeView}>
            <SelectRoot
              collection={visualization}
              maxW={['100px', '150px', '200px']}
              size={["xs", "sm", "md"]}
              value={[view]}
              onValueChange={({value}) => {
                if(value[0] === 'months') setTimeout(() => onDateRefChange(today(getLocalTimeZone())), 50)
                onViewChange(value[0] as 'weeks' | 'months')
              }}
              positioning={{}}
            >
              <SelectTrigger>
                <SelectValueText placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                {visualization.items.map((item) => (
                  <SelectItem item={item} key={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
          </Show>
        </HStack>
      </Show>
      <Box w='full' h='full'>
        <CalendarGrid 
          state={state} 
          events={eventsByDate} 
          renderInCell={renderInCell}
          renderInWeek={renderInWeek}
          onDayClick={onDayClick}
          view={view}
          startHour={startHour}
          totalHours={totalHours}
        />
      </Box>
    </Box>
  );
}

const CalendarWrapper = <T extends Record<K, {}>, K extends keyof T>({locale, ...rest}: ICalendarProps<T, K> & {locale: string}) => {
  return (
    <I18nProvider locale={locale}>
      <Calendar {...rest} />
    </I18nProvider>
  )
}

const visualization = createListCollection({
  items: [
    { label: "Settimana", value: "weeks"  },
    { label: "Mese",      value: "months" }
  ],
})


export default CalendarWrapper;
