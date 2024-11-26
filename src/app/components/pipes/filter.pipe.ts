import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true, // Asegúrate de que sea standalone si lo usas en componentes standalone
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, keys: string[]): any[] {
    if (!items || !searchText || !keys.length) {
      return items;
    }
    searchText = searchText.toLowerCase();
    return items.filter((item) =>
      keys.some((key) =>
        (item[key] || '').toString().toLowerCase().includes(searchText)
      )
    );
  }
}
