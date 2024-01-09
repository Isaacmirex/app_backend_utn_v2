import { Router } from 'express';
import { getAssignmentsModules} from '../controllers/getmodules.js';
import { verifyToken } from '../middlewares/auth.jwt.js';

const getmRouter = Router();

getmRouter.get('/',verifyToken, getAssignmentsModules);

export { getmRouter };