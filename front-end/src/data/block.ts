import { v4 as uuid } from 'uuid';
import {
  Block, BlockID, findProjectById, ProjectID, ProjectsDB, UserID,
} from '.';

export async function createBlock(
  size: number,
  idAnnotator: UserID,
  projectId: ProjectID,
): Promise<BlockID> {
  const id = uuid();
  let toAnnotate = [];
  const project = await findProjectById(projectId);
  const toBeAssigned = project.images.allImagesWithoutAnnotator;

  if (size >= toBeAssigned.length) {
    toAnnotate = toBeAssigned;
    project.images.allImagesWithoutAnnotator = [];
  } else {
    toAnnotate = toBeAssigned.slice(0, size);
    const remainedToBeAssigned = project.images.allImagesWithoutAnnotator.slice(size + 1, toBeAssigned.length);
    project.images.allImagesWithoutAnnotator = remainedToBeAssigned;
  }

  let idVerifier: UserID | undefined;

  Object.entries(project.images.annVer).forEach(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ([key, value]) => {
      if (value.annotatorId === idAnnotator) {
        idVerifier = value.verifierId;
      }
    },
  );

  const block = {
    _id: id,
    blockId: id,
    size,
    toAnnotate,
    toVerify: [],
    idAnnotator,
    idVerifier,
    projectId,
  } as Block;

  project.images.blocks.push(block);
  ProjectsDB.put(project);
  return id;
}

export default createBlock;
