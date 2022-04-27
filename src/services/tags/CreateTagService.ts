import { getRepository } from 'typeorm';

import AppError from '../../error/AppError';

import Tags from '../../models/Tags';

interface Request {
  description: string;
}

class CreateTagService {
  async execute({ description }: Request): Promise<Tags> {
    const tagsRepository = getRepository(Tags);

    const checkTagExists = await tagsRepository.findOne({
      where: {
        description,
      },
    });

    if (checkTagExists) {
      throw new AppError('Essa tag já existe', 409);
    }

    const tag = tagsRepository.create({
      description,
    });

    await tagsRepository.save(tag);

    return tag;
  }
}

export default CreateTagService;
