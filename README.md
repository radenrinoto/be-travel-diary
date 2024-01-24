# Travel Diary

Travel diary backend:
* Express
* Sequelize
* Joi
* Cloudinary
* bcryptjs
* crypto-js

---

## URL

_Server_
```
http://localhost:3001
```
---

## How to setup and run project
_run command bellow_
```
npm install
```

```
npx sequelize-cli db:create
```

```
npx sequelize-cli db:migrate
```

```
npm run start
```


## Global Response

_Response (500 - Internal Server Error)_
```
{
  "message": "Internal Server Error"
}
```
---


## RESTful endpoints

### API User

### POST /api/user/register

> Register User

_Request Header_
```
not needed
```

_Request Body_
```
{
  "fullname" : "<encrypted_fullname>",
  "email" : "<encrypted_email>",
  "password" : "<encrypted_password>"
}
```

_Response (201)_
```
{
    "status": "Register Success"
}
```

_Response (400 - Validation Error)_
```
{
    "status": "Validation Error",
    "message": "\"password\" length must be at least 6 characters long"
}
```

_Response (400 - User already registered)_
```
{
    "status": "Bad Request",
    "message": "Email or Fullname already Exists"
}
```

---

### POST /api/user/login

> Login user

_Request Header_
```
not needed
```

_Request Body_
```
{
  "email" : "<encrypted_email>",
  "password" : "<encrypted_password>"
}
```

_Response (200)_
```
{
    "status": "Success",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJkdW1teUBtYWlsLmNvbSIsImZ1bGxuYW1lIjoiZHVtbXkiLCJpYXQiOjE3MDU5MDk3NzF9.f1xHZEDIWUpBzFCFFPLpmGVfSSkeappP6wk0JX-Cvl0"
    }
}
```

_Response (400 - Validation Error)_
```
{
    "status": "Validation Error",
    "message": "\"password\" length must be at least 6 characters long"
}
```

_Response (400 - Bad Request Invalid Password)_
```
{
    "status": "Bad Request",
    "message": "Invalid Password"
}
```

### GET /api/user/get-profile
_Request Header_
```
{
  Authorization: 'Bearer <token>'
}
```

_Response (200)_
```
{
    "status": "Success",
    "data": {
        "profile": {
            "fullname": "rinotoharto",
            "email": "rinotoharto@mail.com",
            "profileImage": null
        }
    }
}
```

_Response (401 - Invalid Token)_
```
{
    "status": "Unauthorized",
    "message": "Invalid Token"
}
```

### PATCH /api/user/update/profile

> Update Profile picture

_Request Header_
```
{
  Authorization: 'Bearer <token>'
}
```

_Request Body_
```
{
    profileImage: <file_image>
}
```

_Response (400 - Validation Error)_
```
{
    "status": "Validation Failed",
    "message": "Image is required"
}
```

_Response (200)_
```
{
    "status": "success"
}
```


---

### API Post

### GET /api/post

 > Get all post

_Request Params_

```
<type_name>/<species_name>/<animal_or_plant_name>

```

_Response (200)_
```
{
    "status": "Success",
    "data": [
        {
            "id": 1,
            "title": "Post Title",
            "imageUrl": "http://res.cloudinary.com/dme2lrwsd/image/upload/v1705897281/image/p0okyvw110pel8ugmep6.jpg",
            "shortDesc": "short description",
            "description": "Long description post",
            "timestamp": "22 January 2024",
            "user": {
                "fullname": "rinotoharto"
            }
        },
        {
            "id": 2,
            "title": "Post Title 2",
            "imageUrl": "http://res.cloudinary.com/dme2lrwsd/image/upload/v1705897930/image/kzj37ujzpf1fnuzwsnj1.jpg",
            "shortDesc": "short description 2",
            "description": "Long description post 2",
            "timestamp": "22 January 2024",
            "user": {
                "fullname": "rinotoharto"
            }
        }
    ]
}
```

### GET /api/detail/:id

> Get post by id

_Request Params_
```
/<post_id>
```

_Request Header_
```
not needed
```

_Response (200)_
```
{
    "status": "Success",
    "data": {
        "id": 1,
        "title": "Post Title",
        "imageUrl": "http://res.cloudinary.com/dme2lrwsd/image/upload/v1705897281/image/p0okyvw110pel8ugmep6.jpg",
        "shortDesc": "short description",
        "description": "Long description post",
        "timestamp": "22 January 2024",
        "user": {
            "fullname": "rinotoharto"
        }
    }
}
```

_Response (404 - Post not found)
```
{
    "status": "Not Found",
    "message": "Post not found"
}
```

### POST /api/post/create

> Create Post

