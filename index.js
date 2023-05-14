const express = require("express")
const redis = require("redis")




const PORT = process.env.PORT ||5000
const REDIS_PORT = process.env.PORT ||6379

const client = redis.createClient();

const app = express();

function setResponse(username, repos){
    return `<h2>${username} has ${repos} Github Repos</h2>`;
}


async function getRepos(req, res,next){

    try {
        console.log('Fetching Data...')

        const{username} = req.params;
        console.log(username)
        const response = await fetch(`https://api.github.com/users/${username}`);

        const data = await response.json();

        const repos = data.public_repos;

        // client.setEx(username,3600,repos);

        
        await client.connect();

        await client.set(username,repos);
        await client.disconnect();
         res.send(setResponse(username,repos));
        
    } catch (error) {
        console.error(err)
        res.status(500);
    }
}


app.get('/repo/:username',getRepos);



app.listen(5000,()=>{
    console.log(`App listening on port ${PORT}`);
})