public interface StorageService 

{

  /**

   * Creates a stroage container(bucket)

   */

   public void createStorageContainer(String containerName);



  /**

   * list buckets

   */

  public void listStorageContainers();

  

  /**

   * Creates a folder

   */

  public void createFolder(String bucketName, String folderName); 

  

  

  /**

   * This method first deletes all the files in given folder and than the

   * folder itself

   */

  public void deleteFolder(String bucketName, String folderName); 

  

  

  /**

   * Performs a get request to the storage service by file id for the file

   *

   */

  public InputStream getFileByLocationId(String fileLocationId, String bucketName); 



}
