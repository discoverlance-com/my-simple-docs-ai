# Stage 1: Build static files
FROM node:22 AS builder

WORKDIR /app
COPY . .

# Install dependencies and build
RUN npm install && npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built static files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
