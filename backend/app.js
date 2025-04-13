import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRouter from './routers/AuthRouter.js'
import { connectDatabase } from './connections/DB.js'

dotenv.config()

// Connect to database
connectDatabase()

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5473", credentials: true }));


app.use('/api/auth', authRouter)

app.listen(PORT, ()=> {
    console.log(`Server listening at http://localhost:${PORT}`);
    
})