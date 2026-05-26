import { testEnv } from "./firebaseTestSetup";

export const getAuthenticatedDb = function (uid: string, email: string, verified: boolean) {
    return testEnv.authenticatedContext(uid, {
        email: email,
        email_verified: verified
    }).firestore()
}