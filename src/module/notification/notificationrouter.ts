import Notification from './notificationController'
import user from '../user/userController'
const Express =require('express')
const router=Express.Router()
router.get('/notification',user.verifyjwt,Notification.viewNotification)
router.get('/mark',user.verifyjwt,Notification.markasRead)
router.get('/details',user.verifyjwt,Notification.notificationDetails)
export default router