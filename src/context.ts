import { Db } from 'mongodb';
import { CourseController, useCourseController } from './controllers/CourseController';
import { MeController, useMeController } from './controllers/MeController';
import { NewController, useNewController } from './controllers/NewController';
import { SiteController, useSiteController } from './controllers/SiteController';

export interface ApplicationContext {
    newController: NewController;
    siteController: SiteController;
    courseController: CourseController;
    meController: MeController;
}

export function useContext(db: Db): ApplicationContext {
    const newController = useNewController(db);
    const siteController = useSiteController();
    const courseController = useCourseController(db);
    const meController = useMeController(db);
    return { newController, siteController, courseController, meController };
}
