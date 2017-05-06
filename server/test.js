var nodegrass = require('nodegrass');
nodegrass.get("https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?query=2017%E5%B9%B45%E6%9C%88&co=&resource_id=6018&t=1488462922685&ie=utf8&oe=gbk",function(data,status,headers){

    console.log(data);

},'gbk').on('error', function(e) {
    console.log("Got error: " + e.message);
});