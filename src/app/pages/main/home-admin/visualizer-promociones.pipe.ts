import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'visualizerPromociones'
})
export class VisualizerPromocionesPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
