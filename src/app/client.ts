import { ApolloClient, createNetworkInterface, createBatchingNetworkInterface } from 'apollo-client';

const networkInterface = createNetworkInterface({
    uri: 'http://localhost:8080/graphql', //prod --> /graphql dev --> http://localhost:5000/graphql node dev --> http://localhost:8080/graphql
    opts: {
      credentials: 'same-origin',
    },
  });

// const batchingNetworkInterface = createBatchingNetworkInterface({
//   uri: 'http://localhost:8080/graphql',
//   batchInterval: 10,
//   opts: {
//     credentials: 'same-origin',
//   }
// });

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }
    // get the authentication token from local storage if it exists
    let jwt: string;
    let user: any = localStorage.getItem('pomb-user'); 
    if(user) {
      user = JSON.parse(user);
      if(user.token) {
        jwt = `Bearer ${user.token}`;
        req.options.headers.Authorization = jwt
      }
    }
    next();
  }
}]);

// batchingNetworkInterface.use([{
//   applyBatchMiddleware(req, next) {
//     if (!req.options.headers) {
//       req.options.headers = {};  // Create the header object if needed.
//     }
//     // get the authentication token from local storage if it exists
//     let jwt: string;
//     let user: any = localStorage.getItem('laze-user'); 
//     if(user) {
//       user = JSON.parse(user);
//       if(user.token) {
//         jwt = `Bearer ${user.token}`;
//         req.options.headers.Authorization = jwt
//       }
//     }
//     next();
//   }
// }]);

const client = new ApolloClient({
  networkInterface
}); 

export function getClient(): ApolloClient {
  return client;
}