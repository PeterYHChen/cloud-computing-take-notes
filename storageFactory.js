
function StorageFactory() 
{
    this.createAmazonStorage = function (accessKeyId, secretAccessKey) {
         var amazonStorageService = Object.create(AmazonStorageServiceImpl)
         amazonStorageService.authenticate(accessKeyId, secretAccessKey);
         return amazonStorageService;
    }
    
    this.createGoogleStorage = function (accessKeyId, secretAccessKey) {
        //TODO
    }
}
