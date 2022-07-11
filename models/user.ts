import { db } from '../libs/sqlite.ts'

export class UserModel {
    public numberOfTotalUser = () => {
        for (const [total_user] of db.query(
            'SELECT count(id) total_user FROM user'
        )) {
            return total_user
        }
    }

    public getUserPaging = (limit, offset) => {
        let listUser = []
        for (const [id, first_name, last_name, birthday, email] of db.query(
            'SELECT * FROM user LIMIT ? OFFSET ?',
            [limit, offset]
        )) {
            const userId = id

            const listImage = this.getImagesByUserId(userId)
            const listAttribute = this.getAttributeByUserId(userId)

            const user = {
                id: userId,
                first_name: first_name,
                last_name: last_name,
                birthday: birthday,
                email: email,
                media: listImage,
                attributes: listAttribute,
            }

            listUser.push(user)
        }

        return listUser
    }

    public getImagesByUserId = (userId) => {
        const listImage = []
        for (const [id, name, created, heighth, width] of db.query(
            'SELECT * FROM image WHERE user_id = ? ORDER BY created DESC',
            [userId]
        )) {
            const image = {
                id: id,
                name: name,
                created: created,
                heighth: heighth,
                width: width,
            }

            listImage.push(image)
        }

        return listImage
    }

    public getAttributeByUserId = (userId) => {
        const listAttribute = []
        for (const [attribute_id] of db.query(
            'SELECT attribute_id FROM attribute_user WHERE user_id = ?',
            [userId]
        )) {
            const attribute = {
                attribute_id: attribute_id,
            }

            listAttribute.push(attribute)
        }

        return listAttribute
    }

    public getMaxUserId = () => {
        for (const [max_id] of db.query('SELECT MAX(id) max_id FROM user')) {
            return max_id
        }
    }

    public addNewUser = (user) => {
        db.query(
            'INSERT INTO user (id, first_name, last_name, birthday, email) VALUES (?, ?, ?, ?, ?)',
            [
                user.id,
                user.first_name,
                user.last_name,
                user.birthday,
                user.email,
            ]
        )
    }
}
