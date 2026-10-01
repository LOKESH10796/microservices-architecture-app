import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpRequest, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { FeedItem } from '../feed/models/feed-item.model';
import { catchError, tap, map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';

const API_HOST = environment.apiHost;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  token: string = '';

  constructor(private http: HttpClient) { }

  handleError(error: Error): void {
    alert(error.message);
  }

  setAuthToken(token: string): void {
    this.httpOptions.headers = this.httpOptions.headers.append('Authorization', `jwt ${token}`);
    this.token = token;
  }

  get(endpoint: string): Promise<any> {
    const url = `${API_HOST}${endpoint}`;
    const req = this.http.get(url, this.httpOptions).pipe(map(this.extractData.bind(this)));

    return lastValueFrom(req).catch((e: Error) => {
      this.handleError(e);
      throw e;
    });
  }

  post(endpoint: string, data: any): Promise<any> {
    const url = `${API_HOST}${endpoint}`;
    return lastValueFrom(this.http.post<HttpEvent<any>>(url, data, this.httpOptions))
      .catch((e: Error) => {
        this.handleError(e);
        throw e;
      });
  }

  async upload(endpoint: string, file: File, payload: any): Promise<any> {
    const signed_url = (await this.get(`${endpoint}/signed-url/${file.name}`)).url;

    const headers = new HttpHeaders({ 'Content-Type': file.type });
    const req = new HttpRequest('PUT', signed_url, file, {
      headers: headers,
      reportProgress: true,
    });

    return new Promise(resolve => {
      this.http.request(req).subscribe((resp: any) => {
        if (resp && resp.status && resp.status === 200) {
          resolve(this.post(endpoint, payload));
        }
      });
    });
  }

  /// Utilities
  private extractData(res: Object): any {
    const body = res;
    return body || {};
  }
}