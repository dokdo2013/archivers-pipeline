export interface WorkerDto {
  streamId: string;
  date: string;
  segmentUri: string;
  segmentDuration: string;
  s3Region: string;
  s3Url: string;
  s3AccessKeyId: string;
  s3SecretAccessKey: string;
  s3BucketName: string;
  cdnBaseUrl: string;
}
