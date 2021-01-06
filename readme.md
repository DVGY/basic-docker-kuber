# Flow Of developemnt

:rocket: Add mongoose and add `auth-mongo-depl.yaml` in infra dir.

:rocket: Make user model and add validation at the mongoose model

:rocket: Add Error handling class

:rocket: Use JWT and Cookie for auth

:rocket: JWT Secret should be in kube env `kubectl create secret generic jwt-secret --from-literal=JWT_SECRET_KEY=asdf`. Make changes to `auth-depl.yaml`

:rocket: Complete Signin, CurrentUser, SignOut and SignUp route

:rocket: Add jest and supertest for unit test and setup env for tests

:rocket: Add test for `/api/user/signup /api/user/signin /api/user/currentuser /api/user/signout` route test for invalid and valid input
