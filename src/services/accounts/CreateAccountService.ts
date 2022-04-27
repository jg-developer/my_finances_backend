import { getRepository } from 'typeorm';

import AppError from '../../error/AppError';

import Accounts from '../../models/Accounts';

interface Request {
  description: string;
  bank: string;
  type: string;
}

class CreateAccountService {
  async execute({ description, bank, type }: Request): Promise<Accounts> {
    const accountsRepository = getRepository(Accounts);

    const checkAccountExists = await accountsRepository.findOne({
      where: {
        description,
        bank,
        type,
      },
    });

    if (checkAccountExists) {
      throw new AppError('Essa conta já existe', 409);
    }

    const account = accountsRepository.create({
      description,
      bank,
      type,
    });

    await accountsRepository.save(account);

    return account;
  }
}

export default CreateAccountService;
