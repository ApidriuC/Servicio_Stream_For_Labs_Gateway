import { Router } from 'express';
import passport from 'passport'
import { logger } from '../utils';
import UserController  from '../controller/UserController';

// services
import AdminServiceRouter from './gateway/admin.service'
import FileServiceRouter from './gateway/file.service'
import  PhotoServiceRouter from './gateway/photo.service'
import  DowloadPhotoServiceRouter from './gateway/downladPhoto.service'
import  VideoServiceRouter from './gateway/video.service'
import  DowloadVideoServiceRouter from './gateway/downladVideo.service'

const router = Router();
const prefix: string = '/api';


// --- User layer ---
// login admin
router.post(`${prefix}/admin/login`, (req, res, next) => UserController.authAdmin(req, res, next));

// list users
router.get(`${prefix}/users`, passport.authenticate('oauth-bearer', { session: false }), 
(req, res, next) => UserController.list(req, res, next))

// ---- Gateway layer (all request need are authenticated) ---
router.use((req, res, next) => {
    const params = req.params
    logger.info(`Redirect request to: ${req.url}${params.id ? "/" + params :''}`)
    next()
})

// admin service redirect
router.use(`${prefix}/admin`, passport.authenticate('jwt', { session: false }), AdminServiceRouter);
// Storage service file redirect
router.use(`${prefix}/file`, passport.authenticate('oauth-bearer', { session: false }), FileServiceRouter);

// Storage service photo redirect 
router.use(`${prefix}/photo/download`, DowloadPhotoServiceRouter);
router.use(`${prefix}/photo`, passport.authenticate('oauth-bearer', { session: false }), PhotoServiceRouter);

// Storage service video redirect 
router.use(`${prefix}/video/download`, DowloadVideoServiceRouter);
router.use(`${prefix}/video`, passport.authenticate('oauth-bearer', { session: false }), VideoServiceRouter);

export default router;
