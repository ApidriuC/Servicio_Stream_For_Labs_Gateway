// Managament File service end points
import apiAdapter from './adapter'
import { AxiosResponse, AxiosError } from 'axios'

const VIDEO_SERVICE_BASE_URL  = process.env.VIDEO_SERVICE_BASE_URL  || ""

const apiVideoService = apiAdapter(VIDEO_SERVICE_BASE_URL )

// prefixes
const VIDEO_SERVICE_PREFIX: string = 'video';
const VIDEO_API_PREFIX: string = '/api';



import {
  NextFunction, Request, Response, Router,
} from 'express';
import { IRoute, IUser } from '../../interfaces';
import { HttpException } from '../../exceptions';

class VideoServiceRouter implements IRoute {
  public router = Router();

  public pathIdParam = ':id';

  constructor() {
    this.createRoutes();
  }

  createRoutes(): void {

    // list Videos
    this.router.get(`/`, (req: Request, res: Response, next: NextFunction) => {
      const user: IUser = <IUser>req.user
      const author = user._id
      apiVideoService.get(`${VIDEO_API_PREFIX}/${VIDEO_SERVICE_PREFIX}/${author}`)
        .then((service_response: AxiosResponse) => {
          res.json(service_response.data)
        })
        .catch((err: AxiosError) => next(new HttpException(err.response?.status || 500, err.message)))
    });


  // Remove Video synced
  this.router.delete(`/sync`, (req: Request, res: Response, next: NextFunction) => {
    const user: IUser = <IUser>req.user
    const author = user._id
    const { pathToRemove } = req.body
    apiVideoService.delete(`${VIDEO_API_PREFIX}/${VIDEO_SERVICE_PREFIX}/sync/${author}`,
    {data: {pathToRemove }})
      .then((service_response: AxiosResponse) => {
        res.json(service_response.data)
      })
      .catch((err: AxiosError) => next(new HttpException(err.response?.status || 500, err.message)))
  })

     // Remove Video
     this.router.delete(`/`, (req: Request, res: Response, next: NextFunction) => {
      const user: IUser = <IUser>req.user
      const author = user._id
      const filesToRemove = req.body.files
      console.log("Resend: ", filesToRemove);
      apiVideoService.delete(`${VIDEO_API_PREFIX}/${VIDEO_SERVICE_PREFIX}/${author}`,
      {data: {files: filesToRemove}})
        .then((service_response: AxiosResponse) => {
          res.json(service_response.data)
        })
        .catch((err: AxiosError) => next(new HttpException(err.response?.status || 500, err.message)))
    })

     // Share Video
    this.router.post(`/share`, (req: Request, res: Response, next: NextFunction) => {
      const user: IUser = <IUser>req.user
      const author = user._id

      apiVideoService.post(`${VIDEO_API_PREFIX}/${VIDEO_SERVICE_PREFIX}/share/${author}`, 
      {...req.body}, { headers: req.headers })
      .then((service_response: AxiosResponse) => {
        res.sendStatus(service_response.status)
      })
      .catch((err: AxiosError) => next(new HttpException(err.response?.status || 500, err.message)))
    })


  }
}
export default new VideoServiceRouter().router;
