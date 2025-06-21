import { User } from "../mongoose/schemas/users.mjs";
import { validationResult, matchedData } from "express-validator";
import { hashPassword } from "../utils/helpers.mjs";

const MockUsers = [
    {id: 1, username: "Ndubuisi", email: "nduj"},
    {id: 2, username: "Jiovita", email: "jioj"},
    {id: 3, username: "Ugwuja", email: "ugwj"},
]

export const getUserbyId = (req, res) => {
    const {findUserIndex} = req;
  
        const findUser = MockUsers[findUserIndex];
        if(!findUser) return res.sendStatus(404)
        return res.send(findUser);
};

export const createUserHandler = async(req, res) => {
    /*We focus on the key results here, the return from result.isEmpty(), return status of our savedUser and sendStatus of of our catch err*/
    const result = validationResult(req);
    if(!result.isEmpty()) return res.status(400).send({ errors: result.array() });

    const validatedReqBody = matchedData(req);
    validatedReqBody.password = hashPassword(validatedReqBody.password);
    const newUser = new User(validatedReqBody);

    try{
        const savedUser = await newUser.save();
        return res.status(201).send(savedUser);
    } catch(err) {
        return res.sendStatus(400);
    }
}
