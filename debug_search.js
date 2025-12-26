const http = require('http');

const baseUrl = "http://suraksha.local";
const endpoint = '/wp-json/wp/v2/search?subtype=resource';

console.log(`Fetching ${baseUrl + endpoint}...`);

http.get(baseUrl + endpoint, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const items = JSON.parse(data);
            console.log("Count:", items.length);
            if (items.length > 0) {
                console.log("First item:", items[0]);
            }
        } catch (e) {
            console.error(e);
        }
    });
});
