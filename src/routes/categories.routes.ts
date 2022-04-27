import { Router } from 'express';
import { getRepository } from 'typeorm';

import { generateLikeQueryBuilder } from '../utils/generateLikeQuery';

import CreateCategoryService from '../services/categories/CreateCategoryService';
import UpdateCategoryService from '../services/categories/UpdateCategoryService';
import AppError from '../error/AppError';
import Categories from '../models/Categories';

const categoriesRouter = Router();

categoriesRouter.post('/', async (request, response) => {
  const { description } = request.body;

  const createCategory = new CreateCategoryService();

  const category = await createCategory.execute({
    description,
  });

  return response.status(201).json(category);
});

categoriesRouter.get('/', async (request, response) => {
  interface ObjectTypes {
    [key: string]: any;
  }

  const { page = 1, per_page = 10, ...q } = request.query;

  const query_params: ObjectTypes = q;

  const where_query = generateLikeQueryBuilder(query_params);

  const categoriesRepository = getRepository(Categories);

  const skip: number = page === 1 ? 0 : (Number(page) - 1) * Number(per_page);

  const categories = await categoriesRepository
    .createQueryBuilder('categories')
    .where(where_query as string)
    .take(per_page as number)
    .skip(skip as number)
    .getMany()
    .then((response) => response)
    .catch((error) => {
      throw new AppError(error, 500);
    });

  const total_categories = await categoriesRepository
    .createQueryBuilder('categories')
    .where(where_query as string)
    .getCount();

  const total_pages = Math.ceil(total_categories / Number(per_page));

  const response_body = {
    data: categories,
    total: total_categories,
    per_page,
    total_pages,
  };

  return response.json(response_body);
});

categoriesRouter.get('/:id', async (request, response) => {
  const { id } = request.params;

  const categoriesRepository = getRepository(Categories);

  const category = await categoriesRepository.findOne(id);

  return response.json(category);
});

categoriesRouter.put('/:id', async (request, response) => {
  const { id } = request.params;

  const { description } = request.body;

  const updateCategory = new UpdateCategoryService();

  const category = await updateCategory.execute({
    description,
    id,
  });

  return response.json(category);
});

categoriesRouter.delete('/:id', async (request, response) => {
  const id = request.params;

  const categoriesRepository = getRepository(Categories);

  await categoriesRepository.delete(id);

  return response.send();
});

export default categoriesRouter;
