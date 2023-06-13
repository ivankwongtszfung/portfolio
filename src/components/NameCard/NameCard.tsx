import {
  Avatar,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import React, { FC } from "react";

export interface LinkProps {
  path: string;
  Icon: any;
}

interface NameCardProps {
  name?: string;
  title?: string;
  links?: LinkProps[];
}

const NameCard: FC<NameCardProps> = ({
  name = "Name",
  title = "Profession",
  links = [],
}) => (
  <Card elevation={0}>
    <CardContent
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Avatar
        alt="IK"
        style={{ width: "100px", height: "100px", marginRight: "16px" }}
      />
      <div>
        <Typography variant="h4">{name}</Typography>
        <Typography variant="subtitle1">{title}</Typography>
        <div>
          {links.map(({ path, Icon }) => (
            <IconButton
              href={path}
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: "3px" }}
            >
              <Icon />
            </IconButton>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default NameCard;
