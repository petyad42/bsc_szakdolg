

## Useful commands

    docker build -t petyad/resourcemanager .
    docker push petyad/resourcemanager:latest

    minikube start
    minikube status
    minikube delete

    For tunelling
    minikube service <servicename>

    For HPA:
    minikube addons enable metrics-server

    minikube dashboard
    
    Docker build target: minikube
    minikube -p minikube docker-env --shell powershell | Invoke-Expression 
    
    Revert to local Docker engine:
    minikube -p minikube docker-env --shell powershell -u | Invoke-Expression


    kubectl enalbe -f "filename"
    kubectl get pod,svc,deployment,hpa -o wide
    kubectl delete pod,svc,deployment,hpa <name>
    kubectl describe hpa
    
