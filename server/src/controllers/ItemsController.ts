import knex from '../database/connection';
import {Request, Response} from 'express';
import { serializeObjects } from "../util/common";

const DB_TABLE = 'items';
class ItemsController{
  async index( request: Request, response:Response ){
    try {
      const items = await knex(DB_TABLE).select('*');

      const serializedItems = serializeObjects(items);
    
      return response.status(200).json({success: true, data: serializedItems});
    } catch (err) {
      return response.status(500).json({success: false, message: err});
    }
  }
}

export default ItemsController