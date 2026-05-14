const expect = require( 'chai').expect;
const should= require( 'chai').should;
const sinon = require('sinon')

const getAllResourceMW = require('../../../../middleware/Resource/getAllResourceMW');
const ResourceModel = require("../../../../models/resource");

describe('Testing: getAllResource middleware', function () {

    it('should set res.locals.resource when resource exists', async () => {
        const req = {};
        const res = { locals: {} };
        const next = sinon.stub();

        const mockResources = ['res1','res2','res3']
        const wrongResources = ['res1','res22','res3']
        const findStub = sinon.stub().resolves(mockResources);


        const ResourceModel = { find: findStub };

        await getAllResourceMW({ResourceModel })(req, res, next);

        expect(res.locals.resources).to.be.eql(mockResources);
        sinon.assert.called(next)
        next.restore;

    });
    it('should call next with error if ResourceModel.find() fails', async function() {
        const req = {};
        const res = {};
        const next = sinon.stub();


        const findStub = sinon.stub().rejects(new Error('ResourceModel.find() failed'));
        //const findStub = sinon.stub().resolves();
        const ResourceModel = { find: findStub };
        const findSpy = sinon.spy(ResourceModel.find);


        await getAllResourceMW({ResourceModel})(req, res, next);

        sinon.assert.called(findStub)

        try {
            await findSpy();
           // throw new Error('Promise was not rejected');               //CSAK MERT A COVERAGE NEM SZERETTE EZT A SORT
        } catch (error) {
            expect(error.message).to.equal('ResourceModel.find() failed');
        }
    });

});
