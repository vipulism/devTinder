# devTinder Api List

authRouter
- POST / signup
- POST / login
- POST / logout

profileRouter
- GET / profile/view
- PATCH / profile/edit
- PATCH / profile/password

connectionRequestRouter
- POST / request/send/:status/:userId
- POST / request/review/:status/:requestId

userRouter
- GET / user/requests/received
- GET / user/connections
- GET / user/feed



status: ignore, interested, accepted, rejected

-----
ECS stop req: 16382565