import { getRepository, Not } from 'typeorm';

import AppError from '../../error/AppError';

import Accounts from '../../models/Accounts';

interface Request {
  id: string;
  description: string;
  bank: string;
  type: string;
}

class UpdateCategoryService {
  async execute({ id, description, bank, type }: Request): Promise<Accounts> {
    const accountsRepository = getRepository(Accounts);
    const account = await accountsRepository.findOne(id);

    if (!account) {
      throw new AppError('Conta não encontrada.', 404);
    }

    const verifyAccount = await accountsRepository.findOne({
      where: {
        id: Not(id),
        description,
        bank,
        type,
      },
    });

    if (verifyAccount) {
      throw new AppError('Essa conta já existe', 409);
    }

    if (description) {
      account.description = description;
    }

    if (bank) {
      account.bank = bank;
    }

    if (type) {
      account.type = type;
    }

    await accountsRepository.save(account);

    return account;
  }
}

export default UpdateCategoryService;
