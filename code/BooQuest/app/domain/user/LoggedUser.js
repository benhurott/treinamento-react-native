let currentLoggedUser = null

export default class LoggedUser {
    static getCurrent() {
        return currentLoggedUser
    }

    static setCurrent(newLoggedUser) {
        currentLoggedUser = newLoggedUser
    }

    static createFromFirebaseUserJSON(user) {
        return new LoggedUser(
                user.uid, 
                user.email, 
                user.authToken)
    }

    constructor(uid, email, authToken) {
        this.uid = uid
        this.email = email
        this.authToken = authToken
    }
}