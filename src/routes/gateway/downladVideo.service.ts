// Managament File service end points
import https from 'https'
import http from 'http'
const VIDEO_SERVICE_BASE_URL  = process.env.VIDEO_SERVICE_BASE_URL  || ""



// prefixes
const VIDEO_SERVICE_PREFIX: string = 'video/download';
const VIDEO_API_PREFIX: string = '/api';



import {
  NextFunction, Request, Response, Router,
} from 'express';
import { IRoute } from '../../interfaces';
import { HttpException } from '../../exceptions';

class VideoServiceRouter implements IRoute {
  public router = Router();

  public pathIdParam = ':id';

  constructor() {
    this.createRoutes();
  }

  httpHandler(videoChunk: any, res: Response, next: NextFunction): void {
    if(videoChunk.statusCode !== 200 && videoChunk.statusCode !== 206){
      res.set({
        'content-type':'application/json'
      })
      console.log("Download video error:", videoChunk);
      return next(new HttpException(videoChunk.statusCode || 500, "Error"))
    
    }else {
      videoChunk.pipe(res)
    }
  }
  createRoutes(): void {
     // download Video
     this.router.get(`/${this.pathIdParam}`, (req: Request, res: Response, next: NextFunction) => {
       if(process.env.NODE_ENV === "development"){
         
        http.get(`${VIDEO_SERVICE_BASE_URL}${VIDEO_API_PREFIX}/${VIDEO_SERVICE_PREFIX}${req.path}`,
        (videoChunk) => {
          this.httpHandler(videoChunk, res, next)
        }); 
       }else{
        https.get(`${VIDEO_SERVICE_BASE_URL}${VIDEO_API_PREFIX}/${VIDEO_SERVICE_PREFIX}${req.path}`,
        {rejectUnauthorized:false},
        (videoChunk) => {
          this.httpHandler(videoChunk, res, next)
        }); 
       }
      })
  }
}
export default new VideoServiceRouter().router;
