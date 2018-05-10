mport java.io.ByteArrayInputStream;

import java.io.File;

import java.io.InputStream;

import java.util.List;

import com.amazonaws.auth.AWSCredentials;

import com.amazonaws.auth.BasicAWSCredentials;

import com.amazonaws.services.s3.AmazonS3;

import com.amazonaws.services.s3.AmazonS3Client;

import com.amazonaws.services.s3.model.Bucket;

import com.amazonaws.services.s3.model.CannedAccessControlList;

import com.amazonaws.services.s3.model.ObjectMetadata;

import com.amazonaws.services.s3.model.PutObjectRequest;

import com.amazonaws.services.s3.model.S3ObjectSummary;



public class AmazonStorageServiceImpl implements StorageService 

{

  

  private static final AmazonS3 client;

  

  private static final String SUFFIX = "/";

  

  public AmazonStorageServiceImpl(String accessKeyId, String secretAccessKey)

  {

    // credentials object identifying user for authentication

    // user must have AWSConnector and AmazonS3FullAccess for 

    // this example to work

    AWSCredentials credentials = new BasicAWSCredentials(accessKeyId,secretAccessKey);

    

    // create a client connection based on credentials

    this.s3client = new AmazonS3Client(credentials);

  }

  

  // create bucket - name must be unique for all S3 users

  @Override

  public void createStorageContainer(String containerName) 

  {

    s3client.createBucket(containerName);

  }

  

  // list buckets

  @Override

  public void listStorageContainers() 

  {

    for (Bucket bucket : s3client.listBuckets()) {

      System.out.println(" - " + bucket.getName());

    }

  }

  

  @Override

  public void createFolder(String bucketName, String folderName) 

  {

    // create meta-data for your folder and set content-length to 0

    ObjectMetadata metadata = new ObjectMetadata();

    metadata.setContentLength(0);

    // create empty content

    InputStream emptyContent = new ByteArrayInputStream(new byte[0]);

    // create a PutObjectRequest passing the folder name suffixed by /

    PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName,

        folderName + SUFFIX, emptyContent, metadata);

    // send request to S3 to create folder

    client.putObject(putObjectRequest);

  }

  

  /**

   * This method first deletes all the files in given folder and than the

   * folder itself

   */

  @Override

  public void deleteFolder(String bucketName, String folderName) 

  {

    List fileList = 

        client.listObjects(bucketName, folderName).getObjectSummaries();

    for (S3ObjectSummary file : fileList) {

      client.deleteObject(bucketName, file.getKey());

    }

    client.deleteObject(bucketName, folderName);

  }

  

  /**

   * Performs a {@link GetObjectRequest} to the S3 bucket by file id for the file

   *

   * @param fileLocationId Id of the file to search for

   * @return file found from S3

   */

  @Override

  public InputStream getFileByLocationId(String fileLocationId, String bucketName) 

  {



    GetObjectRequest getObjectRequest = new GetObjectRequest(bucketName, fileLocationId);



    S3Object s3Object = s3client.getObject(getObjectRequest);



    System.out.println("Successfully retrieved the file from S3 bucket {}", getObjectRequest.getBucketName());



    return s3Object.getObjectContent();

  }

  

}
