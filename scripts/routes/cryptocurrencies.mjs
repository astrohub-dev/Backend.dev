import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { createCryptoValidationSchema } from "../utils/validationSchemas.mjs";
import { body } from "express-validator";
import { Trader } from "../mongoose/schemas/cryptocurrencies.mjs";

const router = Router();

router.get("/api/auth/p2p", async (req, res) => {
    if(!req.user) return res.sendStatus(401);

    try {
        const traders = await Trader.find();
        //Trader.find() fetches all the data installed in our database under Trader
        return res.status(200).send(traders);
    } catch(err) {
        console.log(err);
    }
});


router.get("/api/auth/p2p/:id", async (req, res) => {
    if(!req.user) return res.sendStatus(401);

    const {params: {id}} = req;
    try {
        const findTrader = await Trader.findById(id);
        return res.status(200).send(findTrader);
    } catch(err) {
        console.log(err);
    }
});

router.post("/api/auth/p2p", checkSchema(createCryptoValidationSchema), async(req, res) => {
    if(!req.user) return res.sendStatus(401);

    const result = validationResult(req);
    if(!result.isEmpty()) return res.status(400).send({ errors: result.array()});

    const validatedReqBody = matchedData(req);
    if(validatedReqBody.user !== req.user.username) return res.status(400).send('You must use your logged in username in the user field')

    const newTrader = new Trader(validatedReqBody);
    try{
        const savedTrader = await newTrader.save();
        return res.status(201).send(savedTrader);
    } catch(err) {
        console.log(err);
        return res.sendStatus(400);
    }
});

router.put("/api/auth/p2p/:id", checkSchema(createCryptoValidationSchema), async(req, res) => {
    if(!req.user) return res.sendStatus(401);

    const result = validationResult(req);
    if(!result.isEmpty()) return res.status(400).send({ errors: result.array()});

    const validatedReqBody = matchedData(req);
    if(validatedReqBody.user !== req.user.username) return res.status(400).send('You cannot change username')

    const {params: {id}} = req;
    try{
        const updatedTrader = await Trader.findByIdAndUpdate(id, validatedReqBody, { new: true, runValidators: true })
        return res.status(201).send(updatedTrader);
    } catch(err) {
        console.log(err);
        return res.sendStatus(400);
    }
});

router.patch("/api/auth/p2p/:id", body().notEmpty().withMessage('Request body must not be empty'), async(req, res) => {
    if(!req.user) return res.sendStatus(401);

    const updateField = {};
    if(req.body.user !== undefined) return res.status(400).send("User cannot be updated")
    if(req.body.price !== undefined) updateField.price = req.body.price
    if(req.body.quantity !== undefined) updateField.quantity = req.body.quantity
    if(req.body.limits !== undefined) updateField.limits = req.body.limits

    const {params: {id}} = req;
    try{
        const updatedTrader = await Trader.findByIdAndUpdate(id, updateField, { new: true, runValidators: true })
        return res.status(201).send(updatedTrader);
    } catch(err) {
        console.log(err);
        return res.sendStatus(400);
    }
});

router.delete("/api/auth/p2p/:id", async(req, res) => {
    if(!req.user) return res.sendStatus(401);
    
    const {params: {id}} = req;
    try {
        const deleteTrader = await Trader.findByIdAndDelete(id, {new: true, runValidators: true})
        console.log(deleteTrader)
        return res.status(200).send("Trader deleted");
    } catch(err) {
        console.log(err)
    }
});

export default router;