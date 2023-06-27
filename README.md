# Projection Finance

Frontend application projection.finance.

## Getting Started

### 1. First, install packages

```bash
npm install
# or
yarn install
```

### 2. Configure

Copy `.env.example` to `.env`

### 3. Launch DB instance with docker

```bash
docker-compose up
```

This is optional, actually we use MongoDB Atlas, the could hosted version of MongoDB.

Credentials are available on `.env.example`

### 4. Synchronise Database and Prisma ORM

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 6. Bugs Notes

Issue with Prisma on `increment` operator. An `Int` field need to be set before being able to `increment`

```graphql
model Post {
  id        String  @id @default(auto()) @map("_id") @db.ObjectId
  title     String
  content   String?
  published Boolean @default(false)
  viewCount Int     @default(0) // this field need to be able to increment
  author    User?   @relation(fields: [authorId], references: [id])
  authorId  String?
}
```

### 7. Dev Notes

Here a task list that needs to be done before going to production.

- Secure Api calls with supertoken
- Clarify the use of `userId` variable, sometimes it reprensent id from Supertoken, sometimes our user ID


apres un changement : 

npx prisma db push

### Postgre Notes

SELECT setval(pg_get_serial_sequence('"User"', 'id'), coalesce(max(id)+1, 1), false) FROM "User";

SELECT setval(pg_get_serial_sequence('"Projection"', 'id'), coalesce(max(id)+1, 1), false) FROM "Projection";

SELECT setval(pg_get_serial_sequence('"Simulation', 'id'), coalesce(max(id)+1, 1), false) FROM "Simulation";


npx prisma generate
