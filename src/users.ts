import { NextFunction, Request, Response } from 'express';
// import UserModel from './models/userModel';

// let userCache: UserModel[] = [];

// export function getCache(): UserModel[] {
//   return userCache;
// }

// export function addToCache(userModel: UserModel): void {
//   userCache.push(userModel);
// }

// export function deleteFromCache(userName: string): void {
//   userCache = userCache.filter((user) => user.userName !== userName);
// }

// Function to check login state of a user and redirect if necessary.
// eslint-disable-next-line import/prefer-default-export
export function checkUser(req: Request, res: Response, next: NextFunction): void {
  if (req.session) {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/login');
    }
  }
}
