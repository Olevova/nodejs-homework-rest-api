FROM node
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3030
CMD ['node', 'app']