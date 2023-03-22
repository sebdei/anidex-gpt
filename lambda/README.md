https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-awscli.html#with-userapp-walkthrough-custom-events-list-functions

# Update AWS Lambda Function
`zip function.zip index.js`

`aws lambda update-function-code --function-name anidex-text-for-image --zip-file fileb://function.zip`

# Create AWS Lambda Function
`zip function.zip index.js`

`aws lambda create-function --function-name anidex-text-for-image --zip-file fileb://function.zip --handler index.handler --runtime nodejs18.x --role arn:aws:iam::265131218627:role/lambda-ex`

# Start Local Development with AWS sam
`sam local start-api --host 0.0.0.0 --env-vars .env.json`
