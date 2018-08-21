# Fail the build if this step fails
set -e

if [[ "$TRAVIS_SECURE_ENV_VARS" == "true" ]]; then
  npm run clean
  npm run build
fi
