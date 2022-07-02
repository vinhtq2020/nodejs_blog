import { Application } from 'express';
import { ApplicationContext } from '../context';

export function courseRoute(app: Application, context: ApplicationContext): void {
    app.get('/courses', context.courseController.index);
    app.get('/courses/create', context.courseController.create);
    app.get('/courses/:id/edit', context.courseController.edit);
    app.get('/courses/:slug', context.courseController.show);
    app.put('/courses/:id', context.courseController.update);
    app.post('/courses', context.courseController.insert);
    app.delete('/courses/:id', context.courseController.delete);
}
