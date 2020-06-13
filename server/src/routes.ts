import express  from 'express';
import PointsController from './app/controllers/PointsController';
import ItemsController from './app/controllers/ItemsController'
import multer from 'multer';
import { storage, fileFilter} from  './config/multer';
import { celebrate} from 'celebrate'
import { ValidatePoint } from './validations/points';
import { CelebrateConfig } from "./config/celebrate";

export const v1 = express.Router();
const upload = multer({storage, fileFilter});

const pointsController = new PointsController();
const itemsController = new ItemsController();


v1.get('/items', itemsController.index);

v1.get('/points', pointsController.index);
v1.get('/points/:id', pointsController.show);

v1.post('/points', upload.single('image'), celebrate(ValidatePoint, CelebrateConfig), 
pointsController.create);
