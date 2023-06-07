import React from "react";
import { Link, Typography } from "@mui/material";
import "./Navbar.css";

interface NavbarProps {
  sections?: (string | string[])[];
}

const Navbar: React.FC<NavbarProps> = ({
  sections = ["section", "section", ["section", "sections"], "section"],
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const handleClick = (index: number) => setSelectedIndex(index);

  const navbarItem = (
    sections: any[],
    level: number = 1,
    index: number = 1
  ) => {
    switch (typeof sections) {
      case "object":
        return (
          <Typography component="ul">
            {sections.map((section) => {
              let item;
              if (Array.isArray(section)) {
                level += 1;
                item = navbarItem(section, level, index);
                level -= 1;
                index += section.length;
              } else {
                item = navbarItem(section, level, index);
                index += 1;
              }
              return item;
            })}
          </Typography>
        );
        break;
      case "string":
        return (
          <li>
            <Link
              sx={{ "padding-left": level * 10 }}
              onClick={() => handleClick(index)}
              underline="none"
              color={selectedIndex === index ? "" : "inherit"}
              className={`navLink ${
                selectedIndex === index ? "navLinkActive" : ""
              }`}
            >
              <span>
                {sections} {index}
              </span>
            </Link>
          </li>
        );
        break;
      default:
        break;
    }
  };

  return <nav aria-label="Content">{navbarItem(sections)}</nav>;
};

export default Navbar;
