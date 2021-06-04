import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomPreloadingService implements PreloadingStrategy {
  // use this custom preloading strategy instead of PreloadAllModules, NoPreloading
  preload(route: Route, fn: () => Observable<any>): Observable<any> {
    if(route.data['preload'] && route.data){
      return fn();
    } else {
      return of(null);
    }
  }

  constructor() { }
}
