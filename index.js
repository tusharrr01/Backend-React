import connectToMongo from './db.js';
import express, { json } from 'express';
import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';

const startServer = async () => {
  await connectToMongo(); 
  
  const app = express();
  const port = 5000;

  // app.get('/', (req, res) => {
  //   res.send('Hello World!');
  // });
  
  app.use(json())
  // Available routes
  app.use('/api/auth',authRoutes)
  app.use('/api/notes',notesRoutes)

  app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
  });
};

startServer();