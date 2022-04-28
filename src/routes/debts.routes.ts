import { Router } from 'express';
import { getRepository } from 'typeorm';

import { generateLikeQueryBuilder } from '../utils/generateLikeQuery';

import CreateDebtService from '../services/debts/CreateDebtService';
import UpdateDebtService from '../services/debts/UpdateDebtService';
import AppError from '../error/AppError';
import Debts from '../models/Debts';

const debtsRouter = Router();

debtsRouter.post('/', async (request, response) => {
  const {
    description,
    observation,
    value,
    date,
    installments,
    category_id,
    payment_type,
  } = request.body;

  const createDebt = new CreateDebtService();

  const debt = await createDebt.execute({
    description,
    observation,
    value,
    date,
    installments,
    category_id,
    payment_type,
  });

  return response.status(201).json(debt);
});

debtsRouter.get('/', async (request, response) => {
  interface ObjectTypes {
    [key: string]: any;
  }

  const { page = 1, per_page = 10, ...q } = request.query;

  const query_params: ObjectTypes = q;

  const where_query = generateLikeQueryBuilder(query_params);

  const debtsRepository = getRepository(Debts);

  const skip: number = page === 1 ? 0 : (Number(page) - 1) * Number(per_page);

  const debts = await debtsRepository
    .createQueryBuilder('debts')
    .leftJoinAndSelect('debts.category', 'category')
    .where(where_query as string)
    .take(per_page as number)
    .skip(skip as number)
    .getMany()
    .then((response) => response)
    .catch((error) => {
      throw new AppError(error, 500);
    });

  const total_debts = await debtsRepository
    .createQueryBuilder('debts')
    .leftJoinAndSelect('debts.category', 'category')
    .where(where_query as string)
    .getCount();

  const total_pages = Math.ceil(total_debts / Number(per_page));

  const response_body = {
    data: debts,
    total: total_debts,
    per_page,
    total_pages,
  };

  return response.json(response_body);
});

debtsRouter.get('/:id', async (request, response) => {
  const { id } = request.params;

  const debtsRepository = getRepository(Debts);

  const debt = await debtsRepository.findOne(id, {
    relations: ['category'],
  });

  return response.json(debt);
});

debtsRouter.put('/:id', async (request, response) => {
  const { id } = request.params;

  const {
    description,
    observation,
    value,
    date,
    installments,
    category_id,
    payment_type,
  } = request.body;

  const updateDebt = new UpdateDebtService();

  const debt = await updateDebt.execute({
    id,
    description,
    observation,
    value,
    date,
    installments,
    category_id,
    payment_type,
  });

  return response.json(debt);
});

debtsRouter.delete('/:id', async (request, response) => {
  const id = request.params;

  const debtsRepository = getRepository(Debts);

  await debtsRepository.delete(id);

  return response.send();
});

export default debtsRouter;
