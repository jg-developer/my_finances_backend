import { getRepository, Not } from 'typeorm';

import AppError from '../../error/AppError';

import Categories from '../../models/Categories';
import Receipts from '../../models/Receipts';

interface Request {
  id: string;
  description: string;
  observation: string;
  value: number;
  date: Date;
  category_id: string;
}

class UpdateReceiptService {
  async execute({
    id,
    description,
    observation,
    value,
    date,
    category_id,
  }: Request): Promise<Receipts> {
    const receiptsRepository = getRepository(Receipts);
    const categoriesRepository = getRepository(Categories);

    const receipt = await receiptsRepository.findOne(id);

    if (!receipt) {
      throw new AppError('Pagamento não encontrado.', 404);
    }

    const verifyReceipt = await receiptsRepository.findOne({
      where: {
        id: Not(id),
        description,
        observation,
        value,
        date,
        category_id,
      },
    });

    if (verifyReceipt) {
      throw new AppError('Essa receita já existe', 409);
    }

    if (description) {
      receipt.description = description;
    }

    if (observation) {
      receipt.observation = observation;
    }

    if (value) {
      receipt.value = value;
    }

    if (date) {
      receipt.date = date;
    }

    if (category_id !== receipt.category_id) {
      const category = await categoriesRepository.findOne(category_id);

      if (!category) {
        throw new AppError('Categoria não encontrada', 404);
      }

      receipt.category_id = category_id;
    }

    await receiptsRepository.save(receipt);

    return receipt;
  }
}

export default UpdateReceiptService;
