import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";

export interface Header {
  header: string;
  value: string;
}

@Injectable()
export class ImageService {
  private url: string;

  public setUrl(url: string) {
    this.url = url;
  }

  public postImage(image: File, headers?: Header[]) {
    this.checkUrl();
    return Observable.create(observer => {
      let formData: FormData = new FormData();
      let xhr: XMLHttpRequest = new XMLHttpRequest();

      formData.append('image', image);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            observer.next(xhr.response);
            observer.complete();
          } else {
            observer.error(xhr.response);
          }
        }
      };


      xhr.open('POST', this.url, true);

      if (headers)
        for (let header of headers)
          xhr.setRequestHeader(header.header, header.value);

      xhr.send(formData);
    });
  }

  // для получения base64 + добавление к оригинальному сервису
  public convertFileToDataURLviaFileReader(url, headers?: Header[]) {
     return Observable.create(observer => {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onreadystatechange = () => {
          var reader = new FileReader();
          reader.onloadend = () => {
            observer.next(reader.result);
            observer.complete();
          }
          reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        
        if (headers)
          for (let header of headers)
            xhr.setRequestHeader(header.header, header.value);

        xhr.send();
     });
  }

  private checkUrl() {
    if (!this.url) {
      throw new Error('Url is not set! Please use setUrl(url) method before doing queries');
    }
  }

}
