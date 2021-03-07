# Table of contents

- [Architecture](#architecture)
- [Kubernetes Command](#kubectl-cmd)
- [Flow of development](#flow-of-development)

# Overview

#### A ticketing platflorm where lot of users come and purchase tickets.

1. User can list tickets for events
2. Tickets are being sold and purchased
3. When user purchase ticket, ticket is locked for 15 mins. User has 15 min to enter payment information.
4. While locked no other user can purchase ticket.
5. Tickets prices can be changes/edited if not locked

#### Resources

1. User
2. Order
3. Ticket
4. Charge

#### Services

1. Auth - signin, signout and user auth
2. Tickets - Creating, editing ticket
3. Orders - Creating order
4. Expiration - Maintain and expire user ticket purchase session
5. Payments - Handles credit card payment.

#### Events

1. UserCreated
2. UserUpdated
3. OrderCreated
4. OrderUpdated
5. OrderExpired
6. TicketCreated
7. TicketUpdated
8. ChargeCreated

# Architecture

#### Docker

1. Docker container wrap up the npm and node dependencies in isolated env. We can then run this container and our code inside this container run using dockerfile config
2. Image of Docker Container

#### Kubernetes

1. If we have multiple docker container, kubernetes can be used to manage containers
2. Image of Kubernetes Cluster
3. Kubernetes Cluster - A collection of node (VM) + a master to manage them
4. Node - A VM that will run our container
5. Pod - A pod container single or multiple containers (kind:pod)
6. Deployment - Monitors Pods, helps them to restart if they crash. (kind:deployment)
7. Service - (Kubernetes services) Common communication channel to access running containers in different pods

   7.1 Cluster IP - Can be used to communicate btw different pods withing kubernetes cluster, it exposes a port and IP (backend)

   7.2 Node Port - Mostly used in development purpose, to access pod from outside kubernetes cluster (access via user's browser)

   Node Port Image

   Node Port service exposes the port as `portnumber/TCP` `3042/TCP`, we then make a request like `localhost:portnumber/resource` to access the post resource
   port: 4000 - node port service own port expose it to the browser
   targetPort: 4000 - port of the pod, nodePort send the message here on this port

   7.3 Load Balancer - Right way to access the pod from outside kubernetes cluster

   Single point of entry from react app then it routes to appropiate path (pod)

8. Ingress - A pod with a set of routing rules to distribute traffic to other services
   Image

# Kubernetes Command

1. `kubectl version`
2. `kubectl apply -f filename.yaml` to create a pod
3. `kubectl get pods` to inspect created pod
4. `kubectl exec it [pod-name] [cmd]` to go inside container
5. `kubectl logs [pod-name]` to see log of a pod
6. `kubectl describe pod [pod-name]`
7. `kubectl get services` to see the running services
8. `kubectl describe service [service-name]` to describe services

# Questions

1. How to access mongodb collection inside kubernetes cluster ?
   get the pod name, run this `kubectl exec --stdin --tty <mongodb-pod-name> -- sh`, use mongo related command

# Flow Of development

:rocket: Add mongoose and add `auth-mongo-depl.yaml` in infra dir.

:rocket: Make user model and add validation at the mongoose model

:rocket: Add Error handling class

:rocket: Use JWT and Cookie for auth

:rocket: JWT Secret should be in kube env `kubectl create secret generic jwt-secret --from-literal=JWT_SECRET_KEY=asdf`. Make changes to `auth-depl.yaml`

:rocket: Complete Signin, CurrentUser, SignOut and SignUp route

:rocket: Add jest and supertest for unit test and setup env for tests

:rocket: Add test for `/api/user/signup /api/user/signin /api/user/currentuser /api/user/signout` route test for invalid and valid input

:rocket: Add test client folder, setup nextjs and setup dockerfile and

:rocket: Make `client-depl.yaml` in infra/k8s and setup.

:rocket: Add clients in artifacts image in `skaffold.yaml`

:rocket: Add routing path to `ingress-srv.yaml`

:rocket: Add tailwind css and add signup and signin page

:rocket: Add current user and signout login page in NextJS

:rocket: Move Error handling logic to npm library (not doing right now)
