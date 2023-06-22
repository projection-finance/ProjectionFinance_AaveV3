# Projection Finance

CC BY-NC 4.0

This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/ or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.

contact@projection.finance

## Getting Started

### 1. First, install packages

```bash
npm install
# or
yarn install
```

### 2. Configure

Copy `.env.example` to `.env`

This is optional, actually we use MongoDB Atlas, the could hosted version of MongoDB.

Credentials are available on `.env.example`

### 3. Change key provider

service/aave.js

```
var providerUrl = 'https://mainnet.infura.io/v3/key';
```

### 4. Synchronise Database (PostgreSQL) and Prisma ORM

```bash
npx prisma db push
```

After that, you should be able to see your db opening a graphql client with this command :

```bash
npx prisma studio
```

### 5. Launch App

```bash
npm run dev
```
