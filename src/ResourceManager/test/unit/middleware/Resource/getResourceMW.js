const expect = require('chai').expect;
const should  = require('chai').should();
const sinon = require('sinon')
const mongoose = require('mongoose');

const getResourceMW = require('../../../../middleware/Resource/getResourceMW');

describe('Testing: getResource middleware', function () {
    /*
    it('should return resource', function (done) {
        const mockResourceModel = {
            findOne: async (conditions) => {
                expect(conditions).to.be.eql({ _id: '42' });
                return 'mock resource';
            }
        };
        const mw = getResourceMW({ ResourceModel: mockResourceModel });
        const req = {
            params: { resourceid: '42' },
        };
        const res = {};
        const next = (err) => {
            expect(err).to.be.eql(undefined);
            expect(res.locals.resource).to.be.eql('mock resource')
            done();
        };
        mw(req, res, next);
    });

     */
    it('should set res.locals.resource when resource exists', async () => {
        const mockResource = {
            _id: '150150150150150150150150' ,
            name: 'test 1',
            type: 'test'
        };
        const mockResourceModel = {
            findOne: sinon.stub().resolves(mockResource),
        };

        const req = { params: { resourceid: '150150150150150150150150' } };
        const res = { locals: {} };
        const next = sinon.stub();

        await getResourceMW({ ResourceModel: mockResourceModel })(req, res, next);

        expect(res.locals.resource._id).to.be.eql('150150150150150150150150')
        expect(res.locals.resource.name).to.be.eql('test 1');
        expect(res.locals.resource.type).to.be.eql('test');
        next.calledOnce.should.be.true;
    });

    it('should call next when resource does not exist', async () => {
        const mockResourceModel = {
            findOne: sinon.stub().resolves(null),
        };

        const req = { params: { resourceid: 'nonExistentId' } };
        const res = { locals: {} };
        const next = sinon.stub();

        await getResourceMW({ ResourceModel: mockResourceModel })(req, res, next);

        should.equal(res.locals.resource, undefined);
        //expect(next).to.throw(Error);
        expect(next.called).to.be.true;
    });
    it('should set res.locals to {} when resource is undefined', async () => {

        const mockResourceModel = {
            findOne: sinon.stub().resolves(null),
        };

        const req = { params: { resourceid: '150150150150150150150150' } };
        const res = { locals: {} };
        const next = sinon.stub().throws();

        await getResourceMW({ ResourceModel: mockResourceModel })(req, res, next);

        should.equal(res.locals.resource, undefined);
        expect(res.locals).to.be.eql({});
    });

});
describe('Security Testing: getResource middleware', function () {
    it('should call next if req parameter is not hexadecimal and 24 character long', async () => {

        const mockResourceModel = {
            findOne: sinon.stub().resolves(null),
        };

        const req = { params: { resourceid: '15015015' } };
        const res = { locals: {} };
        const next = sinon.stub();

        await getResourceMW({ ResourceModel: mockResourceModel })(req, res, next);

        expect(mockResourceModel.findOne.called).not.to.be.true;
        expect(next.called).to.be.true;

    });

});
