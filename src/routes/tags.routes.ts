import { Router } from 'express';
import { getRepository } from 'typeorm';

import { generateLikeQueryBuilder } from '../utils/generateLikeQuery';

import Tags from '../models/Tags';
import CreateTagService from '../services/tags/CreateTagService';
import UpdateTagService from '../services/tags/UpdateTagService';
import AppError from '../error/AppError';

const tagsRouter = Router();

tagsRouter.post('/', async (request, response) => {
  const { description } = request.body;

  const createTag = new CreateTagService();

  const tag = await createTag.execute({
    description,
  });

  return response.status(201).json(tag);
});

tagsRouter.get('/', async (request, response) => {
  interface ObjectTypes {
    [key: string]: any;
  }

  const { page = 1, per_page = 10, ...q } = request.query;

  const query_params: ObjectTypes = q;

  const where_query = generateLikeQueryBuilder(query_params);

  const tagRepository = getRepository(Tags);

  const skip: number = page === 1 ? 0 : (Number(page) - 1) * Number(per_page);

  const tags = await tagRepository
    .createQueryBuilder('tags')
    .where(where_query as string)
    .take(per_page as number)
    .skip(skip as number)
    .getMany()
    .then((response) => response)
    .catch((error) => {
      throw new AppError(error, 500);
    });

  const total_tags = await tagRepository
    .createQueryBuilder('tags')
    .where(where_query as string)
    .getCount();

  const total_pages = Math.ceil(total_tags / Number(per_page));

  const response_body = {
    data: tags,
    total: total_tags,
    per_page,
    total_pages,
  };

  return response.json(response_body);
});

tagsRouter.get('/:id', async (request, response) => {
  const { id } = request.params;

  const tagRepository = getRepository(Tags);

  const tag = await tagRepository.findOne(id);

  return response.json(tag);
});

tagsRouter.put('/:id', async (request, response) => {
  const { id } = request.params;

  const { description } = request.body;

  const updateTag = new UpdateTagService();

  const tag = await updateTag.execute({
    description,
    id,
  });

  return response.json(tag);
});

tagsRouter.delete('/:id', async (request, response) => {
  const id = request.params;

  const tagRepository = getRepository(Tags);

  await tagRepository.delete(id);

  return response.send();
});

export default tagsRouter;
