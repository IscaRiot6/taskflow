import express from 'express'
import postRoutes from './postRoutes.js'
import replyRoutes from './replyRoutes.js'

const router = express.Router()

router.use('/posts', postRoutes)
router.use('/replies', replyRoutes)

export default router
