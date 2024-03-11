import express, { Request, Response } from "express";
import { connectDataBase, creatDatabaseTable } from "./database";

import { createMovies, deleteMovies, getListMovies, getMoviesById, updateMovies} from "./logic";
import { checkMovieIdExists, checkMovieNameExists } from "./middlewares";

const app = express();

app.use(express.json());

app.post("/movies", checkMovieNameExists, createMovies);
app.get("/movies", getListMovies);
app.get("/movies/:id", checkMovieIdExists, getMoviesById )
app.patch("/movies/:id",checkMovieIdExists,checkMovieNameExists, updateMovies )
app.delete("/movies/:id",checkMovieIdExists, deleteMovies)

const PORT = process.env.PORT;

app.listen(PORT, async () => {
    console.log(`Server started on port ${PORT}`);
    await connectDataBase();
    await creatDatabaseTable();
});