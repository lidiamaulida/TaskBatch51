const testimonial = new Promise ((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.open ('GET', "https://api.npoint.io/aeb258bfc38b1879c23e", true)

    xhr.onload = function() {
        if(xhr.status === 200) {
            resolve(JSON.parse(xhr.response))
        } else {
            reject("Eror Loading data")
        }
    }

    xhr.onerror = function () {
        reject("Network Eror")
    }

    xhr.send()
})

function html(item) {
    return `
    <div class="testimonial">
                <img
                class="profile-testimonial"
                 src="${item.image}" alt="profile">
                <p class="quote">"${item.quote}"</p>
                <p class="autor">-${item.author}</p>
                <p class="autor">${item.rating} <i class="fa-solid fa-star"></i></p>
            </div>`
}

async function allTestimonial() {
    let testimonialHTML = ``
    const testimonials = await testimonial
    testimonials.forEach((item) => {
        testimonialHTML += html(item)
    })

    // console.log(allTestimonial);

    document.getElementById("testimonials").innerHTML = testimonialHTML
}

allTestimonial ()

async function filterTestimonial(rating) {
    let testimonialHTML = ``
    const testimonials = await testimonial
    const testimonialFiltered = testimonials.filter((item) => {
        return item.rating === rating
    })

    console.log(testimonialFiltered)

    if (testimonialFiltered.length === 0) {
        testimonialHTML = `<h3> Data not found! </h3>`
    } else {
        testimonialFiltered.forEach((item) => {
            testimonialHTML += html(item)
        })
    } 

    document.getElementById("testimonials").innerHTML = testimonialHTML
}