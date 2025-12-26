const http = require('http');

const baseUrl = "http://suraksha.local";
const endpoint = '/wp-json/wp/v2/search?subtype=resource&_embed';

console.log(`Fetching ${baseUrl + endpoint}...`);

http.get(baseUrl + endpoint, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const items = JSON.parse(data);
            console.log("Count:", items.length);
            if (items.length > 0) {
                const first = items[0];
                if (first._embedded && first._embedded.self && first._embedded.self[0]) {
                    const selfObj = first._embedded.self[0];
                    console.log("Self object found. Title:", selfObj.title.rendered);
                    console.log("Has ACF?", !!selfObj.acf);
                    if (selfObj.acf) {
                        console.log("ACF Keys:", Object.keys(selfObj.acf));
                    } else {
                        console.log("Full keys:", Object.keys(selfObj));
                    }
                } else {
                    console.log("Self object NOT found in _embedded");
                }
            }
        } catch (e) {
            console.error(e);
        }
    });
});
