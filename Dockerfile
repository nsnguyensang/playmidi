FROM node:18-alpine
WORKDIR /app
COPY . .
EXPOSE 4200
RUN npm install -g @angular/cli@14.0.0
#RUN npm install -g ionic
RUN npm install
#CMD ng serve --host 0.0.0.0
CMD ["npm", "start"]