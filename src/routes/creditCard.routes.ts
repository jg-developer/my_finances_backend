import { Router } from 'express';
import { getRepository } from 'typeorm';

import { generateLikeQueryBuilder } from '../utils/generateLikeQuery';

import CreateCreditCardService from '../services/credit_card/CreateCreditCardService';
import UpdateCreditCardService from '../services/credit_card/UpdateCreditCardService';
import AppError from '../error/AppError';
import CreditCards from '../models/CreditCards';

const creditCardRouter = Router();

creditCardRouter.post('/', async (request, response) => {
  const { description, brand_id, closing_day, due_date } = request.body;

  const createCreditCard = new CreateCreditCardService();

  const creditCard = await createCreditCard.execute({
    description,
    brand_id,
    closing_day,
    due_date,
  });

  return response.status(201).json(creditCard);
});

creditCardRouter.get('/', async (request, response) => {
  interface ObjectTypes {
    [key: string]: any;
  }

  const { page = 1, per_page = 10, ...q } = request.query;

  const query_params: ObjectTypes = q;

  const where_query = generateLikeQueryBuilder(query_params);

  const creditCardsRepository = getRepository(CreditCards);

  const skip: number = page === 1 ? 0 : (Number(page) - 1) * Number(per_page);

  const credit_cards = await creditCardsRepository
    .createQueryBuilder('credit_cards')
    .where(where_query as string)
    .take(per_page as number)
    .skip(skip as number)
    .getMany()
    .then((response) => response)
    .catch((error) => {
      throw new AppError(error, 500);
    });

  const total_credit_cards = await creditCardsRepository
    .createQueryBuilder('credit_cards')
    .where(where_query as string)
    .getCount();

  const total_pages = Math.ceil(total_credit_cards / Number(per_page));

  const response_body = {
    data: credit_cards,
    total: total_credit_cards,
    per_page,
    total_pages,
  };

  return response.json(response_body);
});

creditCardRouter.get('/:id', async (request, response) => {
  const { id } = request.params;

  const creditCardsRepository = getRepository(CreditCards);

  const creditCard = await creditCardsRepository.findOne(id);

  return response.json(creditCard);
});

creditCardRouter.put('/:id', async (request, response) => {
  const { id } = request.params;

  const { description, brand_id, closing_day, due_date } = request.body;

  const updateCreditCard = new UpdateCreditCardService();

  const creditCard = await updateCreditCard.execute({
    description,
    brand_id,
    closing_day,
    due_date,
    id,
  });

  return response.json(creditCard);
});

creditCardRouter.delete('/:id', async (request, response) => {
  const id = request.params;

  const creditCardsRepository = getRepository(CreditCards);

  await creditCardsRepository.delete(id);

  return response.send();
});

export default creditCardRouter;
