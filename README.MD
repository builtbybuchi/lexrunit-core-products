This is the monorepo for all Lexrunit projects. 

- hospitalrun: is a clone of the official hospitalrun project archived in 2023. Our goal is to revive the project and make the database to use appwrite which can be hosted locally on the doctors/hospitals devices and then build a networking layer to connect it to the offline/on-prem feature of the lexcare-portal. (Offline first/On-premise first). 

- lexcare_ai2: This is the directory where Lexrunit AI is built. This is the single AI system that powers all of our applications with no exceptions. ai.lexrunit.com


- lexcare-app: This is the patient application for lexcare. lexcare.lexrunit.com


- lexcare-portal: This is the hospital/admin portal for lexcare. It is a universally accecisible portal for doctors to access the hospital at an time. It works as a standalone partner application for hospitals that users only the whatsapp bot or patient application. hopital.lexrunit.com

- lexcare-whatsapp-bot: This is Dr. Andrew's whatsapp bot which is used for medical traige and getting response to medical questions. wa.me/2349012512401

- official-website: This is the official website for Lexrunit. lexrunit.com

- Dr. Andre's website: This is the website for Dr. Andre. drandre.lexrunit.com



All app secrets are saved on Doppler: 
Lexrunit uses on centralized account to on Clerk for all products. 

Doppler Secrets: 
ACCESS_TOKEN Whatsapp access token
API_KEY whatsapp bot apikey, same as the LEXRUNIT_API_KEY
APP_ID whatsapp app id
APP_SECRET whatsapp app secret
APPWRITE_API_KEY
APPWRITE_ENDPOINT
APPWRITE_PROJECT
DOPPLER_TOKEN - added to the github actions to access these secrets
FLICKMART_API_KEY - Used by our patner, flickmart, to access the AI setup built for them
GOOGLE_API_KEY - google api key for indexing text books with google api-key
GROQ_API_KEY - groq api key for ai
LEXRUNIT_API_KEY - whatsapp bot api key and other backends
PHONE_NUMBER_ID - whatsapp bot phone number id
RECIPIENT_WAID - for testing and developement
VERIFY_TOKEN - whatsapp app verify token
VERSION - whatsapp api version
YOUR_PHONE_NUMBER - test whatsapp phone number 

Development Guide: 
The entire application here uses one database. Ensure to run you own local version of appwrite for developemnt. Ensure that any change while building one app does not break another application. 

- No PR to staging or main 
- All PR must be made to dev 
- Only reviewers or after review is code merged to staging and then to main as necessary. 
- Test application extensively on local before pushing to main 
- Ensure that build works locally before pushing 

Deployment Guide: 
The application deployment is handled by github actions. All applications are hosted on cloudflare. Internal testing staging deployments are used to test before final deployment, after your PR is merged to staging branch, you can check the staging link and test the changes. 

To deploy the base-backend-node to cloudflare, you can use the command below:

npm run deploy:prd - for production
npm run deploy:stg - for staging


