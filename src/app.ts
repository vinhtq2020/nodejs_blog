import express from 'express';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import path from 'path';
import { useContext } from './context';
import { route } from './routes/routes';
import { connectToDb } from './config/db';
import { merge } from './lib/merge';
import { config } from './config';

dotenv.config();

const conf = merge(config, process.env);

const app = express();

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// HTTP logger
app.use(morgan('combined'));

// Template engine
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

connectToDb(conf.mongo.uri, conf.mongo.db)
    .then((db) => {
        const context = useContext(db);
        route(app, context);
        app.listen(conf.port, () => console.log(`listening at port ${conf.port}`));
    })
    .catch((err) => {
        console.log('cannot connect to mongodb: ', err);
    });
