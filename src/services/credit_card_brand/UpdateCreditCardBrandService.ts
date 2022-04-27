import { getRepository, Not } from 'typeorm';

import AppError from '../../error/AppError';

import CreditCardBrand from '../../models/CreditCardBrand';

interface Request {
  id: string;
  description: string;
}

class UpdateCreditCardBrandService {
  async execute({ id, description }: Request): Promise<CreditCardBrand> {
    const creditCardBrandRepository = getRepository(CreditCardBrand);
    const creditCardBrand = await creditCardBrandRepository.findOne(id);

    if (!creditCardBrand) {
      throw new AppError('Bandeira não encontrada.', 404);
    }

    const verifyCreditCardBrand = await creditCardBrandRepository.findOne({
      where: {
        id: Not(id),
        description,
      },
    });

    if (verifyCreditCardBrand) {
      throw new AppError('Essa bandeira já existe', 409);
    }

    if (description) {
      creditCardBrand.description = description;
    }

    await creditCardBrandRepository.save(creditCardBrand);

    return creditCardBrand;
  }
}

export default UpdateCreditCardBrandService;
