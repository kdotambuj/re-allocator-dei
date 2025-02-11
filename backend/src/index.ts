import express, {Express,Request,Response} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.route'
import authRoutes from './routes/auth.route'
import departmentRoutes from './routes/department.route'
import resourceRoutes from './routes/resource.route'
import ticketRoutes from './routes/ticket.route'
import approavalRoutes from './routes/approval.route'

dotenv.config()

const app:Express = express();
const PORT = process.env.PORT || 8000

const corsOptions = {
    origin: ['http://localhost:3000', 'https://re-allocator-dei.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH','DELETE','OPTIONS'], 
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
    credentials: true, 
};


app.use(cors(corsOptions));
app.use(express.json()) 
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); 

// api routes
app.use('/api/v1',userRoutes)
app.use('/api/v1',authRoutes)
app.use('/api/v1',departmentRoutes)
app.use('/api/v1',resourceRoutes)
app.use('/api/v1',ticketRoutes)
app.use('/api/v1',approavalRoutes)

app.options("*", cors()); // Allow all OPTIONS preflight requests


app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})


app.get('/',(req:Request,res:Response)=>{
    res.send('Backend Is Running')
})
