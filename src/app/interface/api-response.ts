//Its link to HttpResponse in backend and map it
//and then link to user,service to show the info
export interface ApiResponse<T> {
    timeStamp: string;
    statusCode: number;
    status: string;
    message: string ;
    //T stand for whatever tpye of data we are display
    data: {page: T };
}