import { Router } from 'express';
import { getRepository } from 'typeorm';

import { generateLikeQueryBuilder } from '../utils/generateLikeQuery';

import CreateReceiptService from '../services/receipts/CreateReceiptService';
import UpdateReceiptService from '../services/receipts/UpdateReceiptService';
import AppError from '../error/AppError';
import Receipts from '../models/Receipts';

const receiptsRouter = Router();

receiptsRouter.post('/', async (request, response) => {
  const { description, observation, value, date, category_id } = request.body;

  const createReceipt = new CreateReceiptService();

  const receipt = await createReceipt.execute({
    description,
    observation,
    value,
    date,
    category_id,
  });

  return response.status(201).json(receipt);
});

receiptsRouter.get('/', async (request, response) => {
  interface ObjectTypes {
    [key: string]: any;
  }

  const { page = 1, per_page = 10, ...q } = request.query;

  const query_params: ObjectTypes = q;

  const where_query = generateLikeQueryBuilder(query_params);

  const receiptsRepository = getRepository(Receipts);

  const skip: number = page === 1 ? 0 : (Number(page) - 1) * Number(per_page);

  const receipts = await receiptsRepository
    .createQueryBuilder('receipts')
    .leftJoinAndSelect('receipts.category', 'category')
    .where(where_query as string)
    .take(per_page as number)
    .skip(skip as number)
    .getMany()
    .then((response) => response)
    .catch((error) => {
      throw new AppError(error, 500);
    });

  const total_receipts = await receiptsRepository
    .createQueryBuilder('receipts')
    .leftJoinAndSelect('receipts.category', 'category')
    .where(where_query as string)
    .getCount();

  const total_pages = Math.ceil(total_receipts / Number(per_page));

  const response_body = {
    data: receipts,
    total: total_receipts,
    per_page,
    total_pages,
  };

  return response.json(response_body);
});

receiptsRouter.get('/:id', async (request, response) => {
  const { id } = request.params;

  const receiptsRepository = getRepository(Receipts);

  const receipt = await receiptsRepository.findOne(id, {
    relations: ['category'],
  });

  return response.json(receipt);
});

receiptsRouter.put('/:id', async (request, response) => {
  const { id } = request.params;

  const { description, observation, value, date, category_id } = request.body;

  const updateDebt = new UpdateReceiptService();

  const debt = await updateDebt.execute({
    id,
    description,
    observation,
    value,
    date,
    category_id,
  });

  return response.json(debt);
});

receiptsRouter.delete('/:id', async (request, response) => {
  const id = request.params;

  const receiptsRepository = getRepository(Receipts);

  await receiptsRepository.delete(id);

  return response.send();
});

export default receiptsRouter;
