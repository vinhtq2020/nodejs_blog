import { Request, Response } from "express";

export class NewController {
    constructor() {

    }

    index(req: Request, res: Response) {
        res.render('new')
    }
}
export function useNewController() {
    return new NewController();
}