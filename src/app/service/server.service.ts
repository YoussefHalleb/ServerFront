import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscriber, catchError, tap, throwError } from 'rxjs';
import { CustomResponse } from '../interface/custom-response';
import { Server } from '../interface/server';
import { Status } from '../enum/status.enum';

@Injectable({ providedIn: 'root' })
export class ServerService {

  private readonly apiUrl = 'http://192.168.58.2:30001';

  constructor(private http: HttpClient) { }

  
  servers$ = <Observable<CustomResponse>> //  servers$ returns an Observable of type CustomResponse
  this.http.get<CustomResponse>(`${this.apiUrl}/server/list`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  )

  save$ = (server: Server) => <Observable<CustomResponse>> //  servers$ returns an Observable of type CustomResponse
  this.http.post<CustomResponse>(`${this.apiUrl}/server/save`, server)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  )

  ping$ = (ipAddr: string) => <Observable<CustomResponse>> //  servers$ returns an Observable of type CustomResponse
  this.http.get<CustomResponse>(`${this.apiUrl}/server/ping/${ipAddr}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  )

  filter$ = (status: Status, response: CustomResponse) => <Observable<CustomResponse>> //  servers$ returns an Observable of type CustomResponse
    new Observable<CustomResponse>(
      subscriber => {
        console.log(response);
        subscriber.next(  // We need to call next() method to let the subscriber know that we have a new value
          status === Status.ALL ?
          { ...response, message: `Servers filtered by ${status} status` }
          :
          response.data && response.data.servers ?
          {
            ...response, // spread operator, it copies all the properties of the response object
            message: response.data.servers
            .filter(server => server.status === status).length > 0 ?
            `Servers filtered by ${status === Status.SERVER_UP ? 'SERVER UP' : 'SERVER DOWN'} status` : `No servers with ${status} status found`,
            data: { servers: response.data.servers.filter(server => server.status === status)}
          }
          :
          {
            ...response, message: 'No servers found', data: { servers: [] }
          }
        );
        subscriber.complete(); // We need to call complete() method to let the subscriber know that we are done
      }
    )
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  )
  delete$ = (serverId: number) => <Observable<CustomResponse>> //  servers$ returns an Observable of type CustomResponse
  this.http.delete<CustomResponse>(`${this.apiUrl}/server/delete/${serverId}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  )

  // We are making this method private because we are not going to use it outside of this class
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    if (error.status === 0) {
      return throwError(() => new Error(`Could not connect to the server. Please contact the administrator.`));
    }
    return throwError(() => new Error(`An error occurred :(. Error message: ${error.error.message} , Status code: ${error.status}, Error path: ${error.url}`));
  }
}

