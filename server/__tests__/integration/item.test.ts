import request from 'supertest';
import app from '../../src/app';

describe('Items', () => {
  it('should return all items to be collected', async (done) => {
    const response = await request(app)
      .get('/v1/items')
      .send();

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    done();
  })
});