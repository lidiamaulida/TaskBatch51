function submitData() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phoneNumber = document.getElementById("number").value;
    const subject = document.getElementById("select").value;
    const message = document.getElementById("message").value;

    if (name === "") {
        return alert ("Name must be filled!");
    } else if (email == "") {
        return alert ("Email must be filled!");
    } else if (number === "") {
        return alert ("Number must be filled!");
    } else if (subject === "") {
        return alert ("Subject must be selected!");
    } else if (message === "") {
        return alert ("Message must be filled!");
    }

    let emailReceiver = "liidia.maulida@gmail.com"

    let a = document.createElement("a");
    a.href = `mailto:${emailReceiver}?subject=${subject}&body=Hallo, my name ${name},${message}. Please contact me on number ${phoneNumber} or email me at ${email}`
    a.click()

    let data = {
        name : name,
        email : email,
        phoneNumber : phoneNumber,
        select : subject,
        message : message
    };

    console.log(data);
}