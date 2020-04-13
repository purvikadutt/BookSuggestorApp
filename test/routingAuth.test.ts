import app from '../src/app';
/* eslint-disable */
import session from 'supertest-session';
import { initDb } from '../src/db';
import request from 'supertest';
let agent = request.agent(app);

beforeAll(() => initDb('booker'));
describe('After authenticating as a normal user', () => {
  it('login', loginUser('test1'));
  // beforeEach(loginUser('test1'));
  it('addBook should be accessible', () => {
    agent.get('/addBook')
      .expect(200);
  });

  it('addbook should add a book', () => {
    agent.post('/addBook')
      .send({
        title: "Atesttitle",
        author: "JasonParker",
        cover: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/TheWayOfKings.png/220px-TheWayOfKings.png",
        isbn: 123456789,
        synopsis: "HelloWorld!",
      })
      .expect(200);
  });

  it('should display the book information', () => {
    agent.get('/book/5deaf97275b85a4f2ff6c335')
      .expect(200);
  })

  it('home should be accessible', () => {
    agent.get('/')
      .expect(200);
  });

  it('collections should be accessible', () => {
    agent.get('/collections')
      .expect(200);
  });
  
  it('collection should redirect to collections', () => {
    agent.get('/collection')
      .expect(302)
      .expect('Location', '/collections');
  });
  
  it('reviews should be accessible', () => {
    agent.get('/reviews')
      .expect(200);
  });
  
  it('addReview should be accessible', () => {
    agent.get('/addReview')
      .expect(200);
  });
  
  it('addBook should be accessible', () => {
    agent.get('/addBook')
      .expect(200);
  });
  
  it('admin should not be accessible as a normal user', () => {
    agent.get('/admin')
      .expect(403);
  });

});


function loginUser(userName: string) {
return (done: any) => {
    agent.post('/login')
      .send({userName})
      .expect(302)
      .expect('Location', '/catalogue')
      .end(onResponse);

    function onResponse(err:any, res:any) {
    if (err) return done(err);
    return done();
    }
}

}
  