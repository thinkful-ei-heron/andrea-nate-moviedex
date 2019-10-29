require('dotenv').config()
const express = require('express');
const morgan = require('morgan')
const cors = require('cors')
const movieData = require('./movieData.json')

console.log(process.env.API_TOKEN,'here')

const app = express()

app.use(morgan('dev'))
app.use(cors());

app.use(function validateBearerToken(req, res, next){
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if(!authToken || authToken.split(' ')[1] !== apiToken){
        return res.status(401).json({error: 'unauthorized request'})
    }
    next()
})

app.get('/movie', (req, res) => {
    let movies = movieData;
    const { genre, country, avg_vote } = req.query;

    if(genre){
        movies = movies.filter(movie => 
            movie.genre.toLowerCase().includes(genre.toLowerCase())
            );
    }

    if(country){
        movies = movies.filter(place =>
          place.country.toLowerCase().includes(country.toLowerCase())
          );
    }
    
    if(avg_vote){
        movies = movies.filter(vote => 
          vote.avg_vote >= avg_vote);
    }

    res.json(movies);
});

app.listen(8000, () => {
    console.log('listening on 8000....');
  });