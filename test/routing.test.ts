import app from '../src/app';
/* eslint-disable */
import session from 'supertest-session';
import { initDb } from '../src/db';
import request from 'supertest';

beforeAll(() => initDb("booker"));

describe('If a user is not logged in then route', () => {
  let agent = request.agent(app);
  it('Login page should be accessible', () => agent
    .get('/login')
    .expect(200));

  it('Home should redirect to login', () => {
    agent.get('/')
      .expect(302)
      .expect('Location', '/login');
  });

  it('addBook should redirect to login', () => {
    agent.get('/addBook')
      .expect(302)
      .expect('Location', '/login');;
  });

  it('catalogue should redirect to login', () => {
    agent.get('/catalogue')
      .expect(302)
      .expect('Location', '/login');;
  });

  it('collections should redirect to login', () => {
    agent.get('/collections')
      .expect(302)
      .expect('Location', '/login');;
  });

  it('collection should redirect to login', () => {
    agent.get('/collection')
      .expect(302)
      .expect('Location', '/login');;
  });

  it('reviews should redirect to login', () => {
    agent.get('/reviews')
      .expect(302)
      .expect('Location', '/login');;
  });

  it('addReview should redirect to login', () => {
    agent.get('/addReview')
      .expect(302)
      .expect('Location', '/login');;
  });

  it('admin should redirect to login', () => {
    agent.get('/admin')
      .expect(302)
      .expect('Location', '/login');;
  });

  it('logout should redirect to login', () => {
    agent.get('/logout')
      .expect(302)
      .expect('Location', '/login');;
  });
});

