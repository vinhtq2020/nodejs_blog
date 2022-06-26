import { NewController, useNewController } from "./controllers/NewController"
import { SiteController, useSiteController } from "./controllers/SiteController";

export interface ApplicationContext {
    newController: NewController;
    siteController:SiteController;
}

export function useContext(): ApplicationContext {
    const newController = useNewController();
    const siteController = useSiteController();
    return { newController,siteController}
}