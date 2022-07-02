import { NextFunction, Request, Response } from 'express';
import { Db } from 'mongodb';
import { Attributes } from '../lib/metadata';
import { ChangeToSlug } from '../lib/slug';
import { validate } from '../lib/validate';
import { Course } from '../models/course';
import { CourseService, useCourseService } from '../services/CourseService';

export class CourseController {
    metadata: Attributes;
    constructor(private service: CourseService) {
        this.metadata = service.metadata();
        this.index = this.index.bind(this);
        this.create = this.create.bind(this);
        this.insert = this.insert.bind(this);
        this.show = this.show.bind(this);
        this.load = this.load.bind(this);
        this.edit = this.edit.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }
    index(req: Request, res: Response, next: NextFunction) {
        this.service
            .all()
            .then((val) => {
                res.status(200).json(val).end();
            })
            .catch((err) => {
                res.status(500).end(JSON.stringify(err));
            });
    }
    load(req: Request, res: Response, next: NextFunction) {
        this.service
            .load(req.params.id)
            .then((val) => {
                res.status(200).json(val).end();
            })
            .catch((err) => {
                res.status(500).end(JSON.stringify(err));
            });
    }
    show(req: Request, res: Response, next: NextFunction) {
        this.service
            .loadBySlug(req.params.slug)
            .then((val) => {
                res.render('courses/show', { course: val });
            })
            .catch((err) => res.status(500).json(err).end());
    }
    create(req: Request, res: Response, next: NextFunction) {
        res.render('courses/create');
    }
    insert(req: Request, res: Response, next: NextFunction) {
        const obj = req.body;
        if (!obj || obj === '') {
            return res.status(400).end('the request body is empty');
        }
        if (obj.name && !obj.slug) {
            obj.slug = ChangeToSlug(obj.name);
        }
        validate(obj, this.metadata)
            .then((errs) => {
                if (errs && errs.length > 0) {
                    res.status(400).json(errs).end();
                } else {
                    this.service
                        .insert(req.body)
                        .then((result) => {
                            if (result) {
                                // res.status(200).json(result).end();
                                res.redirect('/');
                            } else {
                                res.status(500).end('Internal Server Error');
                            }
                        })
                        .catch((err) => console.log(err));
                }
            })
            .catch((err) => console.log(err));
    }
    edit(req: Request, res: Response, next: NextFunction) {
        this.service
            .load(req.params.id)
            .then((val) => {
                res.render('courses/edit', { course: val });
            })
            .catch(next);
    }
    delete(req: Request, res: Response, next: NextFunction) {
        this.service
            .delete(req.params.id)
            .then((val) => {
                console.log(val);

                res.redirect('back');
            })
            .catch(next);
    }
    update(req: Request, res: Response, next: NextFunction) {
        const obj = req.body;
        if (!obj || obj === '') {
            return res.status(400).end('the request body is empty');
        }
        if (obj.name && !obj.slug) {
            obj.slug = ChangeToSlug(obj.name);
        }
        validate(obj, this.metadata).then((errs) => {
            if (errs && errs.length > 0) {
                return res.status(400).json(errs).end();
            }
            this.service
                .update(obj)
                .then((val) => {
                    if (val) res.redirect('/');
                })
                .catch((err) => console.log(err));
        });
    }
}

export function useCourseController(db: Db): CourseController {
    return new CourseController(useCourseService(db));
}
