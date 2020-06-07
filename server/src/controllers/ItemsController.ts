import knex from '../database/connection';
import {Request, Response} from 'express';

class ItemsController{
  async index( request: Request, response:Response ){
    try {
      const items = await knex('items').select('*');

      const serializedItems = items.map(item => ({ 
        id: item.id, 
        title: item.title, 
        image_url: `http://localhost:3333/uploads/${item.image}`
      }))
    
      return response.status(200).json({success: true, data: serializedItems});
    } catch (err) {
      return response.status(500).json({success: false, message: err});
    }
  }
}

export default ItemsController