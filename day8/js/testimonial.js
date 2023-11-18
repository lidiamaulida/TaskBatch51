const testimonials = [ 
    {
        author : "Anne",
        quote : "Lumayan", 
        image : "https://i.pinimg.com/564x/42/26/e6/4226e6e7c598fe6044250047ac84aad8.jpg",
        rating : 3
    },
    {
        author : "Mark",
        quote : "Good!",
        image : "https://i.pinimg.com/564x/ae/0e/1f/ae0e1f4bcc364ee784122513c850d855.jpg",
        rating: 5
    },
    {
        author : "Gina",
        quote : "Keren mantap",
        image : "https://i.pinimg.com/564x/98/3e/45/983e452644ebb81680c60de3f2128a9e.jpg",
        rating : 5
    },
    {
        author : "Milly",
        quote : "Bagus",
        image : "https://i.pinimg.com/564x/21/ca/8b/21ca8b79b88a91a628b9464f98eeedfe.jpg",
        rating : 4
    },
    {
        author : "Raka",
        quote : "Sering Error",
        image : "https://i.pinimg.com/564x/27/40/c4/2740c4a2d3e24f51d2694971dca4e9f3.jpg",
        rating : 1
    }
]

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

function allTestimonial() {
    let testimonialHTML = ``
    testimonials.forEach((item) =>{
        testimonialHTML += html(item)
    })

    document.getElementById("testimonials").innerHTML = testimonialHTML
}

allTestimonial ()

function filterTestimonial(rating) {
    let testimonialHTML = ``
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