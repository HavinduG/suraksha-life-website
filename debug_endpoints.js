const http = require('http'); // switched to http

const baseUrl = "http://suraksha.local";
const endpoints = [
    '/wp-json/wp/v2/resource',
    '/wp-json/wp/v2/resources',
    '/wp-json/wp/v2/types/resource',
    '/wp-json/wp/v2/types/resources',
    '/wp-json/wp/v2/posts' // Control check
];

function checkEndpoint(endpoint) {
    return new Promise((resolve) => {
        const url = baseUrl + endpoint;
        const req = http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                let count = 'N/A';
                try {
                    const json = JSON.parse(data);
                    if (Array.isArray(json)) {
                        count = `Array(${json.length})`;
                    } else if (json.code) {
                        count = `Error: ${json.code}`;
                    } else {
                        count = 'Object';
                    }
                } catch (e) { count = 'Parse Error'; }

                console.log(`Endpoint: ${endpoint} | Status: ${res.statusCode} | Result: ${count}`);
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error(`Endpoint: ${endpoint} | Error: ${e.message}`);
            resolve();
        });
    });
}

async function run() {
    console.log(`Checking endpoints on ${baseUrl}...`);
    for (const ep of endpoints) {
        await checkEndpoint(ep);
    }
}

run();
