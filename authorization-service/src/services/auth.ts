import { APIGatewayAuthorizerResult } from 'aws-lambda';

const decodeAuthString = (authString: string) => {
  try {
    const [user, password] = Buffer.from(authString.split(' ')[1], 'base64')
      .toString()
      .split(':');
    return { user, password };
  } catch (e) {
    return { user: '', password: '' };
  }
};

const getDBUser = () => {
  try {
    const [userCreds, passwordCreds] = process.env.AUTH_USER.split('=');
    return { userCreds, passwordCreds };
  } catch (e) {
    return { userCreds: '', passwordCreds: '' };
  }
};

export const isValidUser = (credentials: string) => {
  const { user, password } = decodeAuthString(credentials);
  const { userCreds, passwordCreds } = getDBUser();

  return userCreds === user && passwordCreds === password;
};

export const generateResponse = (
  principalId,
  effect,
  methodArn
): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: methodArn,
        },
      ],
    },
  };
};
