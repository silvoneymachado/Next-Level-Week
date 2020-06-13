import knex from '../../database/connection';
import {Request, Response} from 'express';
import { serializeObjects } from "../../utils/common";

const DB_TABLE = 'items';

class ItemsController{
  async index( request: Request, response:Response ){
    const items = await knex(DB_TABLE).select('*');

    const serializedItems = serializeObjects(items);
  
    return response.status(200).json({success: true, data: serializedItems});
  }
}

export default ItemsController