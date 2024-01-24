# Teslo Shop

**A clone of the official Tesla store**

## Running in dev

1. Clone the repository
[![GitHub Clone Button](https://img.shields.io/badge/Clone--red.svg?style=flat)]([https://github.com/Klerith/nest-teslo-shop](https://github.com/tatoclemente/Teslo-Shop.git))

2. Create a copy of `.env.template` and rename it to `.env` and change the environment variables.

3. Install dependencies `npm install`

4. Start the database `docker compose up -d`

5. Run the Prisma migrations `npx prisma migrate dev`

6. Fill the database by running the "seed" `npm run seed`

7. Run the project `npm run dev`

## Running in prod

1. Follow the steps for running in dev

2. Create a production build `npm run build`

3. Deploy the production build to your web server


## Troubleshooting

If you encounter any problems running the project, please check the following:

* Make sure that you have the correct version of Node.js installed.
[![Node.js version](https://img.shields.io/badge/Node.js_version-green.svg?style=flat)](https://nodejs.org/en/download/)
* Make sure that you have the correct version of Docker installed.
[![Docker version](https://img.shields.io/badge/Docker_version-blue.svg?style=flat)](https://docs.docker.com/get-started/)
* Make sure that you have the correct environment variables set.

<hr />

## Thank you for reading!

Visit my LinkedIn Profile here: 
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?logo=LinkedIn&logoColor=white&labelColor=101010)](https://linkedin.com/in/tatoclemente/)


