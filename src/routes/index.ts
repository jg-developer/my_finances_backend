import { Router } from 'express';
import cors from 'cors';

import tags from './tags.routes';
import categories from './categories.routes';
import accounts from './accounts.routes';
import creditCardBrand from './creditCardBrand.routes';
import creditCard from './creditCard.routes';

const routes = Router();

routes.use(cors());

routes.use('/tags', tags);
routes.use('/categories', categories);
routes.use('/accounts', accounts);
routes.use('/credit_card_brand', creditCardBrand);
routes.use('/credit_card', creditCard);

export default routes;
