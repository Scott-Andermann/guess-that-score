import axios from "axios";

export default axios.create({
    baseURL: 'https://api.sportsdata.io/v3/cfb/scores/json',
    headers: {
        'Access-Control-Allow-Credentials':true,
    }
})