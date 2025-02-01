import { createListCollection, Box, Group, SimpleGrid, GridItem, HStack, VStack, Button, IconButton, Text, Avatar, ConditionalValue, For, Show } from "@chakra-ui/react";
import moment from "moment";
import { ReactNode, useEffect, useState } from "react";
import { SelectRoot, SelectContent, SelectTrigger, SelectItem, SelectValueText } from "./select";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const ONE_HOUR = 60;
const TOPBAR_BUTTON_SIZES: ConditionalValue<"sm" | "md" | "lg" | "xl" | "2xl" | "2xs" | "xs" | undefined> = ['xs', 'sm', 'sm', 'md'];
const DATE_FORMATS = {
  COMP: "YYYY-MM-DD",
  DISPLAY: "MMMM YYYY"
}
const weekDays = moment.weekdaysShort(true)

const convert = (n?: number): string => !!n ? `0${n / 60 ^ 0}`.slice(-2) + ':' + ('0' + n % 60).slice(-2) : "08:00"

const groupBy = <T extends Record<K, {}>, K extends keyof T>(
  objArr: readonly T[],
  property: K,
) => objArr.reduce((memo, x) => {
  if (x[property]) {
    const value = (x[property]).toString();
    if (!memo[value]) {
      memo[value] = [];
    }
    memo[value].push(x);
  }
  return memo;
}, {} as Record<string, T[]>);

type CalendarView = "week" | "month"

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

interface CalendarProps<T, K> {
  hoursToShow?: [IntRange<0, 24>, IntRange<1, 25>]
  initialState?: {view: CalendarView, dateRef: string}
  canChangeView?: boolean
  showActionBar?: boolean
  colorPalette?: ConditionalValue<"border" | "bg" | "current" | "transparent" | "black" | "white" | "whiteAlpha" | "blackAlpha" | "gray" | "red" | "orange" | "yellow" | "green" | "teal" | "blue" | "cyan" | "purple" | "pink" | "fg">
  events: T[]
  groupProperties: {date: K, time: K}
  getEventDuration: (item: T) => number
  onDayClick?: (clickedDay: string, minute?: number) => void
  onEventClick?: (item: T) => void
  onRangeChange?: (start: string, end: string) => void
  maxEventsToShow?: number
  renderInMonth?: (item: T) => ReactNode
  renderInMonthFallback?: (excluded: T[]) => ReactNode
  renderInWeek?: (item: T) => ReactNode
}

