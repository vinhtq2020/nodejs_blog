import { Application } from "express";
import { ApplicationContext } from "../context";

export function newRoute(app:Application,ctx:ApplicationContext){
    app.get('/new',ctx.newController.index);
}