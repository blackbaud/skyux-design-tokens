# Fail the build if this step fails
set -e

if [[ "$TRAVIS_SECURE_ENV_VARS" == "true" && -n "$TRAVIS_TAG" ]]; then
  npm run clean
  npm run build
fi
