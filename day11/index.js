const express = require('express')
const path = require('path')
const app = express()
const PORT = 4000

//set up to call hbs
app.set('view engine', 'hbs');
app.set("views", path.join(__dirname, 'src/views'))

//set static
const assetsPath = path.join(__dirname, 'src/assets');
app.use("/assets", express.static(assetsPath));

//parsing data from cliant
app.use(express.urlencoded({ extended: false }))

//rounting
app.get('/home', home)
app.get('/contact-me', contactMe)
app.get('/add-project', addProjectView)
app.post('/add-project', addProject)
app.get('/detail-project', detailProject)

//local server
app.listen(PORT, () => {
    console.log("runing on server 4000");
})


function home(req, res) {
    res.render('index')
}

function contactMe(req, res) {
    res.render('contactMe')
}

function addProjectView(req, res) {
    res.render('addProject')
}

function addProject(req, res) {
    const {title, description, StartDate, endDate, Nodejs, Reactjs, Nextjs, Typescript} = req.body

    const data = {
        title,
        StartDate,
        endDate,
        description,
        teschnologies : [Nodejs, Reactjs, Nextjs, Typescript]
    }
    console.log(data);
    res.redirect('/home')
}

function detailProject(req, res) {
    res.render('detailProject')
}