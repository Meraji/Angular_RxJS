import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {

  transform(gender: any): string {
    return gender === 'female' ? 'Ms. ' :  gender === 'male' ? 'Mr. ' : 'Mr./Ms. ';
  }

}
