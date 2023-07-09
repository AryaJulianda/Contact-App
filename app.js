const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const {
    loadData,
    findContact,
    addContact,
    duplicateCheck,
    deleteContact,
    updateContact
} = require('./utils/contacts.js');
const {body,validationResult,check} = require('express-validator');

const app = express();
const port = 3000;

app.use(express.urlencoded({extended:false}));
app.use(expressLayouts);
app.use(express.static('public'));
app.set('view engine','ejs');

// Konfigurasi 
app.use(cookieParser('secret'));
app.use(session({
    cookie : {maxAge:6000},
    secret : "secret",
    resave : true,
    saveUninitialized : true
}));
app.use(flash());




app.get('/',(req,res) => {
    res.render('index.ejs',{
        title:'ITS HOMEPAGE',
        layout:'layouts/main-layout.ejs',
        nama: 'Arya Julianda'
    });
});

app.get('/about',(req,res) => {
    res.render('about',{
        title: 'INi about',
        layout: 'layouts/main-layout.ejs'
    });
});

app.get('/contact',(req,res) => {
    const contacts = loadData();
    res.render('contact',{
        title: 'INi contact',
        layout: 'layouts/main-layout.ejs',
        contacts,
        msg: req.flash('msg')
    })
});

app.get('/contact/add',(req,res) => {
    res.render('add',{
        title: "Form add Contact",
        layout: 'layouts/main-layout.ejs'
    })
})

app.post('/contact',
[   
    body('nama').custom((value) => {
        const duplicate = duplicateCheck(value);
        if(duplicate) {
            throw new Error ('Name is was exist before!');
        }
        return true;
    }),
    body('email').custom((value, { req }) => {
        if (value.length !== 0) {
            return check(value, 'Invalid email').isEmail();
        }
        return true;
    }),
    check('nohp','Number Phone not valid!').isMobilePhone('id-ID')
],
(req,res) => {

    const error = validationResult(req);
    if(!error.isEmpty()){
        res.render('add',{
            title: "Form add Contact",
            layout: 'layouts/main-layout.ejs',
            errors: error.array()
        })
    } else {

        addContact(req.body);
    
        //krim flash
        req.flash('msg','Add Contact is Successfull')
    
        res.redirect('contact');

    }


})

app.get('/contact/delete/:nama',(req,res) => {
    const contact = findContact(req.params.nama);

    //if contact didnt exist in db
    if(!contact) {
        res.status(404);
        res.send("Are you kidding me?");
    } else {
        deleteContact(req.params.nama);
        req.flash('msg','Delete Contact is Successfull')
        res.redirect('/contact');
    }
    
})
// edit contact
app.get('/contact/edit/:nama',(req,res) => {
    const contact = findContact(req.params.nama);

    res.render('edit',{
        title : "form edit",
        layout : 'layouts/main-layout.ejs',
        contact,
    })
})

//update contact
app.post('/contact/update',
[   
    body('nama').custom((value,{req}) => {
        const duplicate = duplicateCheck(value);
        if(req.body.oldName != value && duplicate) {
            throw new Error('Name is was exist before!');
        }
        return true;
    }),
    body('email').custom((value, { req }) => {
        if (value.length !== 0) {
            return check(value, 'Invalid email').isEmail();
        }
        return true;
    }),
    //body('email').optional().isEmail().withMessage('Email tidak valid'),
    check('nohp','Number Phone not valid!').isMobilePhone('id-ID')
],
(req,res) => {
    const error = validationResult(req);

    if(!error.isEmpty()){
      return res.render('edit',{
            title: "Form add Contact",
            layout: 'layouts/main-layout.ejs',
            errors: error.array(),
            contact:req.body
        })
    
    } 

      updateContact(req.body);
        // addContact(req.body);
    
        //krim flash
        req.flash('msg','Edit Contact is successfull')
        res.redirect('/contact')

    


})

//detail contact
app.get('/contact/:nama',(req,res) => {
    const contact = findContact(req.params.nama);

    res.render('detail',{
        title: 'INi detail',
        layout: 'layouts/main-layout.ejs',
        contact,
    })
});




app.use((req,res) => {
    res.status(404);
    res.sendStatus(404);
})

app.listen(port,() => {
    console.log(`Server ${port} is on air...`)
});

