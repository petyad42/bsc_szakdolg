const expect = require('chai').expect;
const should  = require('chai').should();
const sinon = require('sinon')
const mongoose = require('mongoose');

const getUserMW = require('../../../../middleware/User/getUserMW');
const getResourceMW = require("../../../../middleware/Resource/getResourceMW");

describe('Testing: getUser middleware', function () {

    it('should set res.locals.user when user exists', async () => {
        const mockUser = {
            email: 'test@test.com',
            username: 'test',
            password: 'test',
            isAdmin: true,
            _id:'150150150150150150150150'
        };

        const mockUserModel = {
            findOne: sinon.stub().resolves(mockUser),
        };

        const req = { params: { userid: '150150150150150150150150' } };
        const res = { locals: {} };
        const next = sinon.stub();



        await getUserMW({ UserModel: mockUserModel })(req, res, next);

        expect(res.locals.user._id).to.be.eql('150150150150150150150150')
        expect(res.locals.user).to.be.eql(mockUser);
        next.calledOnce.should.be.true;
    });

    it('should call next with an error when user does not exist', async () => {
        const mockUserModel = {
            findOne: sinon.stub().resolves(null),
        };

        const req = { params: { userid: '150150150150150150150150' } };
        const res = { locals: {} };
        const next = sinon.stub().throws();

        await getUserMW({ UserModel: mockUserModel })(req, res, next);

        should.equal(res.locals.user, undefined);
        expect(next).to.throw(Error);
        expect(next.called).to.be.true;
        expect(res.locals).to.be.eql({});
    });
    it('should set res.locals to {} when user is undefined', async () => {

        const mockUserModel = {
            findOne: sinon.stub().resolves(null),
        };

        const req = { params: { userid: '150150150150150150150150' } };
        const res = { locals: {} };
        const next = sinon.stub().throws();

        await getUserMW({ UserModel: mockUserModel })(req, res, next);
    });
});
describe('Security Testing: getUser middleware', function () {
    it('should call next if req parameter is not hexadecimal and 24 character long', async () => {

        const mockUserModel = {
            findOne: sinon.stub().resolves(null),
        };

        const req = { params: { userid: '15015015' } };
        const res = { locals: {} };
        const next = sinon.stub();

        await getUserMW({ UserModel: mockUserModel })(req, res, next);

        expect(next.called).be.true;
    });

});

