import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  timelineOppositeContentClasses,
} from "@mui/lab";
import { Typography } from "@mui/material";
import { format } from "date-fns";
import React, { FC } from "react";

interface MyTimelineProps {
  items?: MyTimeLineItemProps[];
}
interface MyTimeLineItemProps {
  date: Date;
  title: string;
  contents: string[];
}

const MyTimeLineItem: FC<MyTimeLineItemProps> = ({ date, title, contents }) => {
  const formatDate = (date: Date) => {
    return `${format(date, "MMM,yyyy")}`;
  };
  return (
    <TimelineItem>
      <TimelineOppositeContent>
        <Typography variant="body2" color="textSecondary">
          {formatDate(date)}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot></TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent sx={{ py: "12px", px: 2 }}>
        <Typography variant="h6" component="h1">
          {title}
        </Typography>
        {contents.map((content) => (
          <Typography>{content}</Typography>
        ))}
      </TimelineContent>
    </TimelineItem>
  );
};

const MyTimeline: FC<MyTimelineProps> = ({
  items = [
    {
      date: new Date(),
      title: "Societe Generate",
      contents: [
        "this is a societe generale",
        "abc is alskdflkasmdfl",
        "asdlfk lkasmdf lmasdf ",
      ],
    },
    {
      date: new Date(),
      title: "Societe Generate",
      contents: ["this is a societe generale"],
    },
    {
      date: new Date(),
      title: "Societe Generate",
      contents: ["this is a societe generale"],
    },
  ],
}) => (
  <Timeline
    data-testid="MyTimeline"
    sx={{
      [`& .${timelineOppositeContentClasses.root}`]: {
        flex: 0.2,
      },
    }}
  >
    {items.map(({ date, title, contents }) => (
      <MyTimeLineItem date={date} title={title} contents={contents} />
    ))}
  </Timeline>
);

export default MyTimeline;
