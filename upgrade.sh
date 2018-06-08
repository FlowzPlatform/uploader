# curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
# -X POST \
# -H 'Accept: application/json' \
# -H 'Content-Type: application/json' \
# -d '{
#      "inServiceStrategy":{"launchConfig": {"imageUuid":"docker:obdev/dbetl_backend_flowz:master","kind": "container","labels":{"io.rancher.container.pull_image": "always","io.rancher.scheduler.affinity:host_label": "machine=cluster-flowz"},"ports": ["3034:3034/tcp","4034:4034/tcp"],"version": "0","environment": {"RDB_HOST": "'"$RDB_HOST"'","RDB_PORT": "'"$RDB_PORT"'","rauth": "'"$RAUTH"'","cert": "'"$CERT"'"},"healthCheck": {"type": "instanceHealthCheck","healthyThreshold": 2,"initializingTimeout": 60000,"interval": 2000,"name": null,"port": 3034,"recreateOnQuorumStrategyConfig": {"type": "recreateOnQuorumStrategyConfig","quorum": 1},"reinitializingTimeout": 60000,"responseTimeout": 60000,"strategy": "recreateOnQuorum","unhealthyThreshold": 3},"networkMode": "managed"}},"toServiceStrategy":null}' \
# 'http://rancher.flowz.com:8080/v2-beta/projects/1a29/services/1s491?action=upgrade'
#
# # curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
# # -X POST \
# # -H 'Accept: application/json' \
# # -H 'Content-Type: application/json' \
# # -d '{
# #      "inServiceStrategy":{"launchConfig": {"imageUuid":"docker:obdev/dbetl_frontend_flowz:master","kind": "container","labels":{"io.rancher.container.pull_image": "always","io.rancher.scheduler.affinity:host_label": "machine=dbetl-front"},"ports": ["80:80/tcp","443:443/tcp"],"version": "0","healthCheck": {"type": "instanceHealthCheck","healthyThreshold": 2,"initializingTimeout": 60000,"interval": 2000,"name": null,"port": 80,"recreateOnQuorumStrategyConfig": {"type": "recreateOnQuorumStrategyConfig","quorum": 1},"reinitializingTimeout": 60000,"requestLine": "GET \"http://localhost\" \"HTTP/1.0\"","responseTimeout": 60000,"strategy": "recreateOnQuorum","unhealthyThreshold": 3},"networkMode": "managed"}},"toServiceStrategy":null}' \
# # 'http://rancher.flowz.com:8080/v2-beta/projects/1a29/services/1s490?action=upgrade'
#


if [ "$TRAVIS_BRANCH" = "master" ]
then
    {
    echo "call $TRAVIS_BRANCH branch"
    ENV_ID=`curl -u ""$RANCHER_ACCESSKEY_MASTER":"$RANCHER_SECRETKEY_MASTER"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL_MASTER/v2-beta/projects?name=Production" | jq '.data[].id' | tr -d '"'`
    echo $ENV_ID
    USERNAME="$DOCKER_USERNAME_FLOWZ";
    jobqueueUrl="$JOBQUEUEURL_MASTER";
    DOMAINKEY="$DOMAINKEY_MASTER";
    TAG="latest";
    SERVICE_NAME_BACKEND="$SERVICE_NAME_BACKEND_MASTER";
    SERVICE_NAME_FRONTEND="$SERVICE_NAME_FRONTEND_MASTER";
    FRONT_HOST="$FRONT_HOST_MASTER";
    BACKEND_HOST="$BACKEND_HOST_MASTER";
    STACK_SERVICE_NAME_FOR_FRONT="$STACK_SERVICE_NAME_FOR_FRONT_MASTER";
    RANCHER_ACCESSKEY="$RANCHER_ACCESSKEY_MASTER";
    RANCHER_SECRETKEY="$RANCHER_SECRETKEY_MASTER";
    RANCHER_URL="$RANCHER_URL_MASTER";
    MONGODB_DATABASE="$MONGODB_DATABASE_MASTER";
    cloudname="$cloudname_master";
    apikey="$apikey_master";
    apisecret="$apisecret_master";
  }
