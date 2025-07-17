# Stage 1: Build the React application
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist /app
RUN npm install -g serve
EXPOSE 3001
CMD ["serve", "-s", ".", "-l", "3001"]

