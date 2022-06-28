import { Application } from 'express';
import { ApplicationContext } from '../context';

export function courseRoute(app: Application, context: ApplicationContext): void {
    app.get('/courses/:slug', context.courseController.index);
}