elif [ "$TRAVIS_BRANCH" = "develop" ]
then
    {
      echo "call $TRAVIS_BRANCH branch"
      ENV_ID=`curl -u ""$RANCHER_ACCESSKEY_DEVELOP":"$RANCHER_SECRETKEY_DEVELOP"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL_DEVELOP/v2-beta/projects?name=Develop" | jq '.data[].id' | tr -d '"'`
      echo $ENV_ID
      USERNAME="$DOCKER_USERNAME";
      jobqueueUrl="$JOBQUEUEURL_DEVELOP";
      DOMAINKEY="$DOMAINKEY_DEVELOP";
      TAG="dev";
      SERVICE_NAME_BACKEND="$SERVICE_NAME_BACKEND_DEVELOP";
      SERVICE_NAME_FRONTEND="$SERVICE_NAME_FRONTEND_DEVELOP";
      FRONT_HOST="$FRONT_HOST_DEVELOP";
      BACKEND_HOST="$BACKEND_HOST_DEVELOP";
      STACK_SERVICE_NAME_FOR_FRONT="$STACK_SERVICE_NAME_FOR_FRONT_DEVELOP";
      RANCHER_ACCESSKEY="$RANCHER_ACCESSKEY_DEVELOP";
      RANCHER_SECRETKEY="$RANCHER_SECRETKEY_DEVELOP";
      RANCHER_URL="$RANCHER_URL_DEVELOP";
      MONGODB_DATABASE="$MONGODB_DATABASE_DEVELOP";
      cloudname="$cloudname_develop";
      apikey="$apikey_develop";
      apisecret="$apisecret_develop";
  }
elif [ "$TRAVIS_BRANCH" = "staging" ]
then
    {
      echo "call $TRAVIS_BRANCH branch"
      ENV_ID=`curl -u ""$RANCHER_ACCESSKEY_STAGING":"$RANCHER_SECRETKEY_STAGING"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL_STAGING/v2-beta/projects?name=Staging" | jq '.data[].id' | tr -d '"'`
      echo $ENV_ID
      USERNAME="$DOCKER_USERNAME";
      jobqueueUrl="$JOBQUEUEURL_STAGING";
      DOMAINKEY="$DOMAINKEY_STAGING";
      TAG="staging";
      SERVICE_NAME_BACKEND="$SERVICE_NAME_BACKEND_STAGING";
      SERVICE_NAME_FRONTEND="$SERVICE_NAME_FRONTEND_STAGING";
      FRONT_HOST="$FRONT_HOST_STAGING";
      BACKEND_HOST="$BACKEND_HOST_STAGING";
      STACK_SERVICE_NAME_FOR_FRONT="$STACK_SERVICE_NAME_FOR_FRONT_STAGING";
      RANCHER_ACCESSKEY="$RANCHER_ACCESSKEY_STAGING";
      RANCHER_SECRETKEY="$RANCHER_SECRETKEY_STAGING";
      RANCHER_URL="$RANCHER_URL_STAGING";
      MONGODB_DATABASE="$MONGODB_DATABASE_STAGING";
      cloudname="$cloudname_staging";
      apikey="$apikey_staging";
      apisecret="$apisecret_staging";
  }  
else
  {
      echo "call $TRAVIS_BRANCH branch"
      ENV_ID=`curl -u ""$RANCHER_ACCESSKEY_QA":"$RANCHER_SECRETKEY_QA"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL_QA/v2-beta/projects?name=QA" | jq '.data[].id' | tr -d '"'`
      echo $ENV_ID
      USERNAME="$DOCKER_USERNAME";
      jobqueueUrl="$JOBQUEUEURL_QA";
      DOMAINKEY="$DOMAINKEY_QA";
      TAG="qa";
      SERVICE_NAME_BACKEND="$SERVICE_NAME_BACKEND_QA";
      SERVICE_NAME_FRONTEND="$SERVICE_NAME_FRONTEND_QA";
      FRONT_HOST="$FRONT_HOST_QA";
      BACKEND_HOST="$BACKEND_HOST_QA";
      STACK_SERVICE_NAME_FOR_FRONT="$STACK_SERVICE_NAME_FOR_FRONT_QA";
      RANCHER_ACCESSKEY="$RANCHER_ACCESSKEY_QA";
      RANCHER_SECRETKEY="$RANCHER_SECRETKEY_QA";
      RANCHER_URL="$RANCHER_URL_QA";
      MONGODB_DATABASE="$MONGODB_DATABASE_QA";
      cloudname="$cloudname_qa";
      apikey="$apikey_qa";
      apisecret="$apisecret_qa";
  }
