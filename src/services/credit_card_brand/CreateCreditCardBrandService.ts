import { getRepository } from 'typeorm';

import AppError from '../../error/AppError';

import CreditCardBrand from '../../models/CreditCardBrand';

interface Request {
  description: string;
}

class CreateCreditCardBrandService {
  async execute({ description }: Request): Promise<CreditCardBrand> {
    const creditCardBrandRepository = getRepository(CreditCardBrand);

    const checkCreditCardBrandExists = await creditCardBrandRepository.findOne({
      where: {
        description,
      },
    });

    if (checkCreditCardBrandExists) {
      throw new AppError('Essa bandeira já existe', 409);
    }

    const creditCardBrand = creditCardBrandRepository.create({
      description,
    });

    await creditCardBrandRepository.save(creditCardBrand);

    return creditCardBrand;
  }
}

export default CreateCreditCardBrandService;
