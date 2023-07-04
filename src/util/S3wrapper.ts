import AWS from 'aws-sdk';
import { S3 } from 'aws-sdk';

export default class S3wrapper {

    protected _s3Client: S3;

    public constructor() {
        AWS.config.update({
            region: process.env.BUCKET_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID ,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });

        this._s3Client = new AWS.S3({
            region: process.env.BUCKET_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            apiVersion: '2006-03-01',
            signatureVersion: 'v4',
        });

    }

    public async getUploadSignedUrl(uploadFileName : string): Promise<string> {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: uploadFileName,
            Expires: 3600,
            //ContentType: createObjectRequest.mimetype
        };

        const presignedURL = await this._s3Client.getSignedUrlPromise('putObject', params);

        return presignedURL;
    }

    public async getDownloadSignedUrl(downloadFileName : string): Promise<string>{
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: downloadFileName,
            Expires: 3600,
            //ContentType: createObjectRequest.mimetype
        };

        const presignedURL = await this._s3Client.getSignedUrlPromise('getObject', params);

        return presignedURL;
    }

    public async getFileBuffer(fileLocation : string) : Promise<any>{

        console.log('inside get file buffer');

        console.log('file locatioj = ', fileLocation);

        const params = {
            Bucket: process.env.BUCKET_NAME ? process.env.BUCKET_NAME : "",
            Key: fileLocation.replaceAll('%20',' '),
        }
        const data = await this._s3Client.getObject(params).promise();

        console.log('type of data = ', typeof(data));
        console.log('data = ', data);

        return data.Body;
    }
}