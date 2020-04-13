import ReviewCollectionModel from '../src/models/ReviewCollectionModel';
import { initDb } from '../src/db';

describe('get reviews', () => {
  beforeAll(async (done) => {
    await initDb('booker');
    done();
  });

  it('Page 1 should contain reviews', async () => {
    const model = new ReviewCollectionModel();
    await model.GetReviews(5, 1);
    expect(model.reviews.length).toBeLessThanOrEqual(5);
    expect(model.reviews.length).toBeGreaterThan(0);
  });
});
