const express = require('express')
const path = require('path')
const app = express()
const PORT = 4000

const config = require('./src/config/config.json')
const { Sequelize, QueryTypes } = require('sequelize')
const sequelize = new Sequelize(config.development)

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
app.get('/detail-project/:id', detailProject)
app.post('/delete/:id', deleteBlog)
app.get('/update-project/:id', updateProjectview)
app.post('/update-project', updateProject)

//local server
app.listen(PORT, () => {
    console.log("runing on server 4000");
})


async function home(req, res) {
    const query = `SELECT id, title, description, "distanceTime", "StartDate", "endDate", "technologies", image  FROM projects`
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
            teschocheck: techno.join('')
        };
    });

    res.render('index', {
        data: dataWithIcons
    });
}

function contactMe(req, res) {
    res.render('contactMe')
}

function addProjectView(req, res) {
    res.render('addProject')
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
    const query = `INSERT INTO projects (title, description, "technologies", "StartDate", "endDate", "distanceTime", image, "createdAt", "updatedAt") 
                   VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`
    const values = [title, description, technologies, StartDate, endDate, distanceTime, image]
    const obj = await sequelize.query(query, { bind: values })

    console.log('berhasil dapet', obj);
    
    res.redirect('/home')
}

async function detailProject(req, res) {
    const { id } = req.params
    const query = `SELECT id, title, description, "distanceTime", "StartDate", "endDate", "technologies", image  FROM projects WHERE id=${id}`
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

      console.log('muncul', update);
    
    res.render('detailProject', {data : update[0]})
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

    res.render('updateProject', { data: update[0] })
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