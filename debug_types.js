const http = require('http');

const baseUrl = "http://suraksha.local";
const endpoint = '/wp-json/wp/v2/types';

const req = http.get(baseUrl + endpoint, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const types = JSON.parse(data);
            console.log("Registered Types:");
            Object.keys(types).forEach(key => {
                console.log(`- ${key}: ${types[key].rest_base} (Slug: ${types[key].slug})`);
            });
        } catch (e) {
            console.error("Error parsing types:", e);
        }
    });
});

req.on('error', (e) => {
    console.error(`Error: ${e.message}`);
});
