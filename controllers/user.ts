import { UserModel } from '../models/user.ts'
import { HandleTime } from '../utils/handle-time.ts'
import { log } from '../middleware.ts'
import { RouterContext } from 'https://deno.land/x/oak/mod.ts'

export class UserController {
    public getUserByPaging = (ctx: RouterContext) => {
        const offset = Number(ctx.request.url.searchParams.get('offset'))
        const limit = Number(ctx.request.url.searchParams.get('limit'))

        // check integer and greater than zero
        if (
            !Number.isInteger(offset) ||
            offset < 0 ||
            !Number.isInteger(limit) ||
            limit < 1
        ) {
            ctx.throw(400, 'Bad request in offset or limit field')
        }

        const userModel = new UserModel()

        const pagination = {
            total_user: 0,
            total_pages: 0,
            offset: offset,
            limit: limit,
        }
        // get total
        pagination.total_user = userModel.numberOfTotalUser()

        // total
        pagination.total_pages = Math.ceil(pagination.total_user / limit)

        const listUser = userModel.getUserPaging(limit, offset)

        ctx.response.status = 200
        ctx.response.body = {
            data: listUser,
            pagination: pagination,
        }

        return
    }

    public createUser = async (ctx: RouterContext) => {
        const body = ctx.request.body({ type: 'form' })
        const value = await body.value
        const firstName = value.get('first_name')
        const lastName = value.get('last_name')
        const birthday = Number(value.get('birthday'))
        const email = value.get('email')

        // validate
        if (!firstName) {
            ctx.throw(400, 'Missing field: first_name')
        }

        if (firstName.length > 100) {
            ctx.throw(400, 'Max length of first_name field is 100')
        }

        if (!lastName) {
            ctx.throw(400, 'Missing field: last_name')
        }

        if (lastName.length > 100) {
            ctx.throw(400, 'Max length of last_name field is 100')
        }

        if (!Number.isInteger(birthday) || birthday < 0) {
            ctx.throw(400, 'birthday must be integer and greater than zero')
        }

        const emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (!emailformat.test(email)) {
            ctx.throw(400, 'invalid email address')
        }

        // calculate age from birthday

        const age = HandleTime.calculateAge(birthday)

        if (age < 18) {
            ctx.throw(400, 'Age of user must be greater 18 years old')
        }

        const userModel = new UserModel()

        // get max id
        const maxId = userModel.getMaxUserId()

        const user = {
            id: maxId + 1,
            first_name: firstName,
            last_name: lastName,
            birthday: birthday,
            email: email,
        }
        // insert user
        userModel.addNewUser(user)

        ctx.response.status = 200
        return
    }
}
