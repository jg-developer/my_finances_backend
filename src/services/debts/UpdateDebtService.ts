import { getRepository, Not } from 'typeorm';

import AppError from '../../error/AppError';

import Categories from '../../models/Categories';
import Debts from '../../models/Debts';

interface Request {
  id: string;
  description: string;
  observation: string;
  value: number;
  date: Date;
  installments: number;
  category_id: string;
  payment_type: string;
}

class UpdateDebtService {
  async execute({
    id,
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

    const debt = await debtsRepository.findOne(id);

    if (!debt) {
      throw new AppError('Pagamento não encontrado.', 404);
    }

    const verifyDebt = await debtsRepository.findOne({
      where: {
        id: Not(id),
        description,
        observation,
        value,
        date,
        installments,
        category_id,
        payment_type,
      },
    });

    if (verifyDebt) {
      throw new AppError('Esse pagamento já existe', 409);
    }

    if (description) {
      debt.description = description;
    }

    if (observation) {
      debt.observation = observation;
    }

    if (payment_type) {
      debt.payment_type = payment_type;
    }

    if (installments) {
      debt.installments = installments;
    }

    if (value) {
      debt.value = value;
    }

    if (date) {
      debt.date = date;
    }

    if (category_id !== debt.category_id) {
      const category = await categoriesRepository.findOne(category_id);

      if (!category) {
        throw new AppError('Categoria não encontrada', 404);
      }

      debt.category_id = category_id;
    }

    await debtsRepository.save(debt);

    return debt;
  }
}

export default UpdateDebtService;
