/*for(i = 1; i <= 100; i++) {

    if((i % 3 === 0) && (i % 5 === 0)) {
        console.log('FizzBuzz');
    }

    else if(i % 3 === 0) {
        console.log('Fizz');
    }

    else if(i % 5 === 0) {
        console.log('Buzz')
    }

    else {
        console.log(i)
    }
}*/

/*const xhr = new XMLHttpRequest();

xhr.addEventListener('load', () => {
    console.log(xhr.response);
})

xhr.open('GET', 'https://supersimplebackend.dev/greeting');
xhr.send(); 

fetch('https://supersimplebackend.dev/greeting').then((response) => {
    return response.text();
}).then((text) => {
    console.log(text)
});

async function displayText() {
  const response = await fetch('https://supersimplebackend.dev/greeting');
  const text = await response.text();
  console.log(text);
}
displayText();*/

async function displayName() {
    const response = await fetch('https://supersimplebackend.dev/greeting', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            name: "Ndubuisi Ugwuja"
        })     
    })

    const text = await response.text();
    console.log(text);
}

displayName();

async function displayData() {
    try{
        const response = await fetch('https://amazon.com');
        const data = await response.json();
        console.log(data);
    } catch(error) {
        console.log('CORS error. Your request was blocked by the backend');
    }

}

displayData();

//MIDDLEWARE FUNCTIONS:


const myMiddleware = (req, res, next) => {
    console.log(`This is the request method used: ${req.method}`);
    console.log(`This is the request body: ${req.body}`);
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/api/cryptocurrencies');
    next();
}

const myMiddleware2 = (req, res, next) => {
    if(req.method === 'GET') {
        console.log('access granted');
    }

    else{
        console.log('access blocked');
    }
    next();
}

//WE CAN GROUP A SET OF MIDDLEWARES USING ARRAY AND REUSE THE ARRAY NAME IN OUR CODE

const middlewares = [myMiddleware, myMiddleware2];

app.get("/api/cryptocurrencies", middlewares, (req, res) => {
    res.send(cryptos)
});

app.get("/api/cryptocurrencies/:id", resolveIndexByUserId, (req, res) => {
    const {findUserIndex} = req;
    const findCrypto = cryptos[findUserIndex]
    if(!findCrypto) return res.sendStatus(404);
    return res.status(200).send(findCrypto);
});

//app.use(middlewares) only registers the middleware globally to endpoints that comes after it

app.post("/api/cryptocurrencies", /*body('wallet address').isEthereumAddress().withMessage('The address provided is not an Ethereum address'),*/ middlewares, (req, res) => {
    const result = validationResult(req);
    console.log(result);
    const {body} = req;
    const newCrypto = { id: cryptos[cryptos.length - 1].id + 1, ...body};
    console.log(newCrypto);

    res.status(201).send(cryptos.push(newCrypto));
})

/*app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/api/cryptocurrencies'); // Add the header
    next();
});*/

//COOKIES, SESSION AND AUTHENTICATION
app.get("/", (req, res) => {
    console.log(req.session);
    console.log(req.session.id);
    req.session.visited = true;
    res.cookie("myCookie", "thisCookie", { maxAge: 60000 * 60, signed: true });
    res.status(200).send({ msg: 'Root fetched'});
})

app.post("/api/auth", (req, res) => {
    const { body: {username, password} } = req;

    const findUser = users.find((user) => user.username === username);
    if(!findUser || findUser.password !== password) return res.status(401).send({ msg: 'Bad credentials'});

    req.session.user = findUser;
    console.log(req.session)
    console.log(req.sessionID)
    return res.status(201).send(findUser);
});

app.get("/api/auth/status", (req, res) => {
    req.sessionStore.get(req.sessionID, (err, session) => {
        console.log(session);
    });
    return req.session.user 
        ? res.status(200).send(req.session.user) 
        : res.status(401).send({ msg: 'Not authenticated'})
});

app.post("/api/cart", (req, res) => {
    if(!req.session.user) return res.sendStatus(401);
    
    const { body: item } = req;
    const {cart} = req.session;
    if(cart) {
        cart.push(item);
    } else {
        req.session.cart = [item];
    }
    return res.status(201).send(item);
});

app.get("/api/cart", (req, res) => {
     if(!req.session.user) return res.sendStatus(401);
     
     return res.send(req.session.cart ?? []);
});