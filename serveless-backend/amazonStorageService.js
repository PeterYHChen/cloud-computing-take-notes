// Constructor
function AmazonStorageServiceImpl(accessKey, secretAccessKey) {
  
  var storageService = require('StorageService');
  
  // Load the SDK for JavaScript
  var AWS = require('aws-sdk');

  // Set the region 
  AWS.config.update({region: 'us-east-1a'});

  // Create S3 service object
  var s3BucketMgt = new AWS.S3({'apiVersion': '2006-03-01', 
                                'apiKeyId': accessKey
                                'secretAccessKey': secretAccessKey});
}


AmazonStorageServiceImpl.prototype.createStorageContainer = function(bucketName, config) {
  s3BucketMgt.createBucket(bucketName,config,function(data){
   if(data.status==false){
    console.log("Error in Bucket Creation:"+data.error);
   }else{
    console.log("Bucket Created");
   }
  });
}


AmazonStorageServiceImpl.prototype.listStorageContainers = function(config){
  s3BucketMgt.listAllBucket(config,function(data){
   if(data.status==false){
    console.log("Error in getting list of Buckets:"+data.error);
   }else{
    console.log("Buckets:"+JSON.stringify(data.content));
   }
  });
}


AmazonStorageServiceImpl.prototype.createFolder = function(bucketName,folderName,config){
  s3BucketMgt.createFolder(bucketName,folderName,config,function(data){
   if(data.status==false){
    console.log("Error in File Creation:"+data.error);
   }else{
    console.log("File Created in Bucket.");
   }
  });
}


AmazonStorageServiceImpl.prototype.deleteFolder = function(bucketName,fileName,config){
  s3BucketMgt.removeFile(bucketName,fileName,config,function(data){
   if(data.status==false){
    console.log("Error in Remove file:"+data.error);
   }else{
    console.log("File removed on from Bucket:"+bucketName);
   }
  });
}


AmazonStorageServiceImpl.prototype.createFile = function(bucketName,fileName,fileContents,config){
  s3BucketMgt.createFile(bucketName,fileName,fileContents,config,function(data){
   if(data.status==false){
    console.log("Error in File Creation:"+data.error);
   }else{
    console.log("File Created in Bucket.");
   }
  });
}

AmazonStorageServiceImpl.prototype.getFileByLocationId = function(bucketName,fileName,config){
  s3BucketMgt.getFileData(bucketName,fileName,"null",config,function(data){
   if(data.status==false){
    console.log("Error in getting File data:"+data.error);
   }else{
    console.log("File created on Local.");
   }
  });
  
}

//  Sets the Person object to module.exports
// 
module.exports = AmazonStorageServiceImpl;
