// Managament File service end points
import apiAdapter from './adapter'
import { AxiosError } from 'axios'
import stream from 'stream'

const PHOTO_SERVICE_BASE_URL  = process.env.PHOTO_SERVICE_BASE_URL  || ""

const apiStorageService = apiAdapter(PHOTO_SERVICE_BASE_URL )

// prefixes
const STORAGE_SERVICE_PREFIX: string = 'photo/download';
const STORAGE_API_PREFIX: string = '/api';



import {
  NextFunction, Request, Response, Router,
} from 'express';
import { IRoute } from '../../interfaces';
import { HttpException } from '../../exceptions';

class PhotoServiceRouter implements IRoute {
  public router = Router();

  public pathIdParam = ':id';

  constructor() {
    this.createRoutes();
  }

  createRoutes(): void {
     // download photo
     this.router.get(`/${this.pathIdParam}`, (req: Request, res: Response, next: NextFunction) => {
      apiStorageService.get(`${STORAGE_API_PREFIX}/${STORAGE_SERVICE_PREFIX}${req.path}`)
        .then((service_response:any) => {
          const photo = service_response.data
          const buffer = Buffer.from(photo.image, "base64")
          
          const readStream = new stream.PassThrough();
          readStream.end(buffer);
          
          res.writeHead(200, {
              "Content-disposition": "attachment; filename=" + photo.name,
              "Content-Type": "application/octet-stream",
              "Content-Length": buffer.length
          });
          res.end(buffer);
        })
        .catch((err: AxiosError) => next(new HttpException(err.response?.status || 500, err.message)))
    })
  }
}
export default new PhotoServiceRouter().router;
