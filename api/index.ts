import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import { errorHandler } from './controllers/error.ctrl';
import router from './routes';

const app = express();
app.use(express.json());
app.use(cors());

app.use("/", router);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

export default app