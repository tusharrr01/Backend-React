const connectToMongo = require('./db').default;
const express = require('express');

const startServer = async () => {
  await connectToMongo(); 
  
  const app = express();
  const port = 3000;

  // app.get('/', (req, res) => {
  //   res.send('Hello World!');
  // });
  
  // Available routes
  app.use('/api/auth', require('./routes/auth'))
  app.use('/api/notes', require('./routes/notes'))

  app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
  });
};

startServer();