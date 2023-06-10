import * as React from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import InboxIcon from "@mui/icons-material/Inbox";
import { SvgIconProps } from "@mui/material/SvgIcon";
import { useNavigate } from "react-router-dom";

interface ItemProps {
  Icon: React.ReactElement<SvgIconProps>;
  onClick: () => void;
}

export interface MiniDrawerProp {
  items?: { [key: string]: ItemProps };
}

const drawerWidth = 240;

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...{
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  },
}));

const MiniDrawer: React.FC<MiniDrawerProp> = ({
  items = { Mail: { Icon: InboxIcon, onClick: (_: string) => {} } },
}) => {
  return (
    <Drawer variant="permanent">
      <List>
        {Object.entries(items).map(([name, { Icon, onClick: handleClick }]) => (
          <ListItem key={name} disablePadding>
            <ListItemButton
              sx={{ minHeight: 48, px: 2.5, "flex-direction": "column" }}
              onClick={handleClick}
            >
              <ListItemIcon sx={{ minWidth: 0 }}>
                <Icon />
              </ListItemIcon>
              <Typography variant="caption">{name}</Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default MiniDrawer;
