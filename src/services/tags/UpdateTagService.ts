import { getRepository, Not } from 'typeorm';

import AppError from '../../error/AppError';

import Tags from '../../models/Tags';

interface Request {
  id: string;
  description: string;
}

class UpdateTagService {
  async execute({ id, description }: Request): Promise<Tags> {
    const tagsRepository = getRepository(Tags);
    const tag = await tagsRepository.findOne(id);

    if (!tag) {
      throw new AppError('Tag não encontrada.', 404);
    }

    const verifyTag = await tagsRepository.findOne({
      where: {
        id: Not(id),
        description,
      },
    });

    if (verifyTag) {
      throw new AppError('Essa tag já existe', 409);
    }

    if (description) {
      tag.description = description;
    }

    await tagsRepository.save(tag);

    return tag;
  }
}

export default UpdateTagService;
