import { Router } from 'express';
import { getRepository } from 'typeorm';

import { generateLikeQueryBuilder } from '../utils/generateLikeQuery';

import CreateAccountService from '../services/accounts/CreateAccountService';
import UpdateAccountService from '../services/accounts/UpdateAccountService';
import AppError from '../error/AppError';
import Categories from '../models/Categories';
import Accounts from '../models/Accounts';

const accountsRouter = Router();

accountsRouter.post('/', async (request, response) => {
  const { description, bank, type } = request.body;

  const createAccount = new CreateAccountService();

  const account = await createAccount.execute({
    description,
    bank,
    type,
  });

  return response.status(201).json(account);
});

accountsRouter.get('/', async (request, response) => {
  interface ObjectTypes {
    [key: string]: any;
  }

  const { page = 1, per_page = 10, ...q } = request.query;

  const query_params: ObjectTypes = q;

  const where_query = generateLikeQueryBuilder(query_params);

  const accountsRepository = getRepository(Accounts);

  const skip: number = page === 1 ? 0 : (Number(page) - 1) * Number(per_page);

  const accounts = await accountsRepository
    .createQueryBuilder('accounts')
    .where(where_query as string)
    .take(per_page as number)
    .skip(skip as number)
    .getMany()
    .then((response) => response)
    .catch((error) => {
      throw new AppError(error, 500);
    });

  const total_accounts = await accountsRepository
    .createQueryBuilder('accounts')
    .where(where_query as string)
    .getCount();

  const total_pages = Math.ceil(total_accounts / Number(per_page));

  const response_body = {
    data: accounts,
    total: total_accounts,
    per_page,
    total_pages,
  };

  return response.json(response_body);
});

accountsRouter.get('/:id', async (request, response) => {
  const { id } = request.params;

  const accountsRepository = getRepository(Accounts);

  const account = await accountsRepository.findOne(id);

  return response.json(account);
});

accountsRouter.put('/:id', async (request, response) => {
  const { id } = request.params;

  const { description, bank, type } = request.body;

  const updateAccount = new UpdateAccountService();

  const account = await updateAccount.execute({
    id,
    description,
    bank,
    type,
  });

  return response.json(account);
});

accountsRouter.delete('/:id', async (request, response) => {
  const id = request.params;

  const accountsRepository = getRepository(Accounts);

  await accountsRepository.delete(id);

  return response.send();
});

export default accountsRouter;
