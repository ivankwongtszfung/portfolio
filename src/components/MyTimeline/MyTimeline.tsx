import { ExpandLess, ExpandMore } from "@mui/icons-material";
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
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import ClassIcon from "@mui/icons-material/Class";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import { format } from "date-fns";
import React, { FC } from "react";

export interface MyTimelineProps {
  items?: MyTimeLineItemProps[];
}
export interface MyTimeLineItemProps {
  date: Date;
  title: string;
  contents: string[];
}

interface IMyTimeLineItemProps extends MyTimeLineItemProps {
  lastItem: boolean;
}

const MyTimeLineItem: FC<IMyTimeLineItemProps> = ({
  date,
  title,
  contents,
  lastItem,
}) => {
  const [open, setOpen] = React.useState(false);
  const myRef = React.useRef<HTMLDivElement>(null);

  const handleClick = () => setOpen(!open);
  const handleEntered = () =>
    myRef?.current?.scrollIntoView({ behavior: "smooth" });
  const formatDate = (date: Date) => {
    return `${format(date, "MMM,yyyy")}`;
  };
  return (
    <TimelineItem>
      <TimelineOppositeContent
        sx={{ m: "auto 0" }}
        align="right"
        variant="body2"
        color="text.secondary"
      >
        {formatDate(date)}
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot color="primary" variant="outlined">
          {!lastItem ? <LaptopMacIcon /> : <ClassIcon />}
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent sx={{ m: "auto 0", p: "0 0" }}>
        <List disablePadding>
          <ListItemButton onClick={handleClick}>
            <ListItemText
              primary={title}
              primaryTypographyProps={{ variant: "h6" }}
            />
            {contents.length > 0 && (open ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </List>
        <Collapse
          in={open}
          timeout="auto"
          unmountOnExit
          onEntered={handleEntered}
        >
          <List ref={myRef} dense component="div" disablePadding>
            {contents.map((content) => (
              <ListItem sx={{ pl: 4 }}>
                <ListItemText primary={content} />
              </ListItem>
            ))}
          </List>
        </Collapse>
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
        flex: 0.1,
      },
    }}
  >
    {items.map(({ date, title, contents }, index) => (
      <MyTimeLineItem
        date={date}
        title={title}
        contents={contents}
        lastItem={index === items.length - 1}
      />
    ))}
  </Timeline>
);

export default MyTimeline;
