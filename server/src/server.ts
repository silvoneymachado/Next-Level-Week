import express from 'express';
import cors from 'cors';
import routes from './routes';
import path from 'path';
import { errors } from "celebrate";
import swaggerUi from 'swagger-ui-express'
import * as swaggerDocument from './swagger.json'

const app = express();



app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(errors());

app.listen(3333);