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
    const [userCreds, passowrdCreds ] =process.env.AUTH_USER.split('=');
    return { userCreds, passowrdCreds }
  } catch (e) {
    return { userCreds: '', passwordCreds: '' }
  }
}

export const isValidUser = (credentials: string) => {
  const { user, password } = decodeAuthString(credentials);
  const { userCreds, passwordCreds } = getDBUser(); 
  return userCreds === user && passwordCreds === password;
};
