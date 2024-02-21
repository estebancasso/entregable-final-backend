const User = require("../../models/User")

const userCreate = async () => {
    await User.create({
        firstName: "Esteban",
        lastName: "Casso",
        email: "johancasso0@gmail.com",
        password: "Esteban1234",
        phone: "+573245644556",
    })
}

module.exports = userCreate