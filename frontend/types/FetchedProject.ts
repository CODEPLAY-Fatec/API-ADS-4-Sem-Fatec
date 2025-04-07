import Project from "@shared/Project";
import { User } from "@shared/User";

type FetchedProject = Project & {
  projectMember: User[];
};

export default FetchedProject;
