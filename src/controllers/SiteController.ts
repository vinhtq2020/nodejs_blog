import { Request, Response } from "express";

export class SiteController {
    constructor() { }
    index(req: Request, res: Response) {
        res.render('home')
    }
    search(req: Request, res: Response) {
        res.render('search')
    }
}

export function useSiteController(): SiteController {
    return new SiteController();
}