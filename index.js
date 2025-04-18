const connectToMongo = require('./db').default;
const express = require('express');

const startServer = async () => {
  await connectToMongo(); 
  
  const app = express();
  const port = 3000;

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
  });
};

startServer();