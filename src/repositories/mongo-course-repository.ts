import { rejects, throws } from 'assert';
import { log } from 'console';
import { Collection, Db, DeleteResult, ObjectId } from 'mongodb';
import { resolve } from 'path';
import { Attributes, build } from '../lib/metadata';
import { Course, courseModel } from '../models/course';
export interface CourseRepository {
    load(id: string): Promise<Course>;
    all(): Promise<Course[]>;
    loadBySlug(slug: string): Promise<Course>;
    insert(obj: Course, id?: string): Promise<boolean>;
    metadata(): Attributes;
    update(obj: Course): Promise<number>;
    delete(id: string): Promise<number>;
}

export class MongoCourseRepository implements CourseRepository {
    private collection: Collection;
    private id?: string; // id's metadata
    private isObjectId?: boolean;
    private attributes: Attributes;
    constructor(db: Db, collectionName: string, courseModal: Attributes) {
        this.collection = db.collection(collectionName);
        const meta = build(courseModal);

        this.id = meta.id;
        this.isObjectId = meta.isObjectId;
        this.attributes = courseModal;
    }
    async insert(obj: Course): Promise<boolean> {
        try {
            obj = this.revertOne(obj, this.id);
            const value = await this.collection.insertOne(obj);
            obj = this.mapOne(obj, this.id);
            return value.acknowledged;
        } catch (err) {
            throw err;
        }
    }

    async load(id: string): Promise<Course> {
        const query: any = { _id: this.isObjectId === true ? new ObjectId('' + id) : '' + id };
        const findOne = new Promise<Course>((resolve, reject) => {
            this.collection.findOne(query, (err, value) => {
                if (err) reject(err);
                resolve(this.mapOne(value, this.id));
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

    async update(obj: Course): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            if (obj.id) {
                this.revertOne(obj, this.id);
            }
            if (!(obj as any)['_id']) {
                return reject(
                    new Error('object cannot be updated because not having _id field:' + JSON.stringify(obj)),
                );
            }
            this.collection.findOneAndReplace({ _id: (obj as any)['_id'] }, obj, (error, result) => {
                this.mapOne(result, this.id);
                if (error) return reject(error);
                if (result && result.lastErrorObject) {
                    return resolve(result.lastErrorObject.n);
                } else {
                    return resolve(result && result.ok ? result.ok : 0);
                }
            });
        });
    }
    metadata() {
        return this.attributes;
    }
    async delete(id: string): Promise<number> {
        const query = { _id: this.isObjectId ? 'Object(' + id + ')' : '' + id };
        console.log(query);

        return new Promise<number>((resolve, reject) => {
            this.collection.deleteOne(query, (error, result) => {
                if (error) reject(error);
                result && resolve(result.deletedCount);
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
