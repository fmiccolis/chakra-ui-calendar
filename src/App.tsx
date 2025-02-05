import { Badge, Box, Button, For, GridItem, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import Calendar from './components/ui/calendar/Calendar'
import { DialogContent, DialogRoot, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogBody, DialogCloseTrigger, DialogActionTrigger } from './components/ui/dialog';
import { parseDate } from "@internationalized/date";

const ONE_HOUR = 60;

function App() {
	const [dateRef, setDateRef] = useState<string>('2025-03-01');
	const [timeRef, setTimeRef] = useState<number>();
  const [events, setEvents] = useState<Event[]>(initialEvents)

  const [dialogOpen, setDialogOpen] = useState<boolean>();
  const [selectedEvent, setSelectedEvent] = useState<Event>();

  const addEvent = () => {
    setEvents(old => [...old, {id: 7, description: "seventhEvent", date: "2025-03-09", start_time: 720, end_time: 780}])
  }

  const hoursToShow = [7, 24]

  return (
    <Box p={4}>
      <Calendar 
        locale='it'
        hoursToShow={[7, 24]}
        colorPalette={'green'}
        maxEventsToShow={3}
        events={events}
        groupProperties={{ date: "date", time: "start_time" }}
        onDayClick={(day, time) => {
          setDialogOpen(true)
          setDateRef(day.toString())
          setTimeRef(time)
        }}
        onRangeChange={(start, end) => console.log({start: start.toString(), end: end.toString()})}
        renderInCell={(_date, toShow, excluded) => {
          if(toShow.length === 0) return

          return (
          <SimpleGrid gap={1} w='full' h='full' p={1} alignItems={'end'}>
            <For each={toShow}>
              {(item) => (
                <GridItem display={'flex'}>
                  <Badge
                    key={item.id}
                    display={'inline-block'}
                    maxW={'90%'}
                    variant='solid'
                    size='xs'
                    textOverflow={'ellipsis'} 
                    whiteSpace={'nowrap'} 
                    overflow={'hidden'}
                    onClick={() => {
                      setDialogOpen(true)
                      setSelectedEvent(item)
                    }}
                  >
                    {item.description}
                  </Badge>
                </GridItem>
              )}
            </For>
            {excluded && excluded.length > 0 && (
              <GridItem display={'flex'}>
                <Badge
                  display={'inline-block'}
                  maxW='90%'
                  variant='solid'
                  size='xs'
                  textOverflow={'ellipsis'} 
                  whiteSpace={'nowrap'} 
                  overflow={'hidden'}
                >
                  + {excluded.length} events
                </Badge>
              </GridItem>
            )}
          </SimpleGrid>
        )}}
        renderInWeek={(_, events = []) => events.map(item => {

          const [startHour, endHour] = hoursToShow
          const totalHours = endHour - startHour;
          const totalMinutes = totalHours * ONE_HOUR;
          const proportioner = 100 / totalMinutes;
          const minuteStart = item.start_time
          
          const fromTop = (minuteStart - startHour * ONE_HOUR) * proportioner + "%";
          const height = (item.end_time - minuteStart) * proportioner + "%";

          return (
            <VStack
              position={'absolute'}
              top={fromTop} left={0}
              h={height} w={['100%', '95%']}
              bg={'green.emphasized'}
              borderColor={'green.solid'}
              borderWidth={'1px'}
              borderRadius={'md'}
              p={1} gap={0}
              justify={'space-between'}
              onClick={() => {
                setDialogOpen(true)
                setSelectedEvent(item)
              }}
            >
              <Text
                w='full'
                display={'inline-block'}
                fontSize={['xx-small', 'xs']}
                textOverflow={'ellipsis'} 
                whiteSpace={'nowrap'} 
                overflow={'hidden'}
              >{item.description}</Text>
            </VStack>
          )
        })}
      />
      <DialogRoot
        open={dialogOpen}
        onOpenChange={({open}) => {
          setDialogOpen(open)
          setSelectedEvent(undefined)
          setTimeRef(undefined)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              You've clicked on a date
            </DialogTitle>
            <DialogDescription>
              Below the information on what you have clicked
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <Box>
              <Text>Date: {dateRef}</Text>
              <Text>Time: {timeRef}</Text>
            </Box>
            {!!selectedEvent && (
              <VStack gap={8} alignItems={'flex-start'}>
                <Text>id: {selectedEvent.id}</Text>
                <Text>description: {selectedEvent.description}</Text>
                <Text>start_time: {selectedEvent.start_time}</Text>
                <Text>end_time: {selectedEvent.end_time}</Text>
              </VStack>
            )}
          </DialogBody>
          <DialogCloseTrigger />
          <DialogFooter>
            <DialogActionTrigger>
              <Button variant={'outline'}>Cancel</Button>
            </DialogActionTrigger>
            <Button onClick={addEvent}>Add Fake Event</Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </Box>
  )
}

type Event = {
  id: number,
  description: string,
  date: string,
  start_time: number,
  end_time: number
}

const initialEvents: Event[] = [...new Array(20).keys()].map((eventId) => ({
  id: eventId,
  description: "Event n°" + eventId,
  date: parseDate("2025-03-01").add({days: Math.max(eventId, 5)}).copy().toString(),
  start_time: 600 + Math.floor(Math.random() * 100),
  end_time: 720 + Math.floor(Math.random() * 100)
}))

export default App
