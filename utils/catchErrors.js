function catchErrors(error, displayError) {
    let errorMsg;
    if(error.response) {
        //* The req was made and the server responed with a status code that is not in the range of 2XX
        errorMsg = error.response.data;

        //* For Cloudinary image uploads
        if(error.response.data.error){
            errorMsg = error.response.data.error.message;
        }
    } else if (error.request) {
        //* The req was made but no response was received 
        errorMsg = error.request;
    } else {
        //* Something happened while making a req that triggered an error
        errorMsg = error.message;
    }
    displayError(errorMsg);
}

export default catchErrors;