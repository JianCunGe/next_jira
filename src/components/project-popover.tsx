import styled from "@emotion/styled";
import { Divider, List, Popover, Typography } from "antd";
import { useProjectModal } from "pages/project-list/util";
import { useProjects } from "utils/project";
import { ButtonOnPadding } from "./lib";

export const ProjectPopover = () => {
  const { open } = useProjectModal();
  const { data: projects, isLoading } = useProjects();
  const pinnedProjects = projects?.filter((project) => project.pin);

  const content = (
    <ContentContainer>
      <Typography.Text type={"secondary"}>follow project</Typography.Text>
      <List>
        {pinnedProjects?.map((project) => (
          <List.Item key={project.id}>
            <List.Item.Meta title={project.name} />
          </List.Item>
        ))}
      </List>
      <Divider />
      <ButtonOnPadding onClick={open} type={"link"} loading={isLoading}>
        Create Project
      </ButtonOnPadding>
    </ContentContainer>
  );
  return (
    <Popover placement={"bottom"} content={content}>
      <ButtonOnPadding type={"link"}>Project</ButtonOnPadding>
    </Popover>
  );
};

const ContentContainer = styled.div`
  min-width: 30rem;
`;
