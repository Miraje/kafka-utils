import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, of} from 'rxjs';
import {GenericResponse} from 'models/genericResponse.interface';
import {KafkaRecord} from 'models/kafkaRecord.interface';
import {ActivatedRoute} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class KafkaUtilsService {
  private url = 'http://127.0.0.1:8083';

  consume$ = (configuration: string): Observable<GenericResponse<KafkaRecord[]>> =>
    this.httpClient
      .post<GenericResponse<KafkaRecord[]>>(this.getUrl('/consume'), {configuration: JSON.parse(configuration)})
      .pipe(catchError((err) => of(err)));


  constructor(private httpClient: HttpClient, private route: ActivatedRoute) {}


  getUrl(path: string): string {
    const isMockRequest = this.route.snapshot.queryParams['mock'] !== undefined
    return `${this.url}${isMockRequest ? '/mock' : ''}${path}`
  }
}
