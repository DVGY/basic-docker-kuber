# Table of contents

- [Architecture](#architecture)
- [Event Flow](#event-flow)
- [Kubernetes Command](#kubectl-cmd)
- [Questions](#questions)
- [Flow of development](#flow-of-development)
- [Learnings](#learnings)
- [Edge Cases](#edge-cases)
- [Todo](#todo)

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
4. Payments

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
8. PaymentCreated

# Architecture

#### Docker

1. Docker container wrap up the npm and node dependencies in isolated env. We can then run this container and our code inside this container run using dockerfile config
2. Image of Docker Container

![Docker Container](https://github.com/DVGY/basic-docker-kuber/blob/master/readme%20images/Docker.png)

#### Kubernetes

1. If we have multiple docker container, kubernetes can be used to manage containers
2. Image of Kubernetes Cluster

![Kubernetes Cluster](https://github.com/DVGY/basic-docker-kuber/blob/master/readme%20images/Kubernetes%20Cluster.png)

3. Kubernetes Cluster - A collection of node (VM) + a master to manage them
4. Node - A VM that will run our container
5. Pod - A pod container single or multiple containers (kind:pod)
6. Deployment - Monitors Pods, helps them to restart if they crash. (kind:deployment)
7. Service - (Kubernetes services) Common communication channel to access running containers in different pods

   7.1 Cluster IP - Can be used to communicate btw different pods withing kubernetes cluster, it exposes a port and IP (backend)

   ![ Cluster IP](https://github.com/DVGY/basic-docker-kuber/blob/master/readme%20images/Cluster%20IP.png)

   7.2 Node Port - Mostly used in development purpose, to access pod from outside kubernetes cluster (access via user's browser)

   Node Port Image

   ![Node Port](https://github.com/DVGY/basic-docker-kuber/blob/master/readme%20images/Node%20Port.png)

   Node Port service exposes the port as `portnumber/TCP` `3042/TCP`, we then make a request like `localhost:portnumber/resource` to access the post resource
   port: 4000 - node port service own port expose it to the browser
   targetPort: 4000 - port of the pod, nodePort send the message here on this port

   7.3 Load Balancer - Right way to access the pod from outside kubernetes cluster

   Single point of entry from react app then it routes to appropiate path (pod)

8. Ingress - A pod with a set of routing rules to distribute traffic to other services
   Image

   ![Load balancer](https://github.com/DVGY/basic-docker-kuber/blob/master/readme%20images/Load%20Balancer.png)

9. NATS Streaming server

   node-nats-streaming - client to communicate with nats streaming server
   A service emits an event, event reaches to NATS Streaming server, event is then emitted to the service which listen on that using channel or topic subscription

   nats-streaming-server - exposes multiple port, 4222 in for client and 8222 is for information

   ![NATS Architecture](https://github.com/DVGY/basic-docker-kuber/blob/master/readme%20images/NATS%20Architecture.png)

   App Architecture

   ![App Architecture](https://github.com/DVGY/basic-docker-kuber/blob/master/readme%20images/App%20arch%20design.png)

# Event Flow

1. Services Event and NATS
   ![Services Event and NATS](https://github.com/DVGY/basic-docker-kuber/blob/master/readme%20images/Services%20Event%20%20and%20NATS.png)

2. Ticket Created and NATS
   ![Services Event and NATS](https://github.com/DVGY/basic-docker-kuber/blob/master/readme%20images/Ticket%20Created%20NATS.png)

3. Ticket Updated and NATS
   ![Services Event and NATS](https://github.com/DVGY/basic-docker-kuber/blob/master/readme%20images/Ticket%20Updated%20NATS.png)

4. Order Service and NATS
   ![Services Event and NATS](https://github.com/DVGY/basic-docker-kuber/blob/master/readme%20images/Order%20Service%20NATS.png)

5. Order Created and NATS
   ![Services Event and NATS](https://github.com/DVGY/basic-docker-kuber/blob/master/readme%20images/Order%20Created%20NATS.png)

6. Order Cancelled and NATS
   ![Services Event and NATS](https://github.com/DVGY/basic-docker-kuber/blob/master/readme%20images/Order%20Cancelled%20NATS.png)

7. Order Cancelled and NATS
   ![Services Event and NATS](https://github.com/DVGY/basic-docker-kuber/blob/master/readme%20images/Order%20Cancelled%20NATS.png)

8. Expiration Complete and NATS
   ![Services Event and NATS](https://github.com/DVGY/basic-docker-kuber/blob/master/readme%20images/Expiration%20Complete%20NATS.png)

9. Charge/Payment Created and NATS
   ![Services Event and NATS](https://github.com/DVGY/basic-docker-kuber/blob/master/readme%20images/Charge%20Created%20NATS.png)

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

   Ans : `kubectl exec -it tickets-mongo-depl-685f7f898-tp27w mongo mongodb://localhost:27017/tickets`

# Flow Of development

:rocket: Add mongoose and add `auth-mongo-depl.yaml` in infra dir.

:rocket: Make user model and add validation at the mongoose model

:rocket: Add Error handling class

:rocket: Use JWT and Cookie for auth

:rocket: JWT Secret should be in kube env `kubectl create secret generic jwt-secret --from-literal=JWT_SECRET_KEY=asdf`. Make changes to `auth-depl.yaml`
ex(`kubectl create secret generic jwt-secret-key --from-literal=JWT_SECRET_KEY=MY_ULTRA_STRONG_JWT_SECRET_KEY`)

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

:rocket: Make yaml file for tickets, `tickets-depl.yaml`, `tickets-mongo-depl.yaml`

:rocket: Make env (MONGO_URI) for tickets-mongo-srv and auth-mongo-srv

:rocket: Make ticket folder and install all dependencies required

:rocket: Write test for `/api/tickets` (CRUD) route (test first approach)

:rocket: Make controller for `/api/tickets` (CRUD) route (test first approach)

:rocket: Make tickets model and handle validations

:rocket: Make `nats-depl.yaml` in infra/k8s and setup.

:rocket: Create a `listener.ts` file in nats dir and make an `abstract class listner`.

:rocket: Create a `publisher.ts` file in nats dir and make an `abstract class publisher`.

:rocket: Move a all the base events into common `dir`.

:rocket: As soon as a new ticket is created we need to emit an event `ticket:created` using event publisher class and send to listner(nats streaming listener).
Create a new `TicketCreatedPublisher class` and use it to publish event.

:rocket: Implement a singleton class for stan (NATS Client) and use it throught the service.

:rocket: Move common dir to npm library.

:rocket: Update failing test suit bcz of publish base class. Make a mock func implementation

:rocket: Add env variable for NATS. Update the `client-depl.yaml` file

:rocket: Make boiler plate for order service as done in ticket service

:rocket: Make controller for `/api/orders` (CRUD) route (test last approach)

:rocket: Make listener class in orders service. One listner listens for ticket created event and one for ticket updated. Here we need to save the ticket information in the order service

:rocket: Adjust the `_id` of `Tickets` model in orders service so that it matches up with the Tickets service

:rocket: start listening for `ticket:created` and `ticket:updated` event on order service

:rocket: Implement concurrency control for ticket updated using mongoose versioning by primary service (Tickets service) and tickets service inside orders

:rocket: Implement concurrency control for Orders service

:rocket: Implement `Listner` for `order:created` in tickets service. Lock the ticket and prevent from changing.

:rocket: Implement `Listner` for `order:cancelled` in tickets service.

:rocket: Setup boiler plate for Expiration service.

:rocket: Setup boiler plate for Payment service.

:rocket: Create Orders model in Payment service.

:rocket: Make `OrderCreatedListner` and `OrderCancelledListner` for payment service.

:rocket: Write test for `OrderCreatedListner` and `OrderCancelledListner` and test with postman too.

:rocket: Setup stripe and `createPayments` route and set up stripe secret key `kubectl create secret generic stripe-secret-key --from-literal=STRIPE_SECRET_KEY=<MY STRIPE SECRET FROM STRIPE DASHBOARD>`.

:rocket: Process the payment before it expires and publish an event about successfull payment creation.

:rocket: Order Service Listens for payment created event and set the status of the order to complete.

# Learning

1. A middleware for authorized/protected routes checks whether the user has valid JWT Token. If not it should restrict access and send a valid error msg to error middleware. If token exist it should set some property on `req object` (`req.userToken or req.user`) and pass execution to next succedding middleware, so user should be able to acccess the route (ex: like `protect.ts` or `requireAuth`)

2. In testing environment somehow `req.signedCookles.jwt` is undefined but `req.cookies.jwt` is valid token, when we set header as set('Cookie',cookie) (tickets service)

3. kubectl port-forwarding - It helps to redirect the connection from local port to the port in the pod.

4. Singleton Class: A class whose object is created once and shared across program (ex mongoose)

5. It important to run `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.44.0/deploy/static/provider/cloud/deploy.yaml` in infra/k8s dir.

6. Versioning of record like `tickets`. I understood how versioning can be helpful and I was able to related this to sharepoint documents versions

7. An order contains the ticket that is purchased. If a new order is created we need to make sure that ticket does not exist with in order. So we need to query each order and then find inside it ticket is reserved/purchased . So embedding a ticket inside a order does not make sense. We will create a reference to ticket inside of order.

8. While creating order service boilerplate we wanted to test api/order (create order) service we wrote test. Postman will not work, at this time we did not have the NATS Event publishing for ticket created fully working. So If we create a ticket, it will just publish an event ticket created, we are not saving the ticket or getting the ticket data from published event at this point in time. So testing the service using jest and superman was necessary (no exchange of data through eventing service)

9. I lack mongodb database modelling knowledege

# Edge Cases

1. If a user sign in and closes tab, then he should not be asked to enter password again implement a `isLoggedIn controller`

# Todo

1. In the auth service, implement a isLoggedIn middleware. it should pass the control to next router.
2. Refactor at the common utils func into a single module or lib. Do it at the end of course
