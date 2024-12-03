import { Location } from '@angular/common';
import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[appBack]'
})
export class BackDirective {

    constructor (private _location: Location) { }

    @HostListener('click')
    onClick (): void {
        this._location.back();
    }

}
