import { ConditionalValue } from "@chakra-ui/react"
import { CalendarDate } from "@internationalized/date"
import { ReactNode } from "react"
import { DateValue } from "react-aria"
import { CalendarState } from "react-stately"

export type CalendarView = "weeks" | "months"

export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export interface ICalendarProps<T, K> {
  hoursToShow?: [IntRange<0, 24>, IntRange<1, 25>]
  initialState?: {view: CalendarView, dateRef: DateValue}
  canChangeView?: boolean
  showActionBar?: boolean
  colorPalette?: ConditionalValue<"border" | "bg" | "current" | "transparent" | "black" | "white" | "whiteAlpha" | "blackAlpha" | "gray" | "red" | "orange" | "yellow" | "green" | "teal" | "blue" | "cyan" | "purple" | "pink" | "fg">
  events: T[]
  groupProperties: {date: K, time: K}
  maxEventsToShow?: IntRange<2, 99>
  renderInCell?: (date: DateValue, toShow: T[], excluded : T[]) => ReactNode
  renderInWeek?: (date: DateValue, toShow: T[]) => ReactNode
  onDayClick?: (clickedDay: DateValue, minute?: number) => void
  onRangeChange?: (start: DateValue, end: DateValue) => void
}

export interface ICalendarGrid<T> {
  state: CalendarState
  events: {[key: string]: T[]}
  maxEventsToShow: number
  renderInCell: (date: DateValue, toShow: T[], excluded: T[]) => ReactNode
  renderInWeek: (date: DateValue, toShow: T[]) => ReactNode
  onDayClick: (clickedDay: DateValue, minute?: number) => void
  view: CalendarView
  startHour: number
  totalHours: number
}

export interface ICalendarCell {
  state: CalendarState
  date: CalendarDate
  currentMonth?: CalendarDate
  onDateClick: (date: DateValue, minute?: number) => void
  weekDayIndex: number
  startHour?: number
  totalHours?: number
  children?: ReactNode
}
