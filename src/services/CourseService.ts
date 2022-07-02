import { Db } from 'mongodb';
import { Attributes } from '../lib/metadata';
import { ChangeToSlug } from '../lib/slug';
import { Course, courseModel } from '../models/course';
import { CourseRepository, MongoCourseRepository } from '../repositories/mongo-course-repository';

export interface CourseService {
    load(id: string): Promise<Course>;
    all(): Promise<Course[]>;
    loadBySlug(slug: string): Promise<Course>;
    insert(obj: Course): Promise<boolean>;
    metadata(attrs: Attributes): Attributes;
    update(obj: Course): Promise<number>;
    delete(id: string): Promise<number>;
}

export class CourseService implements CourseService {
    constructor(private repository: CourseRepository) {
        this.loadBySlug = this.loadBySlug.bind(this);
        this.all = this.all.bind(this);
    }
    load(id: string): Promise<Course> {
        return this.repository.load(id);
    }
    all(): Promise<Course[]> {
        return this.repository.all();
    }
    loadBySlug(slug: string): Promise<Course> {
        return this.repository.loadBySlug(slug);
    }
    insert(obj: Course): Promise<boolean> {
        return this.repository.insert(obj);
    }
    metadata(): Attributes {
        return this.repository.metadata();
    }
    update(obj: Course): Promise<number> {
        return this.repository.update(obj);
    }
    delete(id: string): Promise<number> {
        return this.repository.delete(id);
    }
}

export function useCourseService(db: Db): CourseService {
    const repository = new MongoCourseRepository(db, 'courses', courseModel);
    return new CourseService(repository);
}
