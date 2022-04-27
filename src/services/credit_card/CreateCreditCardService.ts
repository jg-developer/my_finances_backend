import { getRepository } from 'typeorm';

import AppError from '../../error/AppError';

import CreditCards from '../../models/CreditCards';
import CreditCardBrand from '../../models/CreditCardBrand';

interface Request {
  description: string;
  closing_day: number;
  brand_id: string;
  due_date: number;
}

class CreateCreditCardService {
  async execute({
    description,
    closing_day,
    brand_id,
    due_date,
  }: Request): Promise<CreditCards> {
    const creditCardsRepository = getRepository(CreditCards);
    const creditCardBrandsRepository = getRepository(CreditCardBrand);

    const checkCreditCardExists = await creditCardsRepository.findOne({
      where: {
        description,
        closing_day,
        brand_id,
        due_date,
      },
    });

    if (checkCreditCardExists) {
      throw new AppError('Esse cartão de crédito já existe', 409);
    }

    const checkCreditCardBrandExists = await creditCardBrandsRepository.findOne(
      brand_id,
    );

    if (!checkCreditCardBrandExists) {
      throw new AppError('Bandeira não encontrada já existe', 404);
    }

    const creditCard = creditCardsRepository.create({
      description,
      closing_day,
      brand_id,
      due_date,
    });

    await creditCardsRepository.save(creditCard);

    return creditCard;
  }
}

export default CreateCreditCardService;
