/* eslint-disable no-underscore-dangle */
/* eslint-disable jest/valid-expect-in-promise */
/* eslint-disable jest/expect-expect */
import supertest from 'supertest';
import expres from 'express';
import server from '../../../src/app';

let app: expres.Application;
let request: supertest.SuperTest<supertest.Test>;
const baseUri = '/api/user';

// Warning this token will revoked (expire)
const authorization_header = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiI0ZmZkMWVhNy0xYjFkLTRhZDYtOTZkNS05MTYzMTUxMjhlNTYiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNjE4YmFiMGYtMjBhNC00ZGUzLWExMGMtZTIwY2VlOTZiYjM1L3YyLjAiLCJpYXQiOjE2MTI3OTY0MzcsIm5iZiI6MTYxMjc5NjQzNywiZXhwIjoxNjEyODAwMzM3LCJuYW1lIjoiRGVpdmVyIEd1ZXJyYSBDYXJyYXNjYWwiLCJub25jZSI6ImQ4Yjk1NTU2LTcyODUtNDhkZS04MzFjLTAxZTU5ZGI5ZjY3ZCIsIm9pZCI6Ijk2NTdlNGExLTRhMGEtNGVmMC1hZGVlLTVlMWUxYjVmNmMxYyIsInByZWZlcnJlZF91c2VybmFtZSI6ImRlaXZlci5ndWVycmEuMjAxN0B1cGIuZWR1LmNvIiwicmgiOiIwLkFBQUFENnVMWWFRZzQwMmhET0lNN3BhN05hY2VfVThkRzlaS2x0V1JZeFVTamxZMEFNby4iLCJzdWIiOiJ2Y0pObUNzMFRPbXU5cnNock4teEJZa2NLaDJka1VMN09vajZZOUxRdUZBIiwidGlkIjoiNjE4YmFiMGYtMjBhNC00ZGUzLWExMGMtZTIwY2VlOTZiYjM1IiwidXRpIjoiZG4zX1hldkRzRTZfSi1XdGw1NFBBQSIsInZlciI6IjIuMCJ9.b_Rrl5e-iKrQWjXsVCmgfaxhGlju8InvCMIrWHhnjZl2z_S3q0EK_EPMYqh5XmX3YNGE28axRZNlmylb7-1ufRJIj48xVOEinqFSx8qYRqVLvO6F4jVhg8x_CTw4REMQQh2bbrnj3AE_r3zUmqXDEEQXJdXLV_lXvzJgm1QgEO3Ji8bBc2ZqYsYzF70YL6M2bYNqeSSg7rMsyBXEeVSneR7fVd8_TAr-JKmVhIm1_oq3y6Wam_pYKKabGAz6TU74gHt2Ht7ZYJoLOxoWp2ZLTDz_ieyWE7dgoB6h6n6HyoHWl4P6tTJJ4z83uvdI9QsZT0qp3Y8iQbdKRmML5PWAfw'

beforeAll(() => {
  app = server.app;
  request = supertest(app);
});

// list
it('should get list users', async () => {
  const response = await request.get(baseUri)
  .set('Authorization', authorization_header);
  expect(response.status).toBe(200);
  expect(response.body).toBeInstanceOf(Array);
});


// get by id
describe('should get user by id', () => {
  it('should response with 200 status', async () => {
    const id = '6020287d9fdf5e756921a923'; // verify that this id exist in your database
    const response = await request.get(`${baseUri}/${id}`)
    .set('Authorization', authorization_header);
    expect(response.status).toBe(200);
  });

  it('should response with 404 status', async () => {
    const id = '5fe0287346956c638f701222';
    const response = await request.get(`${baseUri}/${id}`)
    .set('Authorization', authorization_header);
    expect(response.status).toBe(404);
    expect(response.body.username).toBeUndefined();
  });
});

// update
describe('should update a user', () => {
  it('should update with 200 status', async () => {
    const id: string = '6020287d9fdf5e756921a923'; // verify that this id exist in your database
    const user = { 
      username: 'user update with test', 
      email: `test@${Math.random().toString(5)}.com`,
      oaid: Math.random().toString(30)
    };
    
    const response = await request.put(`${baseUri}/${id}`)
      .set('Authorization', authorization_header)
      .send(user);
    expect(response.status).toBe(200);
    expect(response.body.username).toEqual(user.username);
  });

  it('should fail with 404 status', async () => {
    const id = '5fe0287346956c638f701bd2';
    const response = await request.put(`${baseUri}/${id}`)
      .set('Authorization', authorization_header)
      .send({ username: 'user update with test', email: `test@${Math.random().toString(5)}.com`});
    expect(response.status).toBe(404);
    expect(response.body.username).toBeUndefined();
  });
});

// remove
describe('should remove a user', () => {
  it('should fail with 404 status', async () => {
    const id = '5fe0287346956c638f701bd2';
    const response = await request.delete(`${baseUri}/${id}`)
    .set('Authorization', authorization_header);
    expect(response.status).toBe(404);
    expect(response.body.username).toBeUndefined();
  });
});
