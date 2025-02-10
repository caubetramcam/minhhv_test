import axios from "axios";
const REACT_APP_API_URL_ROOT = process.env.REACT_APP_API_URL_ROOT;

const convertApiErrData = (data) => {
  if (data) {
    let { errors: errArr } = data;
    if (Array.isArray(errArr) && errArr.length) {
      let errors = [];
      errArr.forEach((err) => {
        errors = errors.concat(err.messages || []);
      });
      Object.assign(data, { errors });
    }
  }
  return data;
};

const instance = axios.create({
  baseURL: REACT_APP_API_URL_ROOT,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    const { config } = response;
    if (config.responseType && config.responseType === "blob") {
      return response;
    }
    return response.data;
  },
  async (err) => {
    let { data: apiData = {}, status } = err.response || {};
    apiData = Object.assign(apiData, { status });
    let { message = null } = apiData || {};
    if (!apiData.status) {
      return Promise.reject("Please re-check the connection.");
    }
    if (status == 403 || (status == 401 && message == "Token is required.") || message == 'jwt expired') {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = `/`;
      return;
    }
    return Promise.reject(convertApiErrData(apiData));
  }
);

export default instance;
