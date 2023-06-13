import * as React from "react";

import MyTimeline, {
  MyTimeLineItemProps,
} from "../../components/MyTimeline/MyTimeline";
import { Box, Container, Typography } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import ArticleIcon from "@mui/icons-material/Article";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import NameCard, { LinkProps } from "../../components/NameCard/NameCard";

const Work = () => {
  const workExp: MyTimeLineItemProps[] = [
    {
      date: new Date(2022, 4),
      title: "Software Engineer @ Wave Financial Inc.",
      contents: [
        "- Implement factory library for creating protocol buffer message from objects, it reduces boilerplate code for 50%",
        "- Build receipt OCR features in Django based web application to automate the book keeping process for 60%",
        "- Monitor critical API endpoint using DataDog for a software with 500K users.",
        "- Upgrade GraphQL server version from 2 to 3, it improves speed of our servers for 10%",
      ],
    },
    {
      date: new Date(2019, 9),
      title: "Software Engineer @ Société Générale",
      contents: [
        "- Build Python, React web application to automate server provisioning including IP, OS, post-check, it saves 2-3 weeks manual cost.",
        "- Lead communication & development for the 40-person GTS team in APAC to develop application to automate & visualize their daily work.",
        "- Migrated projects and servers to private cloud to Kubernetes to save cost by 30%.",
        "- Enhanced CICD pipeline for APAC projects, improving development efficiency by roughly 50%.",
      ],
    },
    {
      date: new Date(2018, 7),
      title: "Trainee Captial Market IT @ Crédit Agricole CIB",
      contents: [
        "- Automated pricing for over 5000 exotic product orders across APAC, saving 2-3 hours daily.",
        "- Implement FX option pricing in C# application, improving transparency of FX risk.",
        "- Work in a team of 3 developers creating C# applications to support portfolio management.",
        "- Created a visual dashboard and metrics for portfolio maintenance using VBA and Bloomberg.",
      ],
    },
  ];

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Work Experience
      </Typography>
      <MyTimeline items={workExp} />
    </>
  );
};

const Education = () => {
  const workExp: MyTimeLineItemProps[] = [
    {
      date: new Date(2014, 7),
      title: "BSc in Computer Science @ CUHK",
      contents: [],
    },
  ];

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Education
      </Typography>
      <MyTimeline items={workExp} />;
    </>
  );
};

const MyCard = () => {
  const links: LinkProps[] = [
    {
      path: "https://www.linkedin.com/in/ivan-kwong-tsz-fung/",
      Icon: LinkedInIcon,
    },
    {
      path: "https://github.com/ivankwongtszfung/",
      Icon: GitHubIcon,
    },
    {
      path: "https://dev.to/ivankwongtszfung",
      Icon: ArticleIcon,
    },
  ];

  return <NameCard name="Ivan Kwong" title="Software Engineer" links={links} />;
};

const About = () => (
  <>
    <Typography variant="h6" gutterBottom>
      About
    </Typography>
    <Typography variant="body1" gutterBottom>
      A dedicated software engineer with a proven track record in designing,
      developing, and maintaining applications. With over 5 years of experience,
      I have honed my skills in diverse tech stacks, including Django, GraphQL,
      Python, and Kubernetes. I've successfully automated server provisioning,
      upgraded server versions, and increased e2e-testing coverage. My ability
      to adopt good practices and habits ensures high-quality software within
      teams. I have a Bachelor's degree in Computer Science from The Chinese
      University of Hong Kong. I am known for my strategic approach,
      problem-solving skills, and dedication to continuous learning and
      improvement.
    </Typography>
  </>
);

const Home = () => {
  return (
    <Container maxWidth="md">
      <Box mt={2} sx={{ display: "flex" }}>
        <Box
          component="main"
          sx={{ flexGrow: 2, justifyContent: "center", alignItems: "center" }}
        >
          <MyCard />
          <About />
          <br />
          <Work />
          <Education />
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
