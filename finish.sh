# curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
# -X POST \
# 'http://rancher.flowz.com:8080/v2-beta/projects/1a29/services/1s491?action=finishupgrade'
#
# # curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
# # -X POST \
# # 'http://rancher.flowz.com:8080/v2-beta/projects/1a29/services/1s490?action=finishupgrade'


if [ "$TRAVIS_BRANCH" = "master" ]
then
    {
    echo "call $TRAVIS_BRANCH branch"
    ENV_ID=`curl -u ""$RANCHER_ACCESSKEY_MASTER":"$RANCHER_SECRETKEY_MASTER"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL_MASTER/v2-beta/projects?name=Production" | jq '.data[].id' | tr -d '"'`
    echo $ENV_ID
    RANCHER_ACCESSKEY="$RANCHER_ACCESSKEY_MASTER";
    RANCHER_SECRETKEY="$RANCHER_SECRETKEY_MASTER";
    RANCHER_URL="$RANCHER_URL_MASTER";
    SERVICE_NAME_BACKEND="$SERVICE_NAME_BACKEND_MASTER";
    SERVICE_NAME_FRONTEND="$SERVICE_NAME_FRONTEND_MASTER";
  }
elif [ "$TRAVIS_BRANCH" = "develop" ]
then
    {
      echo "call $TRAVIS_BRANCH branch"
      ENV_ID=`curl -u ""$RANCHER_ACCESSKEY_DEVELOP":"$RANCHER_SECRETKEY_DEVELOP"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL_DEVELOP/v2-beta/projects?name=Develop" | jq '.data[].id' | tr -d '"'`
      echo $ENV_ID
      RANCHER_ACCESSKEY="$RANCHER_ACCESSKEY_DEVELOP";
      RANCHER_SECRETKEY="$RANCHER_SECRETKEY_DEVELOP";
      RANCHER_URL="$RANCHER_URL_DEVELOP";
      SERVICE_NAME_BACKEND="$SERVICE_NAME_BACKEND_DEVELOP";
      SERVICE_NAME_FRONTEND="$SERVICE_NAME_FRONTEND_DEVELOP";
  }
elif [ "$TRAVIS_BRANCH" = "staging" ]
then
    {
      echo "call $TRAVIS_BRANCH branch"
      ENV_ID=`curl -u ""$RANCHER_ACCESSKEY_STAGING":"$RANCHER_SECRETKEY_STAGING"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL_STAGING/v2-beta/projects?name=Staging" | jq '.data[].id' | tr -d '"'`
      echo $ENV_ID
      RANCHER_ACCESSKEY="$RANCHER_ACCESSKEY_STAGING";
      RANCHER_SECRETKEY="$RANCHER_SECRETKEY_STAGING";
      RANCHER_URL="$RANCHER_URL_STAGING";
      SERVICE_NAME_BACKEND="$SERVICE_NAME_BACKEND_STAGING";
      SERVICE_NAME_FRONTEND="$SERVICE_NAME_FRONTEND_STAGING";
    }  
else
  {
      echo "call $TRAVIS_BRANCH branch"
      ENV_ID=`curl -u ""$RANCHER_ACCESSKEY_QA":"$RANCHER_SECRETKEY_QA"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL_QA/v2-beta/projects?name=QA" | jq '.data[].id' | tr -d '"'`
      echo $ENV_ID
      RANCHER_ACCESSKEY="$RANCHER_ACCESSKEY_QA";
      RANCHER_SECRETKEY="$RANCHER_SECRETKEY_QA";
      RANCHER_URL="$RANCHER_URL_QA";
      SERVICE_NAME_BACKEND="$SERVICE_NAME_BACKEND_QA";
      SERVICE_NAME_FRONTEND="$SERVICE_NAME_FRONTEND_QA";
  }
fi

SERVICE_ID_BACKEND=`curl -u ""$RANCHER_ACCESSKEY":"$RANCHER_SECRETKEY"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL/v2-beta/projects/$ENV_ID/services?name=$SERVICE_NAME_BACKEND" | jq '.data[].id' | tr -d '"'`
echo $SERVICE_ID_BACKEND

SERVICE_ID_FRONTEND=`curl -u ""$RANCHER_ACCESSKEY":"$RANCHER_SECRETKEY"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL/v2-beta/projects/$ENV_ID/services?name=$SERVICE_NAME_FRONTEND" | jq '.data[].id' | tr -d '"'`
echo $SERVICE_ID_FRONTEND

echo "waiting for service to upgrade "
    while true; do

      case `curl -u ""$RANCHER_ACCESSKEY":"$RANCHER_SECRETKEY"" \
          -X GET \
          -H 'Accept: application/json' \
          -H 'Content-Type: application/json' \
          "$RANCHER_URL/v2-beta/projects/$ENV_ID/services/$SERVICE_ID_BACKEND/" | jq '.state'` in
          "\"upgraded\"" )
              echo "completing service upgrade"
              curl -u ""$RANCHER_ACCESSKEY":"$RANCHER_SECRETKEY"" \
                -X POST \
                -H 'Accept: application/json' \
                -H 'Content-Type: application/json' \
                "$RANCHER_URL/v2-beta/projects/$ENV_ID/services/$SERVICE_ID_BACKEND?action=finishupgrade"
              break ;;
          "\"upgrading\"" )
              echo "still upgrading"
              echo -n "."
              sleep 60
              continue ;;
          *)
              die "unexpected upgrade state" ;;
      esac
    done

    echo "waiting for service to upgrade "
        while true; do

          case `curl -u ""$RANCHER_ACCESSKEY":"$RANCHER_SECRETKEY"" \
              -X GET \
              -H 'Accept: application/json' \
              -H 'Content-Type: application/json' \
              "$RANCHER_URL/v2-beta/projects/$ENV_ID/services/$SERVICE_ID_FRONTEND/" | jq '.state'` in
              "\"upgraded\"" )
                  echo "completing service upgrade"
                  curl -u ""$RANCHER_ACCESSKEY":"$RANCHER_SECRETKEY"" \
                    -X POST \
                    -H 'Accept: application/json' \
                    -H 'Content-Type: application/json' \
                    "$RANCHER_URL/v2-beta/projects/$ENV_ID/services/$SERVICE_ID_FRONTEND?action=finishupgrade"
                  break ;;
              "\"upgrading\"" )
                  echo "still upgrading"
                  echo -n "."
                  sleep 60
                  continue ;;
              *)
                  die "unexpected upgrade state" ;;
          esac
        done
