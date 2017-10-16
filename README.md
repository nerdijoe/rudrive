# 273 Lab 1

# Dropbox

## How to run the application

Server
```
$ cd server
$ yarn install

// MySQL database
// In most case, you need to create a database manually.
// Please change the db config accordingly, for example: username, password, db name,
$ sequelize db:migrate

$ yarn start
```

Client
```
$ cd client
$ yarn install

$ yarn start
// open localhost:3001

```


## Testing

Server

Please take a look at /server/app.js

and uncomment this line
```
const sequelize = new Sequelize(config.database, config.username, config.password, config);
```
Don't forget to comment the other one.


## Server

### User Model

| Field         | Data type     |
| --------------|:-------------:|
| firstname     | String        |
| lastname      | String        |
| email         | String        |
| password      | String        |



### End Points

### Authorization
#### Sign Up
```
POST - localhost:3000/authseq/signup
```
| Field         |      |
| --------------|:-------------:|
| firstname     | required        |
| lastname      | required        |
| email         | required, unique        |
| password      | required        |


#### Sign In
```
POST - localhost:3000/authseq/signin
```
| Field         |      |
| --------------|:-------------:|
| email         | required        |
| password      | required        |

Return token, email, and _id

#### User's About 
```
GET - localhost:3000/users/about
```
```
PUT - localhost:3000/users/about
```
| Field         |      |
| --------------|:-------------:|
| overview     | optional        |
| work      | optional        |
| education         | optional        |
| contact_info     | optional        |
| life_events     | optional        |


#### User's Interest
```
GET - localhost:3000/users/interest
```
```
PUT - localhost:3000/users/interest
```
| Field         |      |
| --------------|:-------------:|
| music     | optional        |
| shows      | optional        |
| sports         | optional        |
| fav_teams     | optional        |
| life_events     | optional        |


### Uploading a File
**Need user authentication**
```
Upload a file - POST - localhost:3000/uploads

```

Upload single file at a time.

Will upload to './public/uploads/<user@email.com>'

### Files
**Need user authentication**
```
Fetch user files - GET - localhost:3000/files/root

```

```
Star a file  - PUT - localhost:3000/files/star

```

### Folders
**Need user authentication**
```
Fetch user files - GET - localhost:3000/folders/root

```

```
Star a file  - PUT - localhost:3000/folders/star

```



---
## Client

* React.js
* React Semantic UI
* React Redux
* React Router Dom
* Axios


