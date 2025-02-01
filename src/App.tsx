import { Badge, Box, Button, Text, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import Calendar from './components/ui/calendar'
import { DialogContent, DialogRoot, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogBody, DialogCloseTrigger, DialogActionTrigger } from './components/ui/dialog';

function App() {
	const [dateRef, setDateRef] = useState<string>('2025-03-01');
	const [timeRef, setTimeRef] = useState<number>();
  const [events, setEvents] = useState<Event[]>(initialEvents)

  const [dialogOpen, setDialogOpen] = useState<boolean>();
  const [selectedEvent, setSelectedEvent] = useState<Event>();

  const addEvent = () => {
    setEvents(old => [...old, {id: 7, description: "seventhEvent", date: "2025-03-09", start_time: 720, end_time: 780}])
  }

  return (
    <Box p={4}>
      <Calendar 
        hoursToShow={[7, 24]}
        colorPalette={'green'}
        maxEventsToShow={2}
        initialState={{view: 'month', dateRef}}
        events={events}
        groupProperties={{ date: "date", time: "start_time" }}
        onDayClick={(day, time) => {
          setDialogOpen(true)
          setDateRef(day)
          setTimeRef(time)
        }}
        onEventClick={(item) => {
          setDialogOpen(true)
          setSelectedEvent(item)
        }}
        renderInMonth={(item) => (
          <Badge
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
        )}
        renderInMonthFallback={(excluded) => (
          <Badge variant='solid' size={'xs'}>+ {excluded.length} events</Badge>
        )}
        getEventDuration={({start_time, end_time}) => end_time-start_time}
        renderInWeek={(lex) => (
          <Text
            w='full'
            display={'inline-block'}
            fontSize={['xx-small', 'xs']}
            textOverflow={'ellipsis'} 
            whiteSpace={'nowrap'} 
            overflow={'hidden'}
          >{lex.description}</Text>
        )}
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

const initialEvents: Event[] = [
  {id: 1, description: 'firstEvent', date: '2025-03-01', start_time: 600, end_time: 660},
  {id: 2, description: 'secondEvent', date: '2025-03-01', start_time: 660, end_time: 720},
  {id: 3, description: 'thirdEvent', date: '2025-03-03', start_time: 600, end_time: 690},
  {id: 4, description: 'fourthEvent', date: '2025-03-06', start_time: 840, end_time: 900},
  {id: 5, description: 'fifthEvent', date: '2025-03-07', start_time: 1020, end_time: 1080},
  {id: 6, description: 'sixthEvent', date: '2025-03-08', start_time: 1080, end_time: 1140},
]

export default App
