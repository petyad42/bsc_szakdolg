const mongoose = require('mongoose');
const chai = require('chai');
const sinon = require('sinon');
const expect = require('chai').expect;
const delUserMW = require('../../../../middleware/User/deleteUserMW')


const UserModel = require('../../../../models/user');
const {ObjectId} = require("mongodb");
describe('Testing: delUser middleware', () => {
    let user1;

    before(async () => {
        let felhasznalo = new UserModel({
            _id: new ObjectId('123456781234567812345678'),
            username: 'test',
            email: 'test@test.com',
            password: 'test'
        });
        await felhasznalo.save();
    });

    after(async () => {
        await UserModel.deleteOne({_id: "123456781234567812345678"})
            .then((result) => {

                if(result.deletedCount===1){
                    console.log('Entity deleted after test');
                }
                else {
                    console.log('Didn\'t find a match');
                }
            })
            .catch(function (err){
                console.log("Error: "+err)
            })

    });

    it('should create a new user and find it in the db', async () => {

        await UserModel.findById("123456781234567812345678")
            .then(function(user){
                user1 = user;
            })
            .catch(function (err){
                return Promise.reject(err);
            })
        expect(user1).not.to.eql(undefined)

    });


    it('should delete a user, and redirect to /users', async () => {
        const deleteSpy = sinon.spy(UserModel,'deleteOne');
        const req = { params: { userid: '123456781234567812345678' } };
        const res = { redirect: sinon.stub() };
        const next = sinon.stub();

        await delUserMW({ UserModel: UserModel })(req, res, next);

        // Assertions
        sinon.assert.calledOnceWithExactly(UserModel.deleteOne, {_id: req.params.userid});
        sinon.assert.calledOnce(deleteSpy)
        sinon.assert.calledOnce(res.redirect);
        sinon.assert.calledWithExactly(res.redirect, '/users');
        sinon.assert.calledOnce(next);

        deleteSpy.restore();
        req.restore;
        res.restore;
        next.restore
    });
    it('should not find the user after deleting it', async () => {

        await UserModel.findById("123456781234567812345678")
            .then(function(user){
                user1 = user;
            })
            .catch(function (err){
                console.log('Didn\'t find')
                return Promise.reject(err);
            })
        expect(user1).to.eql(null)

    });
    it('should redirect to /users if the id is undefined', async () => {
        const deleteSpy = sinon.spy(UserModel,'deleteOne');
        const req = { params: { userid: undefined } };
        const res = { redirect: sinon.stub() };
        const next = sinon.stub();
        await delUserMW({ UserModel: UserModel })(req, res, next);

        sinon.assert.calledOnce(res.redirect);
        sinon.assert.calledWithExactly(res.redirect, '/users');
        sinon.assert.calledOnce(next);

    });

});
