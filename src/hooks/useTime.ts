import React from "react";

export const SECOND = 1_000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;

interface IProps {
  deadline: number;
  interval?: number;
}

const useTimer = ({ deadline, interval = SECOND }: IProps) => {
  const [timeLeft, setTimeLeft] = React.useState(deadline - Date.now());

  React.useEffect(() => {
    const intervalId = setInterval(
      () => setTimeLeft((old_timeLeft) => Math.max(old_timeLeft - interval, 0)),
      interval
    );
    return () => clearInterval(intervalId);
  }, [interval]);

  return {
    raw: timeLeft,
    days: Math.floor(timeLeft / DAY),
    hours: Math.floor((timeLeft / HOUR) % 24),
    minutes: Math.floor((timeLeft / MINUTE) % 60),
    seconds: Math.floor((timeLeft / SECOND) % 60),
  };
};

export default useTimer;
