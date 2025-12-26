const http = require('http');

const baseUrl = "http://suraksha.local";
const endpoints = [
    '/wp-json/wp/v2/resource',
    '/wp-json/wp/v2/resource/',
    '/wp-json/wp/v2/resources',
];

function checkEndpoint(endpoint) {
    return new Promise((resolve) => {
        const url = baseUrl + endpoint;
        console.log(`Fetching ${url}...`);
        const req = http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                console.log(`Endpoint: ${endpoint}`);
                console.log(`Status: ${res.statusCode}`);
                if (res.statusCode !== 200) {
                    console.log(`Body: ${data.substring(0, 200)}`);
                } else {
                    try {
                        const json = JSON.parse(data);
                        console.log(`Count: ${json.length}`);
                    } catch (e) { console.log("Not JSON"); }
                }
                console.log('---');
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error(`Error: ${e.message}`);
            resolve();
        });
    });
}

async function run() {
    for (const ep of endpoints) {
        await checkEndpoint(ep);
    }
}

run();
