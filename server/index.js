// 1. import json-server 
const jsonServer = require('json-server')

// 2.create a server using jsonServer 
const rbuilderServer = jsonServer.create()

// 3.creation of middleware 
const middleware = jsonServer.defaults()

// 4. router setup 
const router = jsonServer.router('db.json')

//5. implementing use 
rbuilderServer.use(middleware)
rbuilderServer.use(router)

//6. port creation
const port = process.env.port ||  3000

// 7. start server 
rbuilderServer.listen(port,()=>{
    console.log("Resume Builder Server running on the port "+port);
    
})