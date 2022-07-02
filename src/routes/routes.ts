import { Application } from 'express';
import { ApplicationContext } from '../context';
import { courseRoute } from './courses';
import { meRoute } from './me';
import { newRoute } from './news';
import { siteRoute } from './site';

export function route(app: Application, ctx: ApplicationContext): void {
    newRoute(app, ctx);
    siteRoute(app, ctx);
    courseRoute(app, ctx);
    meRoute(app, ctx);
}
