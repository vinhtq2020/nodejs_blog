import { Db } from 'mongodb';
import { CourseController, useCourseController } from './controllers/CourseController';
import { NewController, useNewController } from './controllers/NewController';
import { SiteController, useSiteController } from './controllers/SiteController';

export interface ApplicationContext {
    newController: NewController;
    siteController: SiteController;
    courseController: CourseController;
}

export function useContext(db: Db): ApplicationContext {
    const newController = useNewController(db);
    const siteController = useSiteController();
    const courseController = useCourseController(db);
    return { newController, siteController, courseController };
}
