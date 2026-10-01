# 🌩️ Cloud-Native Microservices Architecture

[![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![Ionic](https://img.shields.io/badge/Ionic-%233880FF.svg?style=for-the-badge&logo=Ionic&logoColor=white)](https://ionicframework.com/)
[![Nginx](https://img.shields.io/badge/Nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)](https://nginx.org/en/)

## 📌 Project Overview
This repository contains a full-stack, distributed **Cloud-Native Microservices Application**. It is designed to demonstrate advanced enterprise deployment patterns including containerization, container orchestration, reverse proxy API Gateways, and decoupled backend services.

The monolith has been broken down into independent microservices (`user-service`, `feed-service`, and `frontend`), all routed securely through an NGINX API Gateway, and deployed dynamically onto a Kubernetes (K8s) cluster.

## 🏗️ System Architecture

```mermaid
flowchart TD
    User(["🌐 End User / Client"])
    
    subgraph K8s Cluster
        Ingress[["⚡ NGINX Reverse Proxy"]]
        
        subgraph Microservices
            Frontend["🖥️ Frontend (Ionic/Angular)"]
            UserAPI["🔐 User Service (Node.js)"]
            FeedAPI["📸 Feed Service (Node.js)"]
        end
        
        subgraph Stateful Storage
            Postgres[("🐘 Amazon RDS PostgreSQL")]
            S3[("🪣 AWS S3 Object Storage")]
        end
    end
    
    User -- HTTPS Request --> Ingress
    Ingress -- "/api/v0/users" --> UserAPI
    Ingress -- "/api/v0/feed" --> FeedAPI
    Ingress -- "/" --> Frontend
    
    UserAPI -- Authenticate & Persist --> Postgres
    FeedAPI -- Read/Write Metadata --> Postgres
    FeedAPI -- Store Images --> S3
```

## 🛠️ Service Topology
| Microservice | Location | Responsibility |
| :--- | :--- | :--- |
| **Frontend** | `/frontend` | The client-facing Ionic/Angular SPA. |
| **User API** | `/user-service` | Handles JWT authentication, registration, and user data logic. |
| **Feed API** | `/feed-service` | Handles image feed management and uploads to S3. |
| **API Gateway** | `/deployment/docker/nginx.conf` | Routes external traffic to the correct internal microservice. |
| **Kubernetes** | `/deployment/k8s` | K8s manifests for Deployments, Services, ConfigMaps, and Secrets. |

## 🚀 Deployment Guide

### Local Deployment (Docker Compose)
To run the entire distributed architecture locally on your machine:
```bash
cd deployment/docker
docker-compose up --build
```

### Production Deployment (Kubernetes)
To deploy the microservices to an active AWS EKS or local Minikube cluster:
```bash
cd deployment/k8s

# 1. Apply Configuration and Secrets
kubectl apply -f env-configmap.yaml
kubectl apply -f env-secret.yaml
kubectl apply -f aws-secret.yaml

# 2. Deploy Microservices
kubectl apply -f backend-feed-deployment.yaml
kubectl apply -f backend-user-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f reverseproxy-deployment.yaml

# 3. Expose Services
kubectl apply -f backend-feed-service.yaml
kubectl apply -f backend-user-service.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f reverseproxy-service.yaml
```

## 👨‍💻 Cloud Architect
Engineered by **Lokesh Gounder**  
📧 [lokeshgounder@gmail.com](mailto:lokeshgounder@gmail.com)  
🔗 [GitHub Profile](https://github.com/LOKESH10796)
