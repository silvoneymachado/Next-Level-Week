import knex from '../database/connection';
import {Request, Response} from 'express';

const DB_TABLE = 'points';

class PointsController{

  async index(request: Request, response: Response){
    const { city, uf, items } = request.query;

    const parsedItems = String(items)
      .split(',')
      .map((item: string) => Number(item.trim()));
    
      
    const points = await knex(DB_TABLE)
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    return response.status(200).json({success: true, data: points});
  }

  async show(request: Request, response: Response){
    const { id } = request.params;

    const point = await knex(DB_TABLE).where('id', id).first();

    if(!point){
      return response.status(400).json({success: false, message: 'Point not found'});
    }

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    return response.status(200).json({success: true, data: {point, items}})
  }

  async create(request: Request, response: Response) {
    const {
      name, email, whatsapp, latitude, longitude, city, uf, items
    } = request.body;

    const point = {
      image:'image-fake', name, email, whatsapp, latitude, longitude, city, uf
    }
  
    const trx = await knex.transaction();
  
    const insertedIds = await trx(DB_TABLE).insert(point); 
  
    const point_id = insertedIds[0];
  
    const pointItems = items.map((item_id: number) => ({
      item_id, point_id: point_id
    }));
  
    await trx('point_items').insert(pointItems);

    await trx.commit();
  
    return response.status(200).json({success: true, data:{
      ...point,
      id: point_id
    }});
  }
}

export default PointsController