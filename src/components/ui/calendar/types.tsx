import { ConditionalValue } from "@chakra-ui/react"
import { CalendarDate } from "@internationalized/date"
import { ReactNode } from "react"
import { CalendarState } from "react-stately"

export type CalendarView = "weeks" | "months"

export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export interface ICalendarProps<T, K> {
  hoursToShow?: [IntRange<0, 24>, IntRange<1, 25>]
  view: CalendarView,
  onViewChange?: (newView: CalendarView) => void
  dateRef: CalendarDate
  onDateRefChange: (newDateRef: CalendarDate) => void
  canChangeView?: boolean
  showActionBar?: boolean
  colorPalette?: ConditionalValue<"border" | "bg" | "current" | "transparent" | "black" | "white" | "whiteAlpha" | "blackAlpha" | "gray" | "red" | "orange" | "yellow" | "green" | "teal" | "blue" | "cyan" | "purple" | "pink" | "fg">
  events: T[]
  groupProperties: {date: K, time: K}
  renderInCell?: (date: CalendarDate, htmlElement: HTMLDivElement, toShow: T[]) => ReactNode
  renderInWeek?: (date: CalendarDate, toShow: T[]) => ReactNode
  onDayClick?: (clickedDay: CalendarDate, minute?: number) => void
  onRangeChange?: (start: CalendarDate, end: CalendarDate) => void
}

export interface ICalendarGrid<T> {
  state: CalendarState
  events: {[key: string]: T[]}
  renderInCell: (date: CalendarDate, htmlElement: HTMLDivElement, toShow: T[]) => ReactNode
  renderInWeek: (date: CalendarDate, toShow: T[]) => ReactNode
  onDayClick: (clickedDay: CalendarDate, minute?: number) => void
  view: CalendarView
  startHour: number
  totalHours: number
}

export interface ICalendarCell {
  state: CalendarState
  date: CalendarDate
  currentMonth?: CalendarDate
  onDateClick: (date: CalendarDate, minute?: number) => void
  weekDayIndex: number
  startHour?: number
  totalHours?: number
  children?: ReactNode
}
