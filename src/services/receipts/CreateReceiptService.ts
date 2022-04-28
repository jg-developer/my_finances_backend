import { getRepository } from 'typeorm';

import AppError from '../../error/AppError';

import Categories from '../../models/Categories';
import Receipts from '../../models/Receipts';

interface Request {
  description: string;
  observation: string;
  value: number;
  date: Date;
  category_id: string;
}

class CreateReceiptService {
  async execute({
    description,
    observation,
    value,
    date,
    category_id,
  }: Request): Promise<Receipts> {
    const receiptsRepository = getRepository(Receipts);
    const categoriesRepository = getRepository(Categories);

    const checkReceiptExists = await receiptsRepository.findOne({
      where: {
        description,
        observation,
        value,
        date,
        category_id,
      },
    });

    if (checkReceiptExists) {
      throw new AppError('Essa receita já existe', 409);
    }

    const checkCategoryExists = await categoriesRepository.findOne(category_id);

    if (!checkCategoryExists) {
      throw new AppError('Categoria não encontrada', 404);
    }

    const receipt = receiptsRepository.create({
      description,
      observation,
      value,
      date,
      category_id,
    });

    await receiptsRepository.save(receipt);

    return receipt;
  }
}

export default CreateReceiptService;