const Calendar = <T extends Record<K, {}>, K extends keyof T>({
  hoursToShow = [0, 24],
  initialState = {view: 'month', dateRef: ''},
  canChangeView = true,
  showActionBar = true,
  colorPalette = 'gray',
  events = [],
  groupProperties,
  getEventDuration = (_item) => 0,
  onDayClick = (_day, _minute) => {}, 
  onEventClick = (_item) => {},
  onRangeChange = (_start, _end) => {}, 
  maxEventsToShow = 3,
  renderInMonth = (_item) => <></>,
  renderInMonthFallback = (_excluded) => <></>,
  renderInWeek = (_item) => <></>
}: CalendarProps<T, K>) => {
  const [chooseView, setChooseView] = useState<CalendarView>(initialState.view);
  const [rangeRef, setRangeRef] = useState<string>(initialState.dateRef);

  const today = moment();
  const firstMonday = moment(rangeRef).startOf(chooseView).startOf('week');
  const lastSunday = moment(rangeRef).endOf(chooseView).endOf('week');

  const eventsByDate = groupBy(events, groupProperties.date)

  const [startHour, endHour] = hoursToShow
  const totalHours = endHour - startHour;
  const totalMinutes = totalHours * ONE_HOUR;
  const proportioner = 100 / totalMinutes;

  const manipulateDay = (direction?: 'forward' | 'backward') => {
    switch(direction) {
      case 'backward': setRangeRef(old => moment(old).subtract(1, chooseView).format(DATE_FORMATS.COMP)); break;
      case 'forward': setRangeRef(old => moment(old).add(1, chooseView).format(DATE_FORMATS.COMP)); break;
      default: setRangeRef(today.format(DATE_FORMATS.COMP)); break;
    }
  }

  const cellClick = (clickedDay: string, minute?: number) => {
    setRangeRef(clickedDay);
    onDayClick(clickedDay, minute)
  }

  useEffect(() => {
    onRangeChange(firstMonday.format(DATE_FORMATS.COMP), lastSunday.format(DATE_FORMATS.COMP))
  }, [rangeRef, chooseView])

  useEffect(() => {
    setChooseView(initialState.view)
    setRangeRef(initialState.dateRef)
  }, [initialState])
  
  return (
    <VStack w='full' h='full' align={'start'} justify='space-between'>
      <Show when={showActionBar}>
        <HStack w='full' maxH={'40px'} gap={0} justify='space-between'>
          <HStack gap={1}>
            <Button colorPalette={colorPalette} size={TOPBAR_BUTTON_SIZES} onClick={() => manipulateDay()}>
              Today
            </Button>
            <IconButton size={TOPBAR_BUTTON_SIZES} variant='ghost' onClick={() => manipulateDay('backward')}>
              <FaChevronLeft />
            </IconButton>
            <IconButton size={TOPBAR_BUTTON_SIZES}  variant='ghost' onClick={() => manipulateDay('forward')}>
              <FaChevronRight />
            </IconButton>
            <Text fontSize={TOPBAR_BUTTON_SIZES} textTransform='capitalize'>{moment(rangeRef).format(DATE_FORMATS.DISPLAY)}</Text>
          </HStack>
          <Show when={canChangeView}>
            <SelectRoot 
              collection={visualization} 
              maxW={['100px', '150px', '200px']}
              size={["xs", "sm", "md"]} 
              value={[chooseView]}
              onValueChange={({value}) => setChooseView(value[0] as 'week' | 'month')}
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
      {chooseView === 'month' && (
        <VStack w='full' h='full' justify={'space-between'} align={'start'} gap={0}>
          <SimpleGrid w='full' h='full' columns={7} maxH={"20px"}>
            {weekDays.map(weekDay => (
              <GridItem key={weekDay} display='flex' justifyContent='center'>
                <Text fontSize={'xs'} textTransform={'capitalize'}>{weekDay}</Text>
              </GridItem>
            ))}
          </SimpleGrid>
          <SimpleGrid w='full' h='full' columns={7} autoRows={"1fr"}>
            {[...Array(lastSunday.diff(firstMonday, 'd')+1)].map((_val, dayIndex) => {
              const dayToShow = firstMonday.clone().add(dayIndex, 'd');
              const dayKey = dayToShow.format(DATE_FORMATS.COMP)
              const isToday = today.format(DATE_FORMATS.COMP) === dayKey
              const dayNumber = dayToShow.format("D");
              const dayToShowDisplay = dayNumber + (dayNumber === "1" && !isToday ? dayToShow.format(" MMM") : "")
              const thisDayEvents = eventsByDate[dayKey];
              let excluded: T[] = [];
              if(thisDayEvents) {
                const totalEvents = thisDayEvents.length;
                if(totalEvents > maxEventsToShow) {
                  const toRemove = totalEvents - maxEventsToShow + 1;
                  excluded = thisDayEvents.splice(-toRemove, toRemove)
                }
              }

              return (
                <GridItem key={dayKey} 
                  h='full' w='full' bg={'bg'}
                  display={'flex'} flexDirection={'column'} justifyContent={'end'} alignItems={'center'} 
                  boxShadow={"0 0 0 .2px var(--chakra-colors-gray-solid)"} margin={"0 0 .2px .2px"}
                  aspectRatio={4/3}
                  position={'relative'}
                >
                  <Avatar.Root 
                    position={'absolute'} top={0}
                    size={'2xs'} 
                    bg={isToday ? 'blue.solid' : 'inherit'}
                    cursor={'pointer'}
                    _hover={{bg: 'gray.emphasized'}}
                    onClick={() => cellClick(dayKey)}
                  >
                    <Avatar.Fallback>{dayToShowDisplay}</Avatar.Fallback>
                  </Avatar.Root>
                  <SimpleGrid gap={0.5} w='full' columns={1} autoRows={'1fr'} colorPalette={colorPalette}>
                    <For each={eventsByDate[dayKey]}>
                      {(item, index) => <GridItem key={dayKey + index} display={'flex'}>{renderInMonth(item)}</GridItem>}
                    </For>
                    <Show when={excluded.length > 0}>
                      <GridItem display='flex'>{renderInMonthFallback(excluded)}</GridItem>
                    </Show>
                  </SimpleGrid>
                </GridItem>
              )
            })}
          </SimpleGrid>
        </VStack>
      )}
      {chooseView === 'week' && (
        <Box w='full'>
          <SimpleGrid p={1} w='full' h='full' columns={29} maxH={"60px"} position={'sticky'} top={0} zIndex={'docked'} bg={colorPalette + '.emphasized'} boxShadow={"0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0,0,0,0)"}>
            <GridItem />
            {[...Array(lastSunday.diff(firstMonday, 'd')+1)].map((_val, dayIndex) => {
              const dayToShow = firstMonday.clone().add(dayIndex, 'd');
              const dayKey = dayToShow.format(DATE_FORMATS.COMP)
              const weekDay = weekDays[dayIndex]
              const dayDisplay = dayToShow.format("DD")
              const isToday = today.format(DATE_FORMATS.COMP) === dayKey
              return (
                <GridItem key={dayKey} colSpan={4} display='flex' flexDirection={'column'} justifyContent='space-evenly' alignItems={'center'}>
                  <Text fontSize={'xs'} color={isToday ? colorPalette + '.solid' : 'inherit'} textTransform={'uppercase'} fontWeight={'bold'}>{weekDay}</Text>
                  <Avatar.Root size={'2xs'} bg={isToday ? colorPalette + '.solid' : 'inherit'}>
                    <Avatar.Fallback>{dayDisplay}</Avatar.Fallback>
                  </Avatar.Root>
                </GridItem>
              )
            })}
          </SimpleGrid>
          <Box w={'full'} h={'full'} overflow={'hidden'} position={"relative"}>
            <Box w={'full'} h={'full'} overflow={'auto'} scrollbarWidth={'none'}>
              <Box w='full' h={[undefined, undefined, 'lg', 'xl']} position={'relative'}>
                <SimpleGrid columns={29} w={'full'} gap={0}>
                  <GridItem columns={1} gap={0} w='full'>
                    <SimpleGrid columns={1} h='full' autoRows={'1fr'} gap={0}>
                      {[...Array(totalHours)].map((_, index) => {
                        const startTime = (startHour + index) * ONE_HOUR
                        
                        return (
                          <GridItem 
                            key={startTime}
                            aspectRatio={[1.5, 2.5]}
                            position={'relative'}
                          >
                            <Text
                              position={'absolute'} 
                              top={["-8px", "-10px"]} left={0} 
                              color={'gray.solid'} 
                              fontSize={['xx-small', 'xx-small', 'xx-small', 'xs', 'sm']}
                              textOverflow={'clip'} 
                              whiteSpace={'nowrap'} 
                              overflow={'hidden'}
                              smDown={{
                                width: "100%"
                              }}
                            >

                              {index > 0 && convert(startTime)}
                            </Text>
                          </GridItem>
                        )
                      })}
                    </SimpleGrid>
                  </GridItem>
                  {weekDays.map((_val, dayIndex) => {
                    const filterDate = firstMonday.clone().add(dayIndex, 'days')
                    const displayDate = filterDate.format(DATE_FORMATS.COMP);
                    const isToday = today.format(DATE_FORMATS.COMP) === displayDate
                    const thisDayEvents = eventsByDate[displayDate];

                    return (
                      <GridItem colSpan={4}>
                        <Group key={displayDate + dayIndex} attached w='full'>
                          <SimpleGrid columns={1} gap={0} w='full' position={'relative'}>
                            {[...Array(totalHours).fill("ciao")].map((_c, index) => {
                              const startTime = (startHour + index) * ONE_HOUR
                              
                              return (
                                <Box 
                                  key={displayDate + dayIndex + startTime}
                                  borderWidth={"1px"}
                                  aspectRatio={[1.5, 2.5]}
                                  bg={isToday ? 'gray.emphasized' : 'bg'}
                                  onClick={() => cellClick(displayDate, startTime)}
                                />
                              )
                            })}
                            {thisDayEvents && thisDayEvents.map(item => {
                              const minuteStart = item[groupProperties.time] as unknown
                              const duration = getEventDuration(item);
                              if(duration <= 0) return
                              const fromTop = (minuteStart as number - startHour * 60) * proportioner + "%";
                              const height = duration * proportioner + "%";
                              return (
                                <VStack
                                  position={'absolute'}
                                  top={fromTop} left={0}
                                  h={height} w={['100%', '95%']}
                                  bg={colorPalette + '.emphasized'}
                                  borderColor={colorPalette + '.solid'}
                                  borderWidth={'1px'}
                                  borderRadius={'md'}
                                  p={1} gap={0}
                                  justify={'space-between'}
                                  onClick={() => onEventClick(item)}
                                >
                                  {renderInWeek(item)}
                                </VStack>
                              )
                            })}
                            <Show when={isToday}>
                              <Box 
                                position={'absolute'} 
                                top={(ONE_HOUR*(today.hours() - startHour) + today.minutes() + (today.seconds() / ONE_HOUR)) * proportioner + "%"} 
                                bg={colorPalette + '.500'} 
                                w='full' 
                                h={['1px', '2px']} 
                                _before={{ 
                                  content: '""',
                                  width: ["6px", "10px"],
                                  height: ["6px", "10px"],
                                  bgColor: colorPalette + '.500',
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
                    )
                  })}
                </SimpleGrid>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </VStack>
  )
}

const visualization = createListCollection({
  items: [
    { label: "Settimana", value: "week" },
    { label: "Mese",      value: "month" }
  ],
})

export default Calendar;
