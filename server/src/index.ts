import express from 'express';
import cors from 'cors';

import sensors from './routes/sensors';
import mobile from './routes/interface';
import plants from './routes/plants';
import { initialize } from './plants/api';
import { init } from './socket/socket';

const PORT = process.env.PORT || 8008;


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/sensor', sensors);
app.use('/api/interface', mobile);
app.use('/api/plants', plants);

app.listen(PORT, async () => {
    initialize();
    init();

    console.log(`App listening on ${PORT}`);
});