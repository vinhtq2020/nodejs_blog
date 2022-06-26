import { Application } from "express";
import { ApplicationContext } from "../context";

export function siteRoute(app:Application,ctx:ApplicationContext){
    app.get('/home',ctx.siteController.index);
    app.get('/search',ctx.siteController.search);
}