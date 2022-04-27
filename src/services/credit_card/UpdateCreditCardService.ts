import { getRepository, Not } from 'typeorm';

import AppError from '../../error/AppError';

import CreditCards from '../../models/CreditCards';
import CreditCardBrand from '../../models/CreditCardBrand';

interface Request {
  id: string;
  description: string;
  closing_day: number;
  brand_id: string;
  due_date: number;
}

class UpdateCreditCardService {
  async execute({
    id,
    description,
    closing_day,
    brand_id,
    due_date,
  }: Request): Promise<CreditCards> {
    const creditCardsRepository = getRepository(CreditCards);
    const creditCardBrandsRepository = getRepository(CreditCardBrand);

    const creditCard = await creditCardsRepository.findOne(id);

    if (!creditCard) {
      throw new AppError('Cartão de crédito não encontrado.', 404);
    }

    const verifyCreditCard = await creditCardsRepository.findOne({
      where: {
        id: Not(id),
        description,
      },
    });

    if (verifyCreditCard) {
      throw new AppError('Esse cartão já existe', 409);
    }

    if (description) {
      creditCard.description = description;
    }

    if (closing_day) {
      creditCard.closing_day = closing_day;
    }

    if (brand_id !== creditCard.brand_id) {
      const brand = await creditCardBrandsRepository.findOne(brand_id);

      if (!brand) {
        throw new AppError('Bandeira não encontrada', 404);
      }

      creditCard.brand_id = brand_id;
    }

    if (due_date) {
      creditCard.due_date = due_date;
    }

    await creditCardsRepository.save(creditCard);

    return creditCard;
  }
}

export default UpdateCreditCardService;
