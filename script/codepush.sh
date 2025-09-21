# With specific app version targeting
# code-push release-react ABeeCi-android android --deploymentName Staging --targetBinaryVersion "1.0.0"

# With description and mandatory flag
# code-push release-react ABeeCi-android android --deploymentName Staging --description "Bug fixes and improvements" --mandatory

# With rollout percentage (gradual rollout)
# code-push release-react ABeeCi-android android --deploymentName Staging --rollout 25%

# Full example with multiple options
cd .. &&
code-push release-react ABeeCi-android android \
 --deploymentName Staging \
 --targetBinaryVersion "1.1" \
 --description "v13 - update $(date)" \
 --rollout 100% \
  --verbose \
  --development false \

cd script
# code-push release-react ABeeCi-android android --deploymentName Staging --verbose --bundleName "index.android.bundle" --development false  --description "Staging release v1.1"