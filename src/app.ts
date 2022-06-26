import express from "express";
import * as dotenv from "dotenv";
import morgan from "morgan";
import { engine } from "express-handlebars";
import path from "path";
import { useContext } from "./context";
import { route } from "./routes/routes";

dotenv.config();
const config = process.env;

const app = express();

app.use(express.static('public'));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

// HTTP logger
app.use(morgan('combined'));

// Template engine
app.engine('hbs', engine({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// app.get('/', (req, res) => {
//     res.render('home');
// });
// app.get('/search',(req,res)=>{
//     res.render('search');
// })
// app.post('/search',(req,res)=>{
//     console.log(req.body);
    
// })

const context = useContext();
route(app,context);
app.listen(config.port, () => console.log(`listening at port ${config.port}`))