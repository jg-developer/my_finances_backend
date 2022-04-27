import { Router } from 'express';
import { getRepository } from 'typeorm';

import { generateLikeQueryBuilder } from '../utils/generateLikeQuery';

import CreateCreditCardBrandService from '../services/credit_card_brand/CreateCreditCardBrandService';
import UpdateCreditCardBrandService from '../services/credit_card_brand/UpdateCreditCardBrandService';
import AppError from '../error/AppError';
import CreditCardBrand from '../models/CreditCardBrand';

const creditCardBrandRouter = Router();

creditCardBrandRouter.post('/', async (request, response) => {
  const { description } = request.body;

  const createCreditCardBrand = new CreateCreditCardBrandService();

  const credit_card_brand = await createCreditCardBrand.execute({
    description,
  });

  return response.status(201).json(credit_card_brand);
});

creditCardBrandRouter.get('/', async (request, response) => {
  interface ObjectTypes {
    [key: string]: any;
  }

  const { page = 1, per_page = 10, ...q } = request.query;

  const query_params: ObjectTypes = q;

  const where_query = generateLikeQueryBuilder(query_params);

  const creditCardBrandRepository = getRepository(CreditCardBrand);

  const skip: number = page === 1 ? 0 : (Number(page) - 1) * Number(per_page);

  const credit_card_brands = await creditCardBrandRepository
    .createQueryBuilder('credit_card_brand')
    .where(where_query as string)
    .take(per_page as number)
    .skip(skip as number)
    .getMany()
    .then((response) => response)
    .catch((error) => {
      throw new AppError(error, 500);
    });

  const total_credit_card_brands = await creditCardBrandRepository
    .createQueryBuilder('credit_card_brand')
    .where(where_query as string)
    .getCount();

  const total_pages = Math.ceil(total_credit_card_brands / Number(per_page));

  const response_body = {
    data: credit_card_brands,
    total: total_credit_card_brands,
    per_page,
    total_pages,
  };

  return response.json(response_body);
});

creditCardBrandRouter.get('/:id', async (request, response) => {
  const { id } = request.params;

  const creditCardBrandRepository = getRepository(CreditCardBrand);

  const credit_card_brand = await creditCardBrandRepository.findOne(id);

  return response.json(credit_card_brand);
});

creditCardBrandRouter.put('/:id', async (request, response) => {
  const { id } = request.params;

  const { description } = request.body;

  const updateCreditCardBrand = new UpdateCreditCardBrandService();

  const credit_card_brand = await updateCreditCardBrand.execute({
    description,
    id,
  });

  return response.json(credit_card_brand);
});

creditCardBrandRouter.delete('/:id', async (request, response) => {
  const id = request.params;

  const creditCardBrandRepository = getRepository(CreditCardBrand);

  await creditCardBrandRepository.delete(id);

  return response.send();
});

export default creditCardBrandRouter;
