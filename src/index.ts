import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import fileUpload from 'express-fileupload';
import movieRouter from "./routers/movieRouter";
import genreRouter from "./routers/genreRouter";
import actorRouter from "./routers/actorRouter";
import characterRouter from "./routers/characterRouter";
import authRouter from "./routers/authRouter";
import userRouter from "./routers/userRouter";
import searchRouter from "./routers/searchRouter";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use(authRouter);
app.use(movieRouter);
app.use(genreRouter);
app.use(actorRouter);
app.use(characterRouter);
app.use(userRouter);
app.use(searchRouter);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
