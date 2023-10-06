import instance from 'axios';

const AxiosClientWithInterceptors = instance.create({
  baseURL: 'http://localhost:8080/api-arcon',
});

const requestHandler = (request) => {
  request.headers['Accept'] = 'application/json';
  request.headers['Content-Type'] = 'application/json';
  const session = JSON.parse(localStorage.getItem('user')) || null;
  if (session?.isLogged)
    request.headers['Authorization'] = `Bearer ${session.token}`;
  return request;
};

const errorResponseHandler = (error) => Promise.reject(error);

const successResponseHandler = (response) => Promise.resolve(response.data);

AxiosClientWithInterceptors.interceptors.request.use(
  (request) => requestHandler(request),
  (error) => Promise.reject(error)
);

AxiosClientWithInterceptors.interceptors.response.use(
  (response) => successResponseHandler(response),
  (error) => errorResponseHandler(error)
);

const AxiosClientWithoutInterceptors = instance.create({
  baseURL: 'http://localhost:8080/api-arcon',
});

export { AxiosClientWithInterceptors, AxiosClientWithoutInterceptors };
