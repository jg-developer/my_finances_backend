import { getRepository } from 'typeorm';

import AppError from '../../error/AppError';

import Categories from '../../models/Categories';

interface Request {
  description: string;
}

class CreateCategoryService {
  async execute({ description }: Request): Promise<Categories> {
    const categoriesRepository = getRepository(Categories);

    const checkCategoryExists = await categoriesRepository.findOne({
      where: {
        description,
      },
    });

    if (checkCategoryExists) {
      throw new AppError('Essa categoria já existe', 409);
    }

    const category = categoriesRepository.create({
      description,
    });

    await categoriesRepository.save(category);

    return category;
  }
}

export default CreateCategoryService;
