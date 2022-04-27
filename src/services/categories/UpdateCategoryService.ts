import { getRepository, Not } from 'typeorm';

import AppError from '../../error/AppError';

import Categories from '../../models/Categories';

interface Request {
  id: string;
  description: string;
}

class UpdateCategoryService {
  async execute({ id, description }: Request): Promise<Categories> {
    const categoriesRepository = getRepository(Categories);
    const category = await categoriesRepository.findOne(id);

    if (!category) {
      throw new AppError('Categoria não encontrada.', 404);
    }

    const verifyCategory = await categoriesRepository.findOne({
      where: {
        id: Not(id),
        description,
      },
    });

    if (verifyCategory) {
      throw new AppError('Essa categoria já existe', 409);
    }

    if (description) {
      category.description = description;
    }

    await categoriesRepository.save(category);

    return category;
  }
}

export default UpdateCategoryService;
