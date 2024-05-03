// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  host: "http://localhost:8080/api/teranga",
  // baseUrlFile: "http://localhost:8090/api/teranga/files/",
  // host: "https://dev-be.suqali.com/api/teranga",
  baseUrlFile: "https://dev-be.suqali.com/files/",


/*  host: "https://dev-touch-ssii-api.gutouch.net/suqali/api/teranga",
  baseUrlFile: "https://dev-touch-ssii-api.gutouch.net/suqali/api/teranga/files/",*/

  faceRekognition : true
};

// export const environment = {
//   production: false,
//   host: "http://localhost:8080/api/teranga",
//   // host: "http://172.16.16.58:8080/api/teranga",
//   baseUrlFile: "/home/seynaboundiaye/Documents/TerangaAPI/files/",
//   faceRekognition : true
// };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
