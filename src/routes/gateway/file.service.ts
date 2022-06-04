// Managament File service end points
import apiAdapter from './adapter'
import { AxiosResponse, AxiosError } from 'axios'
import multer from 'multer'
import stream from 'stream'
const FormData = require('form-data');

const STORAGE_SERVICE_BASE_URL = process.env.STORAGE_SERVICE_BASE_URL || ""

const apiStorageService = apiAdapter(STORAGE_SERVICE_BASE_URL)

// prefixes
const STORAGE_SERVICE_PREFIX: string = 'file';
const STORAGE_API_PREFIX: string = '/api';

// multer config
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

import {
  NextFunction, Request, Response, Router,
} from 'express';
import { IRoute, IUser } from '../../interfaces';
import { HttpException } from '../../exceptions';

class FileServiceRouter implements IRoute {
  public router = Router();

  public pathIdParam = ':id';

  constructor() {
    this.createRoutes();
  }

  createRoutes(): void {

      // get sotorage used
      this.router.get(`/storage`, (req: Request, res: Response, next: NextFunction) => {
        const user: IUser = <IUser>req.user
        const author = user._id
        apiStorageService.get(`${STORAGE_API_PREFIX}/${STORAGE_SERVICE_PREFIX}/storage/${author}`)
          .then((service_response:any) => {
            res.send(service_response.data)
          })
          .catch((err: AxiosError) => next(new HttpException(err.response?.status || 500, err.message)))
      })

       // get max sotorage avalable
       this.router.get(`/max-storage`, (req: Request, res: Response, next: NextFunction) => {
        const user: IUser = <IUser>req.user
        const author = user._id
        apiStorageService.get(`${STORAGE_API_PREFIX}/${STORAGE_SERVICE_PREFIX}/max-storage/${author}`)
          .then((service_response:any) => {
            res.send(service_response.data)
          })
          .catch((err: AxiosError) => next(new HttpException(err.response?.status || 500, err.message)))
      })

    
    // list all shared files
    this.router.get(`/shared`, (req: Request, res: Response, next: NextFunction) => {
      const user: IUser = <IUser>req.user
      const author = user._id
      apiStorageService.get(`${STORAGE_API_PREFIX}/${STORAGE_SERVICE_PREFIX}/shared/${author}`)
        .then((service_response: AxiosResponse) => {
          res.json(service_response.data)
        })
        .catch((err: AxiosError) => next(new HttpException(err.response?.status || 500, err.message)))
    });

    // list files
    this.router.get(`/`, (req: Request, res: Response, next: NextFunction) => {
      const user: IUser = <IUser>req.user
      const author = user._id
      apiStorageService.get(`${STORAGE_API_PREFIX}/${STORAGE_SERVICE_PREFIX}/${author}`)
        .then((service_response: AxiosResponse) => {
          res.json(service_response.data)
        })
        .catch((err: AxiosError) => next(new HttpException(err.response?.status || 500, err.message)))
    });

     // get file
     this.router.get(`/${this.pathIdParam}`, (req: Request, res: Response, next: NextFunction) => {
      const user: IUser = <IUser>req.user
      const author = user._id
      apiStorageService.get(`${STORAGE_API_PREFIX}/${STORAGE_SERVICE_PREFIX}${req.path}/${author}`)
        .then((service_response:any) => {
          const file = service_response.data
          const buffer = Buffer.from(file.file, "base64")
          const readStream = new stream.PassThrough();
          
          readStream.end(buffer);
          
          res.writeHead(200, {
              "Content-disposition": "attachment; filename=" + file.name,
              "Content-Type": "application/octet-stream",
              "Content-Length": buffer.length
          });
          res.end(buffer);
        })
        .catch((err: AxiosError) => next(new HttpException(err.response?.status || 500, err.message)))
    })

   // Remove file synced
   this.router.delete(`/sync`, (req: Request, res: Response, next: NextFunction) => {
    const user: IUser = <IUser>req.user
    const author = user._id
    const { pathToRemove } = req.body
    console.log("Resend: ", pathToRemove);
    apiStorageService.delete(`${STORAGE_API_PREFIX}/${STORAGE_SERVICE_PREFIX}/sync/${author}`,
    {data: {pathToRemove}})
      .then((service_response: AxiosResponse) => {
        res.json(service_response.data)
      })
      .catch((err: AxiosError) => next(new HttpException(err.response?.status || 500, err.message)))
  })

    // Remove file
    this.router.delete(`/`, (req: Request, res: Response, next: NextFunction) => {
      const user: IUser = <IUser>req.user
      const author = user._id
      const filesToRemove = req.body.files
      console.log("Resend: ", filesToRemove);
      apiStorageService.delete(`${STORAGE_API_PREFIX}/${STORAGE_SERVICE_PREFIX}/${author}`,
      {data: {files: filesToRemove}})
        .then((service_response: AxiosResponse) => {
          res.json(service_response.data)
        })
        .catch((err: AxiosError) => next(new HttpException(err.response?.status || 500, err.message)))
    })

  // Share file
  this.router.post(`/share`, (req: Request, res: Response, next: NextFunction) => {
    const user: IUser = <IUser>req.user
    const author = user._id

    apiStorageService.post(`${STORAGE_API_PREFIX}/${STORAGE_SERVICE_PREFIX}/share/${author}`, 
    {...req.body}, { headers: req.headers })
    .then((service_response: AxiosResponse) => {
      res.sendStatus(service_response.status)
    })
    .catch((err: AxiosError) => next(new HttpException(err.response?.status || 500, err.message)))
  })


   // save file with sync
   this.router.post(`/sync`,
   (req: Request, res: Response, next: NextFunction) => {
    
     const file = req.body
     const user: IUser = <IUser>req.user
     const author = user._id
     console.log(file);

     apiStorageService.post(`${STORAGE_API_PREFIX}/${STORAGE_SERVICE_PREFIX}/sync/${author}`, 
       {...file})
       .then((service_response: AxiosResponse) => {
         res.json(service_response.data)
       })
       .catch((err: AxiosError) => next(new HttpException(err.response?.status || 500, err.message)))
   })


    // Upload file
    this.router.post(`/`, upload.single('file'),
      (req: Request, res: Response, next: NextFunction) => {
        
        let formData = new FormData();
        const file = req.file
        const user: IUser = <IUser>req.user
        const author = user._id

        formData.append('file', file.buffer, file.originalname)
        formData.append("username", user.username);


        console.log(formData);
        console.log("File: ", file);
        

        apiStorageService.post(`${STORAGE_API_PREFIX}/${STORAGE_SERVICE_PREFIX}/${author}`, 
          formData, { headers: formData.getHeaders() })
          .then((service_response: AxiosResponse) => {
            res.json(service_response.data)
          })
          .catch((err: AxiosError) => next(new HttpException(err.response?.status || 500, err.message)))
      })
  }
}
export default new FileServiceRouter().router;
