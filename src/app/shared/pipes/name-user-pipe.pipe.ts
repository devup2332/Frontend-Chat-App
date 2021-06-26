import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameUserPipe',
})
export class NameUserPipePipe implements PipeTransform {
  transform(value: string, ...args: number[]): string {
    console.log(value);
    if (value.length > args[0]) {
      return `${value.slice(0, args[0])}...`;
    }
    return value;
  }
}
