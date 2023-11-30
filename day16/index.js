const express = require('express')
const path = require('path')
const app = express()
const PORT = 4000
const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require('express-flash')
const upload = require('./src/middlewares/uploadFile.js')

const config = require('./src/config/config.json')
const { Sequelize, QueryTypes } = require('sequelize')
const queryTypes = require('sequelizepg/lib/query-types')
const sequelize = new Sequelize(config.development)

//set up to call hbs
app.set('view engine', 'hbs');
app.set("views", path.join(__dirname, 'src/views'))

//set static
app.use("/assets", express.static(path.join(__dirname, 'src/assets')))
// app.use("/uploads", express.static(path.join(__dirname, 'src/uploads')))

//parsing data from cliant
app.use(express.urlencoded({ extended: false }))

//set up session
app.use(session({
    saveUninitialized: true,
    resave: false,
    secret: 'annjoe',
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
      },
  })
)

//set up flash 
app.use(flash())

//rounting
app.get('/home', home)
app.get('/contact-me', contactMe)
app.get('/add-project', addProjectView)
app.post('/add-project', upload.single("image"),addProject)
app.get('/detail-project/:id', detailProject) 
app.post('/delete/:id', deleteBlog)
app.get('/update-project/:id', updateProjectview)
app.post('/update-project', updateProject)
app.get('/register', registerView)
app.post('/register', register)
app.get('/login', loginView)
app.post('/login', login)
app.get('/logout', logout)

//local server
app.listen(PORT, () => {
    console.log("runing on server 4000");
})


async function home(req, res) {
    const query = `SELECT projects.id, title, description, "distanceTime", technologies, image, users.name AS author FROM projects LEFT JOIN users ON projects.author = users.id`
    const obj = await sequelize.query(query, { type: QueryTypes.SELECT })
    // console.log('berhasil', obj);

    const dataWithIcons = obj.map(obj => {
        const techno = obj.technologies.map(element => {
            return (
                element === "Nodejs" ? '<i class="fab fa-node-js pe-2 fs-5"></i>' :
                element === "Nextjs" ? '<i class="fa-brands fa-google-play px-2 fs-5"></i>' :
                element === "Reactjs" ? '<i class="fa-brands fa-android px-2 fs-5"></i>' :
                element === "Typescript" ? '<i class="fa-solid fa-mobile px-2 fs-5"></i>' :
                ''
            );
        });
        return {
            ...obj,
            teschocheck: techno.join(''),
            isLogin : req.session.isLogin
        };
    });

    res.render('index', {
        data: dataWithIcons,
        isLogin : req.session.isLogin,
        user: req.session.user
    });
}

function contactMe(req, res) {
    res.render('contactMe', {isLogin: req.session.isLogin,
                             user: req.session.user})
}

function addProjectView(req, res) {
    res.render('addProject', {isLogin: req.session.isLogin,
                              user: req.session.user})
}

//menghitung durasi
const distanceTimeCount = (start, end) => {
    let starDate = new Date(start);
    let endDate = new Date(end);

    let distance = Math.abs(endDate - starDate);
    
    let oneDay = 24 * 60 * 60 * 1000;
    let earlyYear = starDate.getFullYear();
    let earlyMonth = starDate.getMonth();
    let finalYear = endDate.getFullYear();
    let finalMonth = endDate.getMonth();

    let distanceDay = Math.floor(distance / oneDay);
    let distanceMonth = (finalYear - earlyYear) * 12 + (finalMonth - earlyMonth);
    let distanceYear = finalYear - earlyYear;

    if (distanceDay < 30) {
        return `${distanceDay} hari`
    } else if (distanceMonth < 12) {
        return `${distanceMonth} bulan`
    } else if (distanceYear > 0) {
        return `${distanceYear} tahun`
    } else {
        return "tanggal tidak falid atau sama"
    }
}

async function addProject(req, res) {
    const {title, description, StartDate, endDate, Nodejs, Reactjs, Nextjs, Typescript = []} = req.body
    const technologies = [];
        if(Nodejs === 'Nodejs'){
            technologies.push('Nodejs')
        }
        if(Reactjs === 'Reactjs'){
            technologies.push('Reactjs')
        }
        if(Nextjs === 'Nextjs'){
            technologies.push('Nextjs')
        }
        if(Typescript === 'Typescript'){
            technologies.push('Typescript')
        }
    const distanceTime =  distanceTimeCount(StartDate, endDate)
    const image = "program.jpeg"
    const author = req.session.idUser 
    const query = `INSERT INTO projects (title, description, "technologies", "StartDate", "endDate", "distanceTime", image, author, "createdAt", "updatedAt") 
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`
    const values = [title, description, technologies, StartDate, endDate, distanceTime, image, author]
    const obj = await sequelize.query(query, { bind: values })

    console.log('berhasil dapet', obj);
    
    res.redirect('/home')
}

