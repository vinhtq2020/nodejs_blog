import { Request, Response } from 'express';
import { Db } from 'mongodb';
import { CourseService, useCourseService } from '../services/CourseService';

export class MeController {
    constructor(private service: CourseService) {
        this.storedCourses = this.storedCourses.bind(this);
    }
    storedCourses(req: Request, res: Response) {
        this.service.all().then((data) => {
            res.render('me/stored-courses', { courses: data });
        });
    }
}

export function useMeController(db: Db): MeController {
    return new MeController(useCourseService(db));
}
