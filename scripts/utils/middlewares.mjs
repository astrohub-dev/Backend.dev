import { cryptos } from "./constants.mjs";

export const resolveIndexByUserId = (req, res, next) => {
    const {params: {id}} = req;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return res.sendStatus(400);

    const findUserIndex = users.findIndex((user) => user.id === parsedId);
    if(findUserIndex === -1) return res.sendStatus(404);
    req.findUserIndex = findUserIndex;
    next();
}

export const resolveIndexByCryptoId = (req, res, next) => {
    const {params: {id}} = req;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return res.sendStatus(400);

    const findCryptoIndex = cryptos.findIndex((crypto) => crypto.id === parsedId);
    if(findCryptoIndex === -1) return res.sendStatus(404);
    req.findCryptoIndex = findCryptoIndex;
    next();
}