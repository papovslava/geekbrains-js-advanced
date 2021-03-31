const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server is runnging on port ${port}`);
});


app.get('/products', (req, res) => {
  fs.readFile('./products.json', 'utf-8', (err, data) => {
    if(!err) {
      res.end(data);
    } else {
        console.log(err);
        res.end(JSON.stringify(err));
    }
  });
});


app.post('/products', (req, res) => {  
  fs.readFile('./products.json', 'utf-8', (err, data) => {
    if (!err) {
      const products = JSON.parse(data);

      const id = products.reduce((acc, product) => acc > product.id ? acc : product.id, 0) + 1;

      products.push({
        id: id,
        title: req.body.title,
        price: req.body.price
      });

      fs.writeFile('./products.json', JSON.stringify(products), err => {
        if(!err) {
            res.end();
        }  else {
            console.log(err);
            res.end(JSON.stringify(err));
        }
      });
    } else {
        console.log(err);
        res.end(JSON.stringify(err));
    }    
  });
});


app.get('/cart', (req, res) => {
  fs.readFile('./cart.json', 'utf-8', (err, data) => {
      if(!err) {  
          res.end(data);
      } else {
          console.log(err);
          res.end(JSON.stringify(err));
      }
  })
});


app.post('/cart', (req, res) => {
  fs.readFile('./cart.json', 'utf-8', (err, data) => {
     if(!err) {
         const cart = JSON.parse(data);
         cart.push(req.body);
         console.log(req.body);

         fs.writeFile('./cart.json', JSON.stringify(cart), (err) => {
              if(!err) {
                updateStats('NEW PRODUCT IN CART', req.body);
                  res.end();
              }  else {
                  console.log(err);
                  res.end(JSON.stringify(err));
              }
         });
      } else {
          console.log(err);
          res.end(JSON.stringify(err));
      }
  })
});


app.delete('/cart', (req, res) => {
  fs.readFile('./cart.json', 'utf-8', (err, data) => {
     if(!err) {
         const cart = JSON.parse(data);
         const productIndex = cart.findIndex((item) => item.id == req.body.id);

         cart.splice(productIndex - 1, 1);
         console.log('delete', req.body);

         fs.writeFile('./cart.json', JSON.stringify(cart), (err) => {
              if(!err) {
                updateStats('DELETE PRODUCT FROM CART', req.body);
                res.end();
              }  else {
                  console.log(err);
                  res.end(JSON.stringify(err));
              }
         });
      } else {
          console.log(err);
          res.end(JSON.stringify(err));
      }
  })
});


function updateStats(action, product) {
  const fileName = './stats.json';
  let stats = require(fileName);
      
  stats.push({
    timestamp: new Date(),
    action: action,
    product: product
  });

  fs.writeFile(fileName, JSON.stringify(stats, null, 2), (err) => {
      if(err) {
          console.error(err);
      }
  });

};