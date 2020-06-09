import express  from 'express';
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController'
import multer from 'multer';
import { storage, fileFilter} from  './config/multer';
import { celebrate} from 'celebrate'
import { ValidatePoint } from './validations/points';
import { CelebrateConfig } from "./config/celebrate";

const routes = express.Router();
const upload = multer({storage, fileFilter});

const pointsController = new PointsController();
const itemsController = new ItemsController();



routes.get('/items', itemsController.index);

routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

routes.post('/points', upload.single('image'), celebrate(ValidatePoint, CelebrateConfig), 
pointsController.create);

export default routes;