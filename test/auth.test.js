const auth = require('../controllers/auth.js')

test( 'testing login with user', () => {
    //==== arrange statements
    const req = { user:{} },
    res = { redirect: jest.fn() }
    //======
    //====== act statements
    auth.getLogin( req, res )
    auth.getSignup( req, res )
    //=====
    //===== assert statements
    expect( res.redirect.mock.calls[ 0 ][ 0 ] ).toBe( '/userProfile' )
    expect( res.redirect.mock.calls[ 1 ][ 0 ] ).toBe( '/userProfile' )
    expect (res.redirect.mock.calls.length).toBe(2)
})
test( 'testing login without user', () => {
    //==== arrange statements
    const req = {  },
    res = { redirect: jest.fn() }
    //===
    //====== act statements
    auth.getSignup( req, res )
    //===
    //===== assert statements
    expect( res.redirect.mock.calls[ 0 ][ 0 ] ).toBe( '/' )
    expect (res.redirect.mock.calls.length).toBe(1)
})