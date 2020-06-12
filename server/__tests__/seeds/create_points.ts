import Knex from 'knex';

export async function seed(knex: Knex){
 await knex('points').insert([
    {
      name: 'padaria teste', 
      email: 'email@teste.com', 
      whatsapp: '+552299999999', 
      latitude: -23.768123, 
      longitude: -23.8172390, 
      city: 'testolandia', 
      uf: 'JR',
      image:''
    }
  ])
}