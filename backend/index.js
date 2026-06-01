import express from 'express';
import dotenv from 'dotenv';
import aiRoutes from './src/routes/ai.routes.js'
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}))

app.use(express.json());

app.use("/api/ai", aiRoutes)

app.get('/', (req, res)=>{
    res.send("Server is running 🚀");
})



const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`Server is running on PORT: ${PORT}`);
})