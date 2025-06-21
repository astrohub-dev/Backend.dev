/*import express from 'express';
import { cryptos } from './index.mjs';
const app = express();

const port = 3000;

app.get('/api/crypto/:id', (req, res) => {
   const parsedId = parseInt(req.params.id);
   
   if(parsedId === isNaN) {
    return res.send('The data you entered is not a number');
   }

   const myCrypto = cryptos.find((crypto) => crypto.id === parsedId); 

   if(!(myCrypto)) return res.send('crypto do not exist')

    return res.send(myCrypto)
})

app.listen(port, () => {
    console.log(`Listening to ${port}`)
}) */

/*async function fetchData() {
    try{
        const response = await fetch('http://localhost:3000/api/cryptocurrencies');
        const data = await response.json();
        return console.log(data);
    } catch (error) {
    console.log('unexpected error. Please try again later.', error);
    }
}
fetchData();*/

/*async function postData() {
    try{
    const response = await  fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            "id": "6",
            "username": "Chychy",
            "email": "chy234@gmail.com"
        })
    })

    const data = await response.json();
    console.log(data)
    
    
    } catch (error) {
    console.log('unexpected error. Please try again later.');
    }
}

postData(); */