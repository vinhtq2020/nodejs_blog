import { Request, Response } from 'express';
import { Db } from 'mongodb';
import { CourseService, useCourseService } from '../services/CourseService';

export class CourseController {
    constructor(private service: CourseService) {
        this.index = this.index.bind(this);
    }
    index(req: Request, res: Response) {
        this.service.loadBySlug(req.params.slug).then((obj) => {
            console.log(obj);

            res.render('courses/show', { course: obj });
        });
    }
}

export function useCourseController(db: Db): CourseController {
    return new CourseController(useCourseService(db));
}
