export const getFirebaseConfig = () =>
  import.meta.env.PROD
    ? {
        apiKey: "AIzaSyCvYypNe388Zy8jBzogAIDEZAazUles_FY",
        authDomain: "nomo-nouns-prod.firebaseapp.com",
        databaseURL: "https://nomo-nouns-prod-default-rtdb.firebaseio.com",
        projectId: "nomo-nouns-prod",
        storageBucket: "nomo-nouns-prod.appspot.com",
        messagingSenderId: "476416236164",
        appId: "1:476416236164:web:bcc130e056e2b334e080d1",
      }
    : {
        apiKey: "AIzaSyAAZDcxjdnOsKN-R3-xceVmZJin_5vEADo",
        authDomain: "nomo-nouns-dev.firebaseapp.com",
        projectId: "nomo-nouns-dev",
        storageBucket: "nomo-nouns-dev.appspot.com",
        messagingSenderId: "293907407191",
        appId: "1:293907407191:web:481b628e3a736b1b4f9e12",
        databaseURL: "https://nomo-nouns-dev-default-rtdb.firebaseio.com",
      };
