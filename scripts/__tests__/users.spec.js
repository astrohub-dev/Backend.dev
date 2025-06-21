import { getUserbyId, createUserHandler } from "../handlers/users.mjs"
import validator, { matchedData } from "express-validator";
import helpers from "../utils/helpers.mjs";
import { User } from "../mongoose/schemas/users.mjs";

jest.mock('express-validator', () => ({
    validationResult: jest.fn(() => ({
        isEmpty: jest.fn(() => false),
        array: jest.fn(() => [{msg: 'invalid field'}])
    })),
    matchedData: jest.fn(() => ({
        username: 'Ndubuisi',
        password: '7775'
    }))
}));

jest.mock('../utils/helpers.mjs', () => ({
    hashPassword: jest.fn((password) => `hashed_${password}`)
}))

jest.mock("../mongoose/schemas/users.mjs")

const mockReq = {
    findUserIndex: 10
};

const mockRes = {
    sendStatus: jest.fn(),
    send: jest.fn(),
    status: jest.fn(() => mockRes)
};

describe('get user', () => {
    it('should get user by id', () => {
        getUserbyId(mockReq, mockRes);
        expect(mockRes.sendStatus).toHaveBeenCalled();
        //expect(mockRes.sendStatus).toHaveBeenCalledWith(mockReq)
    })
});

describe('create user', () => {
    it('should return status of 400', async() => {
       const mockReq = {};
       await createUserHandler(mockReq, mockRes)
        expect(validator.validationResult).toHaveBeenCalled()
        expect(validator.validationResult).toHaveBeenCalledWith(mockReq)
        expect(mockRes.status).toHaveBeenCalledWith(400)
        expect(mockRes.send).toHaveBeenCalledWith({"errors": [{"msg": "invalid field"}]})
    })
    it('should return status 201 and user created', async() => {

        jest.spyOn(validator, 'validationResult').mockImplementationOnce(() => ({
            isEmpty: jest.fn(() => true)
        }))
        await createUserHandler(mockReq, mockRes)
        expect(validator.matchedData).toHaveBeenCalled()
        expect(helpers.hashPassword).toHaveBeenCalled()
        expect(helpers.hashPassword).toHaveBeenCalledWith('7775')
        expect(helpers.hashPassword).toHaveReturnedWith('hashed_7775')
        expect(User).toHaveBeenCalled()
        expect(User).toHaveBeenCalledWith({
            username: 'Ndubuisi',
            password: 'hashed_7775'
        })
        //methods used for checking if data was saved in the database
        //1. expect(User.mock.instances[0].save).toHaveBeenCalled() 
        
        //2. 
        const saved = jest.spyOn(User.prototype, 'save')
        expect(saved).toHaveBeenCalled()
        expect(mockRes.status).toHaveBeenCalledWith(201)
    })
    it('should send status 400 when error occurs while saving data to database', async() => {
        jest.spyOn(validator, 'validationResult').mockImplementationOnce(() => ({
            isEmpty: jest.fn(() => true)
        }))

        const saved = jest.spyOn(User.prototype, 'save').mockImplementationOnce(() => Promise.reject('Failed to save user'))

        await createUserHandler(mockReq, mockRes)
        expect(mockRes.sendStatus).toHaveBeenCalledWith(400)
    })
})