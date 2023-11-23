# Pixel War

## Lancer en local

### Prérequis

- PostgreSQL
- NodeJS
- Yarn

### 1er Etape

Creer une base de données dans Postgres

```sql
CREATE DATABASE pixelwar;
```

Editer les parametres de connection (**DATABASE_URL**)  a la base de données dans le fichier **.env**

### 2eme Etape

Construction de l'application

```bash
yarn
yarn prisma db push
yarn build
yarn start
```

## Lancer avec Docker Compose

```sh
docker compose -f docker-compose-dev.yml up --build
```

Se rendre sur : http://localhost:3000
