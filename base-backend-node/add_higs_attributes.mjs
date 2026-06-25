import { Client, Databases } from 'node-appwrite';

const client = new Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('lexrunit-general-db')
    .setKey('standard_f8c9fc153a47184784fb9ec3e68ed3b0dec070e4409f9cc4d3a69a7992eacef304813a7c00ec5d5b76458c78c2de32c52725a00530e8c520e47be7b2795b88c7bc08a069e8e14ef630648d6f65905d5081ad9492c00d0424ea00245214e783fb5e977686e00a0d02b7090a8bebffa2276e410ecfc8efa69aab83010cfdf49d7d');

const databases = new Databases(client);

async function run() {
    try {
        console.log('Creating attributes for higs_events...');
        try {
            await databases.createStringAttribute('website-db', 'higs_events', 'title', 256, true);
            console.log('title created');
        } catch (e) { console.log(e.message); }
        
        try {
            await databases.createStringAttribute('website-db', 'higs_events', 'description', 5000, true);
            console.log('description created');
        } catch (e) { console.log(e.message); }
        
        try {
            await databases.createBooleanAttribute('website-db', 'higs_events', 'isActive', true);
            console.log('isActive created');
        } catch (e) { console.log(e.message); }
    } catch (e) {
        console.error(e);
    }
}
run();
