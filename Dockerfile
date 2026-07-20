# Dev Stage
FROM node:22-alpine AS dev

WORKDIR /app

# Copy package manifests for dependency layer caching
COPY package.json package-lock.json ./

# Install all dependencies including devDependencies for build phase
# Utilizing BuildKit's cache mounts to speed up ephemeral Cloud Build runs
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy application source code
COPY . .

# Compile/build the Vite application
RUN npm run build

# Runner Stage
FROM node:22-alpine AS runner

# Configure production environment
ENV NODE_ENV=production

WORKDIR /app

# Copy package manifests for production dependency install
COPY package.json package-lock.json ./

# Install only production dependencies (e.g. Express) to minimize footprint
RUN --mount=type=cache,target=/root/.npm npm ci --only=production

# Copy compiled static assets from dev stage
COPY --from=dev /app/dist ./dist

# Copy the Express server script
COPY --from=dev /app/server.js ./server.js

# Expose standard port
EXPOSE 3000

# Drop privileges to non-root 'node' user for security compliance
USER node

# Run the Node.js production server
CMD ["node", "server.js"]