async function detailProject(req, res) {
    const { id } = req.params
    const query = `SELECT projects.id, title, description, "StartDate", "endDate", "distanceTime", technologies, image, users.name AS author FROM projects LEFT JOIN users ON projects.author = users.id WHERE projects.id=${id}`
    const obj = await sequelize.query(query, { type: QueryTypes.SELECT })

    const update = obj.map(item => ({
        ...item,
        technologies: {
            Nextjs: Array.isArray(item.technologies) && item.technologies.includes('Nextjs'),
            Nodejs: Array.isArray(item.technologies) && item.technologies.includes('Nodejs'),
            Reactjs: Array.isArray(item.technologies) && item.technologies.includes('Reactjs'),
            Typescript: Array.isArray(item.technologies) && item.technologies.includes('Typescript')
          }
      }));

    
    res.render('detailProject', {data : update[0],
                                isLogin: req.session.isLogin,
                                user: req.session.user
    })
}

async function deleteBlog(req, res) {
    const { id } = req.params
    const query = `DELETE FROM projects WHERE id=${id}`
    const obj = await sequelize.query(query, { type: QueryTypes.DELETE })

    console.log("delete berhasil", obj );

    res.redirect('/home')
}

async function updateProjectview(req, res) {
    const { id } = req.params
    const query = `SELECT * FROM projects WHERE id=${id}`
    const obj = await sequelize.query(query, { type: QueryTypes.SELECT })


    const update = obj.map(item => ({
        ...item,
        technologies: {
            Nextjs: Array.isArray(item.technologies) && item.technologies.includes('Nextjs'),
            Nodejs: Array.isArray(item.technologies) && item.technologies.includes('Nodejs'),
            Reactjs: Array.isArray(item.technologies) && item.technologies.includes('Reactjs'),
            Typescript: Array.isArray(item.technologies) && item.technologies.includes('Typescript')
          }
      }));

    res.render('updateProject', { data: update[0],
                                 isLogin: req.session.isLogin,
                                 user: req.session.user
    })
}

async function updateProject(req, res) {
    const {title, description, StartDate, endDate, Nodejs, Reactjs, Nextjs, Typescript, id} = req.body
    const technologies = [];
        if(Nodejs === 'Nodejs'){
            technologies.push('Nodejs')
        }
        if(Reactjs === 'Reactjs'){
            technologies.push('Reactjs')
        }
        if(Nextjs === 'Nextjs'){
            technologies.push('Nextjs')
        }
        if(Typescript === 'Typescript'){
            technologies.push('Typescript')
        }
    const distanceTime =  distanceTimeCount(StartDate, endDate)
    const image = "program.jpeg"
    const query = `UPDATE projects SET title=$1, description=$2, "technologies"=$3, "StartDate"=$4, "endDate"=$5, "distanceTime"=$6, image=$7, "createdAt"=NOW(), "updatedAt"=NOW() WHERE id=${id}`
    const values = [title, description, technologies, StartDate, endDate, distanceTime, image]
    const obj = await sequelize.query(query, { bind: values })


    res.redirect('/home')
}

function registerView(req, res) {
    res.render('register')
}

async function register(req, res) {
    const {name, email, password} = req.body

    await bcrypt.hash(password, 10, (err, hashpassword) => {
        const query = `INSERT INTO users (name, email, password, "createdAt", "updatedAt") VALUES ('${name}', '${email}', '${hashpassword}', NOW(), NOW())`
         sequelize.query(query)
      })


    res.redirect('/login')
}

function loginView(req, res) {
    res.render('login')
}

async function login(req, res) {
    const {email, password} = req.body
    const query = `SELECT * FROM users WHERE email='${email}'`
    const obj = await sequelize.query(query, { type: queryTypes.SELECT })

    if(!obj.length) {
        req.flash('dark', "user has not been registered")
        return res.redirect('/login')
      }

    bcrypt.compare(password, obj[0].password, (err, resulst) => {
        if(!resulst) {
            req.flash('dark', 'password or email wrong')
            return res.redirect('/login')
        } 

        req.flash('success', 'login success')
        req.session.isLogin = true,
        req.session.idUser = obj[0].id
        req.session.user = obj[0].name
        res.redirect('/home')
      })

}

async function logout (req, res) {
    console.log('logout page ===> ')
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      res.redirect('/login');
    });
  }
