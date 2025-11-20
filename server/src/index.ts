import express from 'express';
import cors from 'cors';

import sensors from './routes/sensors';
import mobile from './routes/interface';

const PORT = process.env.PORT || 8008;


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/sensor', sensors);
app.use('/api/interface', mobile);

app.listen(PORT, async () => {
    console.log(`App listening on ${PORT}`);
});