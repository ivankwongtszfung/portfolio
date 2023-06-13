import {
  Box,
  Card,
  CircularProgress,
  Fab,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import React, { FC } from "react";
import useTimer, { MINUTE } from "../../hooks/useTime";

interface PomodoroProps {
  mins?: number;
}

const Pomodoro: FC<PomodoroProps> = ({ mins = 5 }) => {
  const duration = mins * MINUTE;
  const deadline = Date.now() + duration;
  const { raw, minutes, seconds } = useTimer({ deadline });
  const p0 = (num: number) => num.toString().padStart(2, "0");
  return (
    <Card elevation={3}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h1" position={"absolute"}>
          {p0(minutes)}:{p0(seconds)}
        </Typography>
        <CircularProgress
          size={350}
          variant="determinate"
          sx={{
            color: green[500],
            top: -6,
            left: -6,
            zIndex: 1,
          }}
          value={Math.floor(((duration - raw) * 100) / duration)}
        />
      </div>
    </Card>
  );
};

export default Pomodoro;
