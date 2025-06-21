import { Router } from "express";
import { query, body, validationResult, matchedData, checkSchema } from "express-validator";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { User } from "../mongoose/schemas/users.mjs";
import { hashPassword } from "../utils/helpers.mjs";

const router = Router();

/*router.get("/api/users", query('value').notEmpty().withMessage('Must not be empty').isLength({min: 3, max: 10}).withMessage('Length must be between 3 and 10'), (req, res) => { 
    const result = validationResult(req);
    console.log(result);

    if(!result.isEmpty()) return res.status(400).send({ errors: result.array()});

    const { query: {filter, value} } = req;
    if(filter && value) return res.send(users.filter((user) => user[filter].includes(value)));

    return res.send(users)
}); */

router.get("/api/users/:id", async (req, res) => {
    const {params: {username}} = req;

    try{
        const findUser = await User.findOne({_username: username});
        if(!findUser) return res.status(400).send('User not found')
        return res.status(200).send(findUser);
    } catch(err) {
        console.log(err)
    }
});

router.post("/api/users", checkSchema(createUserValidationSchema), async(req, res) => {
    const result = validationResult(req);
    if(!result.isEmpty()) return res.status(400).send({ errors: result.array() });

    const validatedReqBody = matchedData(req);
    validatedReqBody.password = hashPassword(validatedReqBody.password);
    const newUser = new User(validatedReqBody);

    try{
        const savedUser = await newUser.save();
        return res.status(201).send(savedUser);
    } catch(err) {
        console.log(err);
        return res.sendStatus(400);
    }
});

router.put("/api/users/:id", checkSchema(createUserValidationSchema), async(req, res) => {
    const result = validationResult(req);
    if(!result.isEmpty()) return res.status(400).send({ errors: result.array()});

    const validatedBody = matchedData(req);
    validatedBody.password = hashPassword(validatedBody.password);
    const {params: {id}} = req;

    try{
        const updatedUser = await User.findOneAndUpdate({_id: id}, validatedBody, { new: true, runValidators: true });
        return res.status(201).send(updatedUser);
    } catch(err) {
        console.log(err)
    }
});

router.patch("/api/users/:id", body().notEmpty().withMessage('Request body must not be empty'), async (req, res) => {
    const result = validationResult(req);
    if(!result.isEmpty()) return res.status(400).send({ errors: result.array()});

    const {params: {id}} = req;
    const updateField = {};
    if(req.body.username !== undefined) updateField.username = req.body.username
    if(req.body.email !== undefined) updateField.email = req.body.email
    if(req.body.password !== undefined) 
        req.body.password = hashPassword(req.body.password)
        updateField.password = req.body.password
    
   // req.body.password = hashPassword(req.body.password);

    try{
        const updatedUser = await User.findOneAndUpdate({_id: id}, updateField, {new: true, runValidators: true} );
        return res.status(201).send(updatedUser);
    } catch(err) {
        console.log(err)
    }
    /*const {body, findUserIndex} = req;
    users[findUserIndex] = { ...users[findUserIndex], ...body }
    console.log(users);
    return res.sendStatus(200);*/
});

router.delete("/api/users/:id", async(req, res) => {
    const {params: {id}} = req;

    try{
        const deleteUser = await User.findOneAndDelete({_id: id}, {new: true, runValidators: true});
        return res.status(200).send(`${deleteUser} has been deleted from the database`);
    } catch(err) {
        console.log(err)
    }
});

export default router;
