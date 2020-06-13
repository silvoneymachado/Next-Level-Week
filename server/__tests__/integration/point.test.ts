import request from 'supertest';
import app from '../../src/app';

const data = {
  'name': 'padaria teste',
  'email': 'email@teste.com', 
  'whatsapp': '+552299999999', 
  'latitude': String(-23.768123), 
  'longitude': String(-23.8172390), 
  'city': 'testolandia', 
  'uf': 'JR', 
  'items': '1,2,5',
}

describe('Points', () => {
  it('should add a new point of collection', async (done) => {
    const response = await request(app)
      .post('/v1/points')
      .send(data);

    expect(response.status).toBe(200);
    done();
  });

  it('should not add a new point of collection, error', async (done) => {
    const data2 = {...data, image: ''};
    const response = await request(app)
      .post('/v1/points')
      .send(data2);

    expect(response.status).toBe(400);
    done();
  });

  it('should return a list of points based on a defined params', async (done) => {
    const response = await request(app)
      .get('/v1/points')
      .query({
        'city': data.city,
        'uf': data.uf,
        'items': data.items
      })
      .send();
    
    expect(response.status).toBe(200);
    expect(response.body.data[0].name).toEqual(data.name);
    done();
  });

  it('should return a point by id', async (done)=> {
    const response = await request(app)
      .get('/v1/points/1')
      .send();

    expect(response.status).toBe(200);
    done();
  });

  it('should not return a point by id, point not found', async (done)=> {
    const response = await request(app)
      .get('/v1/points/99')
      .send();

    expect(response.status).toBe(400);
    done();
  });

});
