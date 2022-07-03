import { Attributes } from '../lib/metadata';

export interface Course {
    id: string;
    name?: string;
    description?: string;
    image?: string;
    slug?: string;
    videoId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export const courseModel: Attributes = {
    id: {
        key: true,
        lenght: 40,
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
        lenght: 255,
    },
    videoId: {
        required: true,
        lenght: 255,
    },
    createdAt: {
        type: 'datetime',
    },
    updatedAt: {
        type: 'datetime',
    },
    deletedAt: {
        type: 'datetime',
    },
    deleted: {
        type: 'boolean',
    },
};
