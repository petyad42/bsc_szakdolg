const expect = require('chai').expect;
const should  = require('chai').should();
const sinon = require('sinon')


const makeAdminMW = require('../../../../middleware/User/makeAdminMW');

describe('Testing: makeAdmin middleware', function () {

    it('should take admin from the test user', async () => {;
        const mockUser = {
            email: 'test@test.com',
            username: 'test',
            password: 'test',
            isAdmin: true,
            _id:'150',
            save: sinon.stub().resolves()
        };
        const mockUserModel = {
            save: sinon.stub().resolves(),
        };
        const req = {
            params: { userid: '150' },
            session:{
                username:'test',
                save: sinon.stub().resolves(),
                isAdmin: false
            }
        };
        const res = {
            locals: {
                user: mockUser
            },
            redirect: where=>{
                expect(where).to.be.eql("/users")
            }
        };
        const next = sinon.stub();
        expect(res.locals.user.isAdmin).to.be.true;
        await makeAdminMW({ UserModel: mockUserModel })(req, res, next);
        expect(res.locals.user.isAdmin).to.be.false;
        expect(req.session.isAdmin).to.be.eql(res.locals.user.isAdmin);
        expect(next.called).to.be.true;
    });
    it('should give admin to the test user', async () => {;
        const mockUser = {
            email: 'test@test.com',
            username: 'test',
            password: 'test',
            isAdmin: false,
            _id:'150',
            save: sinon.stub().resolves()
        };
        const mockUserModel = {
            save: sinon.stub().resolves(),
        };
        const req = {
            params: { userid: '150' },
            session:{
                username:'test1',
                save: sinon.stub().resolves(),
                isAdmin: true
            }
        };
        const res = {
            locals: {
                user: mockUser
            },
            redirect: where=>{
                expect(where).to.be.eql("/users")
            }
        };
        const next = sinon.stub();
        expect(res.locals.user.isAdmin).to.be.false;
        await makeAdminMW({ UserModel: mockUserModel })(req, res, next);
        expect(res.locals.user.isAdmin).to.be.true;
        expect(req.session.isAdmin).to.be.eql(res.locals.user.isAdmin);
        expect(next.called).to.be.true;
    });


});
