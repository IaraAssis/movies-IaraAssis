import { Request, Response } from "express";
import { client } from "./database";
import { QueryConfig } from "pg";
import format from "pg-format";
import { IMovies } from "./interfaces";


export const getMoviesById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const queryString = `SELECT * FROM movies WHERE id = $1;`

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }
    const data = await client.query(queryConfig);

    return res.status(200).json(data.rows[0]);
}


export const getListMovies = async (req: Request, res: Response) => {

    let queryString = `SELECT * FROM movies;`;
    let query = null;
    const values = [];

    if (req.query.category) {
        queryString = `SELECT * FROM movies WHERE category ILIKE $1;`;
        values.push(req.query.category);

        const queryConfig: QueryConfig = { 
            text: queryString,
            values,
        }
        query = await client.query(queryConfig);
    }

    if (query?.rowCount) {
        return res.status(200).json(query.rows);
    }

    queryString = `SELECT * FROM movies;`
    query = await client.query(queryString);
    return res.status(200).json(query.rows);

}


export const createMovies = async (req: Request, res: Response): Promise<Response> => {

    const newMovies: Omit<IMovies, 'id'> = {
        name: req.body.name,
        category: req.body.category,
        duration: req.body.duration,
        price: req.body.price
    }
    const query = format(`INSERT INTO movies (%I) VALUES (%L) RETURNING *;`,Object.keys(newMovies), Object.values(newMovies));

    const data = await client.query(query);
    console.log(data.rows[0])
    return res.status(201).json(data.rows[0]);
}

export const updateMovies = async (req: Request, res: Response) => {
    const { id } = req.params;

    const query = format(
        `UPDATE movies SET (%I) = ROW(%L) WHERE id = (%L) RETURNING *;`,
        Object.keys(req.body), 
        Object.values(req.body), 
        id 
    );
    
    const data = await client.query(query);

    return res.status(200).json(data.rows[0]);

}


export const deleteMovies = async (req: Request, res: Response) => {
    const { id } = req.params;

    const queryString = `DELETE FROM movies WHERE id = $1;`
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [req.params.id]
    }

    await client.query(queryConfig);

    return res.status(204).json()
}