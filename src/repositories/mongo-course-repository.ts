import { Collection, Db, ObjectId } from 'mongodb';
import { resolve } from 'path';
import { Attributes, build } from '../lib/metadata';
import { Course } from '../models/course';
export interface CourseRepository {
    load(id: string): Promise<Course>;
    all(): Promise<Course[]>;
    loadBySlug(slug: string): Promise<Course>;
}

export class MongoCourseRepository implements CourseRepository {
    private collection: Collection;
    private id?: string;
    private isObjectId?: boolean;
    constructor(db: Db, collectionName: string, courseModal: Attributes) {
        this.collection = db.collection(collectionName);
        this.insert = this.insert.bind(this);
        this.load = this.load.bind(this);
        const meta = build(courseModal);
        this.id = meta.id;
        this.isObjectId = meta.isObjectId;
    }
    async insert(collection: Collection, obj: any, id?: string) {
        try {
            obj = this.revertOne(obj);
            const value = await collection.insertOne(obj);
            obj = this.mapOne(obj, id);
            return value.insertedId;
        } catch (err) {
            throw err;
        }
    }

    async load(id: string): Promise<Course> {
        const query: any = { _id: this.isObjectId === true ? new ObjectId('' + id) : '' + id };
        const findOne = new Promise<Course>((resolve, reject) => {
            this.collection.findOne(query, (err, value) => {
                if (err) reject(err);
                else {
                    resolve(this.mapOne(value, id));
                }
            });
        });
        return findOne;
    }

    async loadBySlug(slug: string): Promise<Course> {
        const query: any = { slug: slug };
        return new Promise<Course>((resolve, reject) => {
            this.collection.findOne(query, (err, obj) => {
                if (err) reject(err);
                else {
                    resolve(this.mapOne(obj, this.id));
                }
            });
        });
    }
    async all(): Promise<Course[]> {
        return new Promise<Course[]>((resolve, reject) => {
            let cursor = this.collection.find({});
            cursor.toArray((err, result) => {
                if (err) reject(err);
                else if (result) resolve(this.mapArray(result, this.id));
            });
        });
    }

    revertOne(obj: any, id?: string) {
        if (id && id.length > 0) {
            obj['_id'] = obj[id];
            delete obj[id];
        }
        return obj;
    }
    mapOne(obj: any, id?: string): any {
        if (!obj || !id) {
            return obj;
        }
        if (id && id.length > 0) {
            obj[id] = obj['_id'];
            delete obj['_id'];
        }
        return obj;
    }
    mapArray(results: Array<any>, id?: string): Course[] {
        if (!results) {
            return results;
        } else {
            for (const obj of results) {
                if (id && id.length > 0) {
                    obj[id] = obj['_id'];
                    delete obj['_id'];
                }
            }
            return results;
        }
    }
}
