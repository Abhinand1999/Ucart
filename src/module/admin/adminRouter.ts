const Express =require("express");
const router=Express.Router()
import admin from './admin'
router.get('/sortOrder',admin.sortview)
router.get('/statusView',admin.viewStatus)
router.put('/verification',admin.verification)
router.get('/history',admin.history)
export default router