_Request Header_
```
{
  Authorization: 'Bearer <token>'
}
```

_Request Body_
```
Request body using form data

{
  imageUrl: <image_file>,
  title: <post_title>,
  shortDesc: <post_shortDesc>,
  description: <post_description>
}
```

_Response (201)_
```
{
    "status": "Success",
    "data": "Successfuly create post"
}
```

_Response (400 - Validation Error)_
```
{
    "status": "Validation Error",
    "message": "title is required."
}
```

### GET /api/post/my-post

> Get all post by user_id

_Request Header_
```
{
  Authorization: 'Bearer <token>'
}
```

_Response (200)_
```
{
    "status": "Success",
    "data": [
        {
            "id": 1,
            "title": "Post Title",
            "imageUrl": "http://res.cloudinary.com/dme2lrwsd/image/upload/v1705897281/image/p0okyvw110pel8ugmep6.jpg",
            "shortDesc": "short description",
            "description": "Long description post",
            "timestamp": "22 January 2024",
            "user": {
                "fullname": "rinotoharto"
            }
        },
        {
            "id": 2,
            "title": "Post Title 2",
            "imageUrl": "http://res.cloudinary.com/dme2lrwsd/image/upload/v1705897930/image/kzj37ujzpf1fnuzwsnj1.jpg",
            "shortDesc": "short description 2",
            "description": "Long description post 2",
            "timestamp": "22 January 2024",
            "user": {
                "fullname": "rinotoharto"
            }
        }
    ]
}
```

### DELETE /api/post/remove/:id

> Delete Post by id

_Request Header_
```
{
  Authorization: 'Bearer <token>'
}
```

_Request Params_
```
/<id_post>
```

_Response (200)_
```
{
    "status": "Success"
}
```

_Response (400 - Not Found)_
```
{
    "status": "Not Found",
    "message": "Post Not Found"
}
```

_Response (403 - User Unauthorized)_
```
{
    "status": "Unauthorized",
    "message": "Forbidden access"
}
```

---

### API Bookmark
### GET /api/bookmark/

> Get All bookmark by user_id

_Request Header_
```
{
  Authorization: 'Bearer <token>'
}
```

_Response (200)_
```
{
    "status": "Success",
    "data": [
        {
            "id": 1,
            "idUser": 1,
            "idPost": 1,
            "userBookmarks": {
                "id": 1,
                "fullname": "rinotoharto",
                "email": "rinotoharto@mail.com",
                "profileImage": null,
                "image_public_id": null
            },
            "postBookmarks": {
                "id": 1,
                "title": "Post Title",
                "imageUrl": "http://res.cloudinary.com/dme2lrwsd/image/upload/v1705897281/image/p0okyvw110pel8ugmep6.jpg",
                "image_public_id": "image/p0okyvw110pel8ugmep6",
                "shortDesc": "short description",
                "description": "Long description post",
                "timestamp": "22 January 2024"
            }
        },
        {
            "id": 2,
            "idUser": 1,
            "idPost": 2,
            "userBookmarks": {
                "id": 1,
                "fullname": "rinotoharto",
                "email": "rinotoharto@mail.com",
                "profileImage": null,
                "image_public_id": null
            },
            "postBookmarks": {
                "id": 2,
                "title": "Post Title 2",
                "imageUrl": "http://res.cloudinary.com/dme2lrwsd/image/upload/v1705897930/image/kzj37ujzpf1fnuzwsnj1.jpg",
                "image_public_id": "image/kzj37ujzpf1fnuzwsnj1",
                "shortDesc": "short description 2",
                "description": "Long description post 2",
                "timestamp": "22 January 2024"
            }
        }
    ]
}
```
### POST /api/bookmark/create

> Add post to Bookmark

_Request Header_
```
{
  Authorization: 'Bearer <token>'
}
```

_Request Body_
```
{
  postId: <id_post>
}
```

_Response (400 - Post already bookmarked)_
```
{
    "status": "Bad Request",
    "message": "Post with this id already bookmarked"
}
```

_Response (400 - Post not found)_
```
{
    "status": "Not Found",
    "message": "Post not found"
}
```

_Response (400 - Validation Error)_
```
{
    "status": "Validation Error",
    "message": "postId is required."
}
```

_Response (201)_
```
{
    "status": "Success",
    "data": "Post added to bookmark"
}
```

### DELETE /api/bookmark/remove/:id

> Remove post from bookmark

_Request Header_
```
{
  Authorization: 'Bearer <token>'
}
```

_Request Params_
```
/<id_post>
```

_Response (404 - Post not found)_
```
{
    "status": "Not Found",
    "message": "Post Not Found"
}
```

_Response (200)_
```
{
    "status": "Success"
}
```
---
