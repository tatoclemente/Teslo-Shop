# Descripción


## Correr en dev


1. Clonar el repositorio
2. Crear una copia de ```.env.templte``` y renombrarlo a ```.env``` y
cambiar las variables de entonrno
3. Instalar dependencias ```npm install```
4. Levantar la base de datos ```docker compose up -d```
5. Correr las migraciones de Prisma ```npx prisma migrate dev```
6. Llenar la base de datos ejecutando el "seed" ```npm run seed ```
7. Correr el proyecto ```npm run dev```


## Correnr en prod