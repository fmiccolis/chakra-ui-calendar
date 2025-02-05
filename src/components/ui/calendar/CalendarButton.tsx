import { useRef } from "react";
import { AriaButtonProps, useButton } from "react-aria";
import { Box } from "@chakra-ui/react";

const CalendarButton = (props: AriaButtonProps<"button">) => {
  let ref = useRef<HTMLElement | null>(null);
  let { buttonProps } = useButton(props, ref);
  return (
    <Box {...buttonProps} ref={ref}>
      {props.children}
    </Box>
  );
}

export default CalendarButton;
