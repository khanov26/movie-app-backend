const projectId = process.env.FIREBASE_PROJECT_ID;

export default {
    authDomain: `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket: `${projectId}.appspot.com`,
}
