import { getRepository } from 'typeorm';

import AppError from '../../error/AppError';

import Categories from '../../models/Categories';
import Debts from '../../models/Debts';

interface Request {
  description: string;
  observation: string;
  value: number;
  date: Date;
  installments: number;
  category_id: string;
  payment_type: string;
}

class CreateDebtService {
  async execute({
    description,
    observation,
    value,
    date,
    installments,
    category_id,
    payment_type,
  }: Request): Promise<Debts> {
    const debtsRepository = getRepository(Debts);
    const categoriesRepository = getRepository(Categories);

    const checkDebtExists = await debtsRepository.findOne({
      where: {
        description,
        observation,
        value,
        date,
        installments,
        category_id,
        payment_type,
      },
    });

    if (checkDebtExists) {
      throw new AppError('Esse pagamento já existe', 409);
    }

    const checkCategoryExists = await categoriesRepository.findOne(category_id);

    if (!checkCategoryExists) {
      throw new AppError('Categoria não encontrada', 404);
    }

    const debt = debtsRepository.create({
      description,
      observation,
      value,
      date,
      installments,
      category_id,
      payment_type,
    });

    await debtsRepository.save(debt);

    return debt;
  }
}

export default CreateDebtService;
