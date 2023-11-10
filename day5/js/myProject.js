let dataBlog = [];

function addBlog(event) {
    event.preventDefault();

    let projectName = document.getElementById("input-projectname").value;
    let starDate = document.getElementById("input-startdate").value;
    let endDate = document.getElementById("input-enddate").value;
    let description = document.getElementById("input-description").value;
    let image = document.getElementById("input-image").files;
    let nodejs = document.getElementById("input-nodejs").checked;
    let nextjs = document.getElementById("input-nextjs").checked;
    let reactjs = document.getElementById("input-reactjs").checked;
    let typescript = document.getElementById("input-typescript").checked;

    image = URL.createObjectURL(image[0])

    let blog = {
        projectName,
        starDate,
        endDate,
        description,
        image,
        nodejs,
        nextjs,
        reactjs,
        typescript,
    };


    console.log(dataBlog);
    dataBlog.push(blog)
    renderBlog()
}



function renderBlog() {
    document.getElementById("contents").innerHTML = "";

    for (let index = 0; index < dataBlog.length; index++){
        console.log(dataBlog[index])
        const showNodeJsIcon = dataBlog[index].nodejs ? "" : "style='display: none;'";
        const showNextJs = dataBlog[index].nextjs ?  "" : "style='display: none;'";
        const showReactJs = dataBlog[index].reactjs ?  "" : "style='display: none;'";
        const showTypescript = dataBlog[index].typescript ?  "" : "style='display: none;'";



        document.getElementById("contents").innerHTML += `
            <div class="blog-list-items">
                <div class="blog-image">
                    <img src="${dataBlog[index].image}">
                </div>
                <div class="blog-content">
                    <h3>
                        <a href="detailProject.html">${dataBlog[index].projectName}</a>
                    </h3>
                    <div class="detail-blog-content">durasi : ${dateDiff(dataBlog[index].starDate, dataBlog[index].endDate)}</div>
                    <p>${dataBlog[index].description}</p>
                    <div class="icon">
                    <i class="fa-brands fa-node-js" ${showNodeJsIcon}></i>
                    <i class="fa-brands fa-google-play" ${showNextJs}></i>
                    <i class="fa-brands fa-android" ${showReactJs}></i>
                    <i class="fa-solid fa-mobile" ${showTypescript}></i>
                    </div>
                    <div class="btn-grup">
                        <button>edit</button>
                        <button>delete</button>
                    </div>
                </div>
            </div>
        `;  
    }
}

function dateDiff(start, end) {
    let starDate = new Date(start);
    let endDate = new Date(end);

    let distance = Math.abs(endDate - starDate);
    console.log (' distance ===> ', distance);
    
    let oneDay = 24 * 60 * 60 * 1000;
    let earlyYear = starDate.getFullYear();
    let earlyMonth = starDate.getMonth();
    let finalYear = endDate.getFullYear();
    let finalMonth = endDate.getMonth();

    let distanceDay = Math.floor(distance / oneDay);
    let distanceMonth = (finalYear - earlyYear) * 12 + (finalMonth - earlyMonth);

    if (distanceDay < 30) {
        return `${distanceDay} hari`
    } else if (distanceMonth > 0) {
        return `${distanceMonth} bulan`
    } else {
        return "tanggal tidak falid atau sama"
    }

}