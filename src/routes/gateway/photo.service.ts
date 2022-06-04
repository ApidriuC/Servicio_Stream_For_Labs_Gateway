// Managament File service end points
import apiAdapter from './adapter'
import { AxiosResponse, AxiosError } from 'axios'

const PHOTO_SERVICE_BASE_URL  = process.env.PHOTO_SERVICE_BASE_URL  || ""

const apiPhotoService = apiAdapter(PHOTO_SERVICE_BASE_URL )

// prefixes
const STORAGE_SERVICE_PREFIX: string = 'photo';
const STORAGE_API_PREFIX: string = '/api';



import {
  NextFunction, Request, Response, Router,
} from 'express';
import { IRoute, IUser } from '../../interfaces';
import { HttpException } from '../../exceptions';

class PhotoServiceRouter implements IRoute {
  public router = Router();

  public pathIdParam = ':id';

  constructor() {
    this.createRoutes();
  }

  createRoutes(): void {

    // list Photos
    this.router.get(`/`, (req: Request, res: Response, next: NextFunction) => {
      const user: IUser = <IUser>req.user
      const author = user._id
      apiPhotoService.get(`${STORAGE_API_PREFIX}/${STORAGE_SERVICE_PREFIX}/${author}`)
        .then((service_response: AxiosResponse) => {
          res.json(service_response.data)
        })
        .catch((err: AxiosError) => next(new HttpException(err.response?.status || 500, err.message)))
    });

    
 // Remove photo synced
    this.router.delete(`/sync`, (req: Request, res: Response, next: NextFunction) => {
      const user: IUser = <IUser>req.user
      const author = user._id
      const { pathToRemove } = req.body
      apiPhotoService.delete(`${STORAGE_API_PREFIX}/${STORAGE_SERVICE_PREFIX}/sync/${author}`,
      {data: {pathToRemove}})
        .then((service_response: AxiosResponse) => {
          res.json(service_response.data)
        })
        .catch((err: AxiosError) => next(new HttpException(err.response?.status || 500, err.message)))
    })

     // Remove photo
     this.router.delete(`/`, (req: Request, res: Response, next: NextFunction) => {
      const user: IUser = <IUser>req.user
      const author = user._id
      const filesToRemove = req.body.files
      console.log("Resend: ", filesToRemove);
      apiPhotoService.delete(`${STORAGE_API_PREFIX}/${STORAGE_SERVICE_PREFIX}/${author}`,
      {data: {files: filesToRemove}})
        .then((service_response: AxiosResponse) => {
          res.json(service_response.data)
        })
        .catch((err: AxiosError) => next(new HttpException(err.response?.status || 500, err.message)))
    })

     // Share photo
    this.router.post(`/share`, (req: Request, res: Response, next: NextFunction) => {
      const user: IUser = <IUser>req.user
      const author = user._id

      apiPhotoService.post(`${STORAGE_API_PREFIX}/${STORAGE_SERVICE_PREFIX}/share/${author}`, 
      {...req.body}, { headers: req.headers })
      .then((service_response: AxiosResponse) => {
        res.sendStatus(service_response.status)
      })
      .catch((err: AxiosError) => next(new HttpException(err.response?.status || 500, err.message)))
    })


  }
}
export default new PhotoServiceRouter().router;
