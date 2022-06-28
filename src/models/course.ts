import { Attributes } from '../lib/metadata';

export interface Course {
    id: string;
    name?: string;
    description?: string;
    image?: string;
    slug?: string;
    videoId?: string;
    createAt?: Date;
    updateAt?: Date;
}

export const courseModel: Attributes = {
    id: {
        key: true,
        required: true,
    },
    name: {
        required: true,
        lenght: 255,
    },
    description: {
        required: true,
        lenght: 255,
    },
    image: {
        required: true,
        lenght: 255,
    },
    slug: {
        required: true,
        lenght: 255,
    },
    videoId: {
        required: true,
        lenght: 255,
    },
    createdAt: {
        type: 'datetime',
    },
    updateAt: {
        type: 'datetime',
    },
};