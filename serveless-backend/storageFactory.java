import java.io.*;



public class StorageFactory 

{

  public static StorageService createAmazonStorage(String accessKeyId, String secretAccessKey)

  {

    StorageService amazonStorageService = new AmazonStorageServiceImpl(accessKeyId, secretAccessKey);

    return amazonStorageService

  }

  

  

  public static StorageService createGoogleStorage(String accessKeyId, String secretAccessKey)

  {

   

  }

}
