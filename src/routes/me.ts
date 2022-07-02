import { Application } from 'express';
import { ApplicationContext } from '../context';

export function meRoute(app: Application, context: ApplicationContext): void {
    app.get('/me/stored-courses', context.meController.storedCourses);
}
