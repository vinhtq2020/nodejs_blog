import { Application } from "express";
import { ApplicationContext } from "../context";
import { newRoute } from "./news";
import { siteRoute } from "./site";

export function route(app:Application, ctx:ApplicationContext):void{
    newRoute(app,ctx);
    siteRoute(app,ctx);
}