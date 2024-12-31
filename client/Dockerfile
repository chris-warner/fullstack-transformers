# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . ./
RUN npm run build

# Stage 2: Serve the app
FROM node:18-alpine AS production

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY package.json package-lock.json ./
RUN npm install --production

EXPOSE 3000

CMD ["npm", "start"]
