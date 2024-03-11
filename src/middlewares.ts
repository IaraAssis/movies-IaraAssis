import { NextFunction, Request, Response, query } from "express";
import { client } from "./database";
import format from "pg-format";


export const checkMovieNameExists = async (req: Request, res: Response, next: NextFunction) => {

    const query = format(`SELECT * FROM movies WHERE name = %L;`, req.body.name)
    const data = await client.query(query);

    if(data.rows[0]) {
        return res.status(409).json({message: "Movie name already exists!"})
    }

    next();

};

export const checkMovieIdExists = async (req: Request, res: Response, next: NextFunction) => {

    const query =`SELECT * FROM movies WHERE id = $1;`

    const data = await client.query(query, [req.params.id]);

    if (!data.rows[0]) {
        return res.status(404).json({ message: "Movie not found!" });
    }
    
    res.locals.movies = data.rows[0];


    next();

};






