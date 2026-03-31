Setting up the backend

npm installations for the backend
npm init -y (package json)
npm i express
npm install express@5.2.1 cors@2.8.5 dotenv@17.2.3 drizzle-orm@0.44.7 pg@8.16.3 @clerk/express@1.0.1 

i use typescript in the dev fase
npm install -D typescript@5.9.3 ts-node@10.9.2 nodemon@3.1.11 drizzle-kit@0.31.7 @types/express@5.0.6 @types/cors@2.8.19 @types/pg@8.15.6

add tsconfig.json so that type script can run with node

scripts under de package.json
    "dev": "nodemon",
    "build": "tsc" will create a file under dist to compile ts into js
add nodemon.json in de backend

---
Setting up the frontend

npm installation for the frontend
npm create vite@latest .