class expressError{
    constructor(statuscode,message){
        this.statuscode=statuscode;
        this.message=message;
    }
};
module.exports=expressError;