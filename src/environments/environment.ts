// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBG1JdaVSev7mgGNRHzInzQ1q1IqZ5LF04",
    authDomain: "lagua-shikomori.firebaseapp.com",
    projectId: "lagua-shikomori",
    storageBucket: "lagua-shikomori.appspot.com",
    messagingSenderId: "137499573111",
    appId: "1:137499573111:web:670bc2f91420e63f807f72",
    measurementId: "G-56QVYPSYSH"
  },
  api: 'http://localhost:3000', //'http://localhost:3000'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
