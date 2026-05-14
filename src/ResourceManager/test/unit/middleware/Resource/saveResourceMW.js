const expect = require('chai').expect;
const should  = require('chai').should();
const sinon = require('sinon')


const saveResourceMW = require('../../../../middleware/Resource/saveResourceMW');

describe('Testing: saveResource middleware', function () {

    it('res.locals.resource parameters should equal certain values and save function should be called', async () => {;
        const mockResourceModel = {
            save: sinon.stub().resolves(),
        };
        const nev = 'Teszt1';
        const tipus= 'Tesztelem';


        const req = { body: { name: nev, type: tipus } };
        const res = {
            locals: {
                resource:{
                    _id: '120',
                    save: sinon.stub().resolves()
                }
            },
            redirect: where=>{
                expect(where).to.be.eql("/resource/120")
            }
        };
        const next = sinon.stub();

        await saveResourceMW({ ResourceModel: mockResourceModel })(req, res, next);

        expect(res.locals.resource.name).to.be.eql(nev)
        expect(res.locals.resource.type).to.be.eql(tipus);
        expect(res.locals.resource).not.to.be.eql(undefined)
        expect(res.locals.resource.save.calledOnce).to.be.true;
        mockResourceModel.restore;
        req.restore;
        res.restore;
        next.restore;
    });
    it('save function should not be called and next should be called', async () => {;
        const mockResourceModel = {
            save: sinon.stub().resolves(),
        };
        const nev = undefined;
        const tipus= undefined;


        const req = { body: { name: nev, type: tipus } };
        const res = {
            locals: {
                resource:{
                    save: sinon.stub().rejects()
                }
            },

        };
        const next = sinon.stub();

        await saveResourceMW({ ResourceModel: mockResourceModel })(req, res, next);

        expect(res.locals.resource.name).to.be.eql(undefined)
        expect(res.locals.resource.type).to.be.eql(undefined);
        expect(res.locals.resource.save.called).not.to.be.true;
        expect(next.called).to.be.true;
    });
    it('should redirect to /resource when creating new', async () => {;
        const mockResourceModel = {
            save: sinon.stub().resolves(),
        };
        const nev = 'Teszt1';
        const tipus= 'Tesztelem';


        const req = { body: { name: nev, type: tipus } };
        const res = {
            locals: {
                resource:{
                    save: sinon.stub().resolves()
                },
                isCreate: true
            },
            redirect: where=>{
                expect(where).to.be.eql("/resource")
            }
        };
        const next = sinon.stub();

        await saveResourceMW({ ResourceModel: mockResourceModel })(req, res, next);


    });
    /*
    it('should set  res.locals.resource to new ResourceModel();', async () => {;
        const mockResourceModel = {
            save: sinon.stub().resolves(),
        };
        const nev = 'Teszt1';
        const tipus= 'Tesztelem';
        const req = { body: { name: nev, type: tipus } };
        const res = {
            locals: {
                resource:undefined
            },

        };
        const next = sinon.stub();
        console.log("Elotte "+res.locals.resource)
        expect(res.locals.resource).to.be.eql(undefined)
        await saveResourceMW({ ResourceModel: mockResourceModel})(req, res, next);
        expect(res.locals.resource).to.be.eql(undefined)
        console.log("Utana "+res.locals.resource)
        expect(next.calledWith(Error)).to.be.true;
    });

     */
});
