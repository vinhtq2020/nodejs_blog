import { Db } from 'mongodb';
import { Course, courseModel } from '../models/course';
import { CourseRepository, MongoCourseRepository } from '../repositories/mongo-course-repository';

export interface CourseService {
    load(id: string): Promise<Course>;
    all(id: string): Promise<Course[]>;
    loadBySlug(slug: string): Promise<Course>;
}

export class CourseService implements CourseService {
    constructor(private repository: CourseRepository) {}
    load(id: string): Promise<Course> {
        return this.repository.load(id);
    }
    all(): Promise<Course[]> {
        return this.repository.all();
    }
    loadBySlug(slug: string): Promise<Course> {
        return this.repository.loadBySlug(slug);
    }
}

export function useCourseService(db: Db): CourseService {
    const repository = new MongoCourseRepository(db, 'courses', courseModel);
    return new CourseService(repository);
}
