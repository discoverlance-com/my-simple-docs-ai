# Stage 1: Build
FROM node:22 AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the app (generates .output)
RUN npm run build

# Stage 2: Production image
FROM node:22

WORKDIR /app

# Copy built output
COPY --from=builder /app/.output /app/.output

WORKDIR /app

EXPOSE 3000

CMD ["node", "./.output/server/index.mjs"]
