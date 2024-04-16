import axios from "axios";

const PHYLLO_BASE_URL = "https://api.staging.getphyllo.com";
const URL_CREATE_USER = "/v1/users";
const URL_CREATE_USER_TOKEN = "/v1/sdk-tokens";
const URL_GET_ACCOUNT = "/v1/accounts";

const PHYLLO_CLIENT_ID = '90362471-e4a9-452f-a183-a43b54c834b3' //process.env.REACT_APP_PHYLLO_CLIENT_ID;
const PHYLLO_SECRET_ID = 'b1648d49-60cc-48bb-adf0-f62e8644dac0'//process.env.REACT_APP_PHYLLO_SECRET_ID;

console.log(PHYLLO_CLIENT_ID, 'client iddd')
const getAxiosInstance = () => {
  const api = axios.create({
    baseURL: PHYLLO_BASE_URL,
    auth: {
      username: PHYLLO_CLIENT_ID,
      password: PHYLLO_SECRET_ID,
    },
  });
  return api;
};

const createUser = async (username, externalId) => {
  try {
    const userId = localStorage.getItem("PHYLLO_USER_ID");
    console.log(userId, 'user')
    if (Boolean(userId)) {
      console.log('conditionuser')

      return userId;
    }
    const api = getAxiosInstance();
    let response = await api.post(URL_CREATE_USER, {
      name: username,
      external_id: externalId,
    });
    localStorage.setItem("PHYLLO_USER_ID", response.data.id);
    return response.data.id;
  } catch (err) {
    return err.body;
  }
};

const createUserToken = async (userId) => {
  try {
    const token = localStorage.getItem("PHYLLO_SDK_TOKEN");
    if (Boolean(token)) {
      return token;
    }
    const api = getAxiosInstance();
    let response = await api.post(URL_CREATE_USER_TOKEN, {
      user_id: userId,
      products: [
        "IDENTITY",
        "IDENTITY.AUDIENCE",
        "ENGAGEMENT",
        "ENGAGEMENT.AUDIENCE",
        "INCOME",
        "ACTIVITY"
      ]
    });
    localStorage.setItem("PHYLLO_SDK_TOKEN", response.data.sdk_token);
    return response.data.sdk_token;
  } catch (err) {
    return err.body;
  }
};

const getAccounts = async (userId) => {
  try {
    const api = getAxiosInstance();
    let response = await api.get(`${URL_GET_ACCOUNT}?user_id=${userId}`);
    return response;
  } catch (err) {
    return err.body;
  }
};

export { createUser, createUserToken, getAccounts };
