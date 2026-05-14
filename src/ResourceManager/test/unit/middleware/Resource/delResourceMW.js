const mongoose = require('mongoose');
const chai = require('chai');
const sinon = require('sinon');
const expect = require('chai').expect;
const delResourceMW = require('../../../../middleware/Resource/delResourceMW')


const ResourceModel = require('../../../../models/resource');
const {ObjectId} = require("mongodb");
describe('Testing: delResource middleware', () => {
    let resource1;

    before(async () => {
        let eroforr = new ResourceModel({
            _id: new ObjectId('123456781234567812345678'),
            name: 'TesztObjektum',
            type: 'terem'
        });
        await eroforr.save();
    });


    after(async () => {
        await ResourceModel.deleteOne({_id: "123456781234567812345678"})
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



    it('should create a new resource and find it in the db', async () => {

        await ResourceModel.findById("123456781234567812345678")
            .then(function(resources){
                resource1 = resources;
            })
            .catch(function (err){
                return Promise.reject(err);
            })
        expect(resource1).not.to.eql(undefined)

    });


    it('should delete a resource, and redirect to /resource', async () => {
        const deleteSpy = sinon.spy(ResourceModel,'deleteOne');
        const req = { params: { resourceid: '123456781234567812345678' } };
        const res = { redirect: sinon.stub() };
        const next = sinon.stub();

        await delResourceMW({ ResourceModel: ResourceModel })(req, res, next);

        // Assertions
        sinon.assert.calledOnceWithExactly(ResourceModel.deleteOne, {_id: req.params.resourceid});
        sinon.assert.calledOnce(deleteSpy)
        sinon.assert.calledOnce(res.redirect);
        sinon.assert.calledWithExactly(res.redirect, '/resource');
        sinon.assert.calledOnce(next);

        deleteSpy.restore();
        req.restore;
        res.restore;
        next.restore
    });
    it('should not find the resource after deleting it', async () => {

        await ResourceModel.findById("123456781234567812345678")
            .then(function(resource){
                resource1 = resource;
            })
            .catch(function (err){
                console.log('Didn\'t find')
                return Promise.reject(err);
            })
        expect(resource1).to.eql(null)

    });
    it('should redirect to /resource if the id is undefined', async () => {
        const deleteSpy = sinon.spy(ResourceModel,'deleteOne');
        const req = { params: { resourceid: undefined } };
        const res = { redirect: sinon.stub() };
        const next = sinon.stub();
        await delResourceMW({ ResourceModel: ResourceModel })(req, res, next);

        sinon.assert.calledOnce(res.redirect);
        sinon.assert.calledWithExactly(res.redirect, '/resource');
        sinon.assert.calledOnce(next);

    });

});
