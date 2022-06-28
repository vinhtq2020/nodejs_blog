import { NextFunction, Request, Response } from 'express';
import { Db } from 'mongodb';
import { CourseService, useCourseService } from '../services/CourseService';

export class NewController {
    constructor(private service: CourseService) {
        this.index = this.index.bind(this);
    }

    index(req: Request, res: Response, next: NextFunction) {
        this.service
            .all()
            .then((val) => {
                res.render('home', { courses: val });
            })
            .catch(next);
        // res.render('new');
    }
    show(req: Request, res: Response, next: NextFunction) {
        this.service.loadBySlug(req.params.slug).then((val) => {
            res.render('courses/show', { course: val });
        });
    }
}
export function useNewController(db: Db): NewController {
    return new NewController(useCourseService(db));
}
