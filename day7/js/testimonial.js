class testimonials {
    constructor(author, quote, image) {
        this.author = author
        this.quote = quote
        this.image = image
    }

    html() {
        return`
        <div class="testimonial">
                <img
                class="profile-testimonial"
                 src="${this.image}" alt="profile">
                <p class="quote">"${this.quote}"</p>
                <p class="autor">-${this.author}</p>
            </div>
        `
    }
}

const testimonial1 = new testimonials("Mark", "Good!", "https://i.pinimg.com/564x/ae/0e/1f/ae0e1f4bcc364ee784122513c850d855.jpg")
const testimonial2 = new testimonials("Gina", "Keren mantap", "https://i.pinimg.com/564x/98/3e/45/983e452644ebb81680c60de3f2128a9e.jpg")
const testimonial3 = new testimonials("Milly", "Kerjanya bagus", "https://i.pinimg.com/564x/21/ca/8b/21ca8b79b88a91a628b9464f98eeedfe.jpg")
const testimonial = [testimonial1, testimonial2, testimonial3]

let testimonialHTML = ``
for(let index= 0; index < testimonial.length; index++) { 
    testimonialHTML += testimonial[index].html()
}

document.getElementById("testimonials").innerHTML = testimonialHTML
