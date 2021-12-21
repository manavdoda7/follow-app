const db = require("../middlewares/dbconnection")

class User{
    constructor(username, email, fName, lName, password) {
        this.username = username
        this.email=email
        this.fName=fName
        this.lName=lName
        this.password=password
    }
    static async createUser(obj) {
        return db.promise().query(`insert into user values("${obj.username}","${obj.email}","${obj.fName}","${obj.lName}","${obj.password}");`)
    }

    static async emailExists(email) {
        return db.promise().query(`select username from user where email="${email}";`)
    }
    static async usernameExists(username) {
        return db.promise().query(`select * from user where username="${username}";`)
    }
    static async follow(followed, followedBy) {
        return db.promise().query(`insert into follow values("${followed}", "${followedBy}")`)
    }
    static async checkDuplicate(followed, followedBy) {
        return db.promise().query(`select * from follow where followed = "${followed}" and followedBy="${followedBy}"`)
    }
    static async fetchFollowing(username) {
        return db.promise().query(`select followed from follow where followedBy="${username}"`)
    }
    static async fetchFollowers(username) {
        return db.promise().query(`select followedBy from follow where followed="${username}"`)
    }
    static async removeRelation(followed, followedBy) {
        return db.promise().query(`delete from follow where followed="${followed}" and followedBy="${followedBy}"`)
    }
}

module.exports=User