module.exports={
    // MONGOURI:"mongodb+srv://Prakhar:ZGoiL0jE7bH8ZvqA@cluster0.o3ghm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    MONGOURI:process.env.MONGOURI,
    JWT_SECRET:process.env.JWT_SEC,
    SENDGRID_API:process.env.SENDGRID_API,
    EMAIL:process.env.EMAIL
}