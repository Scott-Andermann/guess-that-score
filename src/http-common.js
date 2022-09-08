import axios from "axios";

const key = 'f20f8f675eeb4d6ba5c4bc93e89c4ad2'

export default axios.create({
    baseURL: 'https://api.sportsdata.io/v3/cfb/scores/json',
    headers: {
        'Access-Control-Allow-Credentials':true,
        "Ocp-Apim-Subscription-Key": key
    }
})