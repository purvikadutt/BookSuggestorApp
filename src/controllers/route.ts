
import { Request, Response } from 'express';

/**
     * Constructo
     *
     * @class BaseRoute
     */
export default class BaseRoute {
  protected title: string;

  private scripts: string[];

  /**
         * Constructor
         *
         * @class BaseRoute
         * @constructor
         */
  constructor() {
    // initialize variables
    this.title = 'My New TypeScript Web app';
    this.scripts = [];
  }

  /**
         * Add a JS external file to the request.
         *
         * @class BaseRoute
         * @method addScript
         * @param src {string} The src to the external JS file.
         * @return {BaseRoute} Self for chaining
         */
  public addScript(src: string): BaseRoute {
    this.scripts.push(src);
    return this;
  }

  /**
         * Render a page.
         *
         * @class BaseRoute
         * @method render
         * @param req {Request} The request object.
         * @param res {Response} The response object.
         * @param view {String} The view to render.
         * @param options {Object} Additional options to append to the view's local scope.
         * @return void
         */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public render(req: Request, res: Response, view: string, options?: Record<string, any>): void {
    // add constants
    res.locals.BASE_URL = '/';

    // add scripts
    res.locals.scripts = this.scripts;

    // add title
    res.locals.title = this.title;

    // render view
    res.render(view, options);
  }
}
