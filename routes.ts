import { Context, Router, send } from './deps.ts'
import type { RouterContext, Application } from './deps.ts'
import { log } from './middleware.ts'
import { UserController } from './controllers/user.ts'

// deno-lint-ignore no-explicit-any
const router: any = new Router()

const userController = new UserController()

router.get('/', ({ params, response }: RouterContext<string>) => {
    log.debug('Serving hello world')
    response.body = 'Hello world!'
})

router.get('/user', userController.getUserByPaging)
router.post('/user', userController.createUser)

const init = (app: Application) => {
    app.use(router.routes())

    app.use(router.allowedMethods())
}

export default {
    init,
}
