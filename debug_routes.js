const http = require('http');

const baseUrl = "http://suraksha.local";
const endpoint = '/wp-json';

console.log(`Fetching ${baseUrl + endpoint}...`);

const req = http.get(baseUrl + endpoint, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const index = JSON.parse(data);
            const routes = Object.keys(index.routes);
            const resourceRoutes = routes.filter(r => r.includes('resource'));

            console.log("Details found for 'resource':");
            resourceRoutes.forEach(r => console.log(r));

            if (resourceRoutes.length === 0) {
                console.log("No routes found containing 'resource'.");
            }

        } catch (e) {
            console.error("Error parsing JSON:", e);
        }
    });
});

req.on('error', (e) => {
    console.error(`Error: ${e.message}`);
});
