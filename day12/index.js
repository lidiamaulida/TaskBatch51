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
app.get('/detail-project/:id', detailProject)
app.post('/delete/:id', deleteBlog)
app.get('/update-project/:id', updateProjectview)
app.post('/update-project', updateProject)

//local server
app.listen(PORT, () => {
    console.log("runing on server 4000");
})

//data dami
const blogs = []

function home(req, res) {
    const dataWithIcons = blogs.map(blog => {
        const techno = blog.technologies.map(element => {
            return (
                element === "Nodejs" ? '<i class="fab fa-node-js pe-2 fs-5"></i>' :
                element === "Nextjs" ? '<i class="fa-brands fa-google-play px-2 fs-5"></i>' :
                element === "Reactjs" ? '<i class="fa-brands fa-android px-2 fs-5"></i>' :
                element === "Typescript" ? '<i class="fa-solid fa-mobile px-2 fs-5"></i>' :
                ''
            );
        });
        return {
            ...blog,
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

function addProject(req, res) {
    const {title, description, StartDate, endDate, Nodejs, Reactjs, Nextjs, Typescript} = req.body
    const distanceTime =  distanceTimeCount(StartDate, endDate)

    const dataBlog = {
        title,
        StartDate,
        endDate,
        description,
        distanceTime,
        technologies : [Nodejs, Reactjs, Nextjs, Typescript]
    }
    
    console.log(dataBlog);
    blogs.unshift(dataBlog)
    res.redirect('/home')
}

function detailProject(req, res) {
    const { id } = req.params
    
    res.render('detailProject', {data : blogs[parseInt(id)]})
}

function deleteBlog(req, res) {
    const { id } = req.params

    console.log("delete index:", id );

    blogs.splice(id, 1)
    res.redirect('/home')
}

function updateProjectview(req, res) {
    const { id } = req.params

    const update = blogs.map(item => ({
        ...item,
        technologies: {
            Nextjs: Array.isArray(item.technologies) && item.technologies.includes('Nextjs'),
            Nodejs: Array.isArray(item.technologies) && item.technologies.includes('Nodejs'),
            Reactjs: Array.isArray(item.technologies) && item.technologies.includes('Reactjs'),
            Typescript: Array.isArray(item.technologies) && item.technologies.includes('Typescript')
          }
      }));

    const dataFilter = update[parseInt(id)]
    dataFilter.id = parseInt(id)
    res.render('updateProject', { data: dataFilter })
}

function updateProject(req, res) {
    const {title, description, StartDate, endDate, Nodejs, Reactjs, Nextjs, Typescript, id} = req.body
    const distanceTime =  distanceTimeCount(StartDate, endDate)

    blogs[parseInt(id)] = {
        id,
        title,
        StartDate,
        endDate,
        description,
        distanceTime,
        technologies : [Nodejs, Reactjs, Nextjs, Typescript]
    }

    res.redirect('/home')
}