fi

SERVICE_ID_BACKEND=`curl -u ""$RANCHER_ACCESSKEY":"$RANCHER_SECRETKEY"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL/v2-beta/projects/$ENV_ID/services?name=$SERVICE_NAME_BACKEND" | jq '.data[].id' | tr -d '"'`
echo $SERVICE_ID_BACKEND

SERVICE_ID_FRONTEND=`curl -u ""$RANCHER_ACCESSKEY":"$RANCHER_SECRETKEY"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL/v2-beta/projects/$ENV_ID/services?name=$SERVICE_NAME_FRONTEND" | jq '.data[].id' | tr -d '"'`
echo $SERVICE_ID_FRONTEND

curl -u ""$RANCHER_ACCESSKEY":"$RANCHER_SECRETKEY"" \
-X POST \
-H 'Accept: application/json' \
-H 'Content-Type: application/json' \
-d '{
       "inServiceStrategy":{"launchConfig": {"imageUuid":"docker:'$USERNAME'/uploader_backend_flowz:'$TAG'","kind": "container","labels":{"io.rancher.container.pull_image": "always","io.rancher.scheduler.affinity:host_label": "'"$BACKEND_HOST"'"},"ports": ["3040:3040/tcp","4040:4040/tcp"],"environment": {"RDB_HOST": "'"$RDB_HOST"'","RDB_PORT": "'"$RDB_PORT"'","mongodb_host":"'"$mongodb_host"'","mongodb_port":"'"$mongodb_port"'","username":"'"$username_env"'","password":"'"$password"'","jobqueueUrl":"'"$jobqueueUrl"'","socket_port":"'"$socket_port"'","PORT":"'"$server_port"'","domainKey":"'"$DOMAINKEY"'","mongodb_database":"'"$MONGODB_DATABASE"'","cloudname":"'"$cloudname"'","apikey":"'"$apikey"'","apisecret":"'"$apisecret"'"},"healthCheck": {"type": "instanceHealthCheck","healthyThreshold": 2,"initializingTimeout": 60000,"interval": 2000,"name": null,"port": 3040,"recreateOnQuorumStrategyConfig": {"type": "recreateOnQuorumStrategyConfig","quorum": 1},"reinitializingTimeout": 60000,"responseTimeout": 60000,"strategy": "recreateOnQuorum","unhealthyThreshold": 3},"networkMode": "managed"}},"toServiceStrategy":null}' \
$RANCHER_URL/v2-beta/projects/$ENV_ID/services/$SERVICE_ID_BACKEND?action=upgrade

curl -u ""$RANCHER_ACCESSKEY":"$RANCHER_SECRETKEY"" \
-X POST \
-H 'Accept: application/json' \
-H 'Content-Type: application/json' \
-d '{
     "inServiceStrategy":{"launchConfig": {"imageUuid":"docker:'$USERNAME'/uploader_frontend_flowz:'$TAG'","kind": "container","labels":{"io.rancher.container.pull_image": "always","io.rancher.scheduler.affinity:host_label": "'"$FRONT_HOST"'","io.rancher.scheduler.affinity:container_label_soft_ne": "'"$STACK_SERVICE_NAME_FOR_FRONT"'"},"environment": {"server_port": "'"$server_port"'","socket_port": "'"$socket_port"'"},"healthCheck": {"type": "instanceHealthCheck","healthyThreshold": 2,"initializingTimeout": 60000,"interval": 2000,"name": null,"port": 80,"recreateOnQuorumStrategyConfig": {"type": "recreateOnQuorumStrategyConfig","quorum": 1},"reinitializingTimeout": 60000,"requestLine": "GET \"http://localhost\" \"HTTP/1.0\"","responseTimeout": 60000,"strategy": "recreateOnQuorum","unhealthyThreshold": 3},"networkMode": "managed"}},"toServiceStrategy":null}' \
$RANCHER_URL/v2-beta/projects/$ENV_ID/services/$SERVICE_ID_FRONTEND?action=upgrade
