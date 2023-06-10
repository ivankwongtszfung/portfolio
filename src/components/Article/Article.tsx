import { Chip, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { format } from "date-fns";
import React, { FC } from "react";
import ReactMarkdown from "react-markdown";
import { StringLiteral } from "typescript";

interface ArticleProps {
  title?: string;
  dateOfCreation?: Date;
  tags?: string[];
  content?: string;
}

const Title = ({ content }: { content: string }) => (
  <Typography variant="h4">{content}</Typography>
);
const DateOfCreation = ({ date }: { date: Date }) => (
  <Typography variant="caption" display="block" color={grey[500]} gutterBottom>
    {format(date, "MMMdd,yyyy")}
  </Typography>
);

const Tags = ({ tags }: { tags: string[] }) => (
  <Stack direction="row" spacing={0.5}>
    {tags.map((tag) => (
      <Chip label={tag} size="small" variant="outlined" />
    ))}
  </Stack>
);

const Article: FC<ArticleProps> = ({
  title = "title",
  dateOfCreation = new Date(),
  tags = ["tag1", "tag2"],
  content = "# Good Job",
}) => (
  <div data-testid="Article">
    <Title content={title} />
    <DateOfCreation date={dateOfCreation} />
    <Tags tags={tags} />
    <Typography gutterBottom>
      <ReactMarkdown>{content}</ReactMarkdown>
    </Typography>
  </div>
);

export default Article;
