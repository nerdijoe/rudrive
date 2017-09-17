# 273 Lab 1

# Dropbox

## Server 2

### User Model

| Field         | Data type     |
| --------------|:-------------:|
| firstname     | String        |
| lastname      | String        |
| email         | String        |
| password      | String        |



### End Points

### Authorization
Sign Up
```
POST - localhost:3000/auth/signup
```
| Field         |      |
| --------------|:-------------:|
| firstname     | required        |
| lastname      | required        |
| email         | required, unique        |
| password      | required        |


Sign In
```
POST - localhost:3000/auth/signin
```
| Field         |      |
| --------------|:-------------:|
| email         | required        |
| password      | required        |

Return token, email, and _id


### Users
```
Get all users - GET - localhost:3000/users

```

---
## Client 2

