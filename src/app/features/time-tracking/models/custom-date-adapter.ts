import { NativeDateAdapter } from '@angular/material/core';

export const CUSTOM_DATE_FORMATS = {
        parse: { dateInput: 'DD/MM/YYYY' },
        display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

export class CustomDateAdapter extends NativeDateAdapter {
        override parse(value: string): Date | null {
        if (!value) return null;
        const parts = value.split('/');
        const day = +parts[0];
        const month = +parts[1] - 1; 
        const year = +parts[2];
        return new Date(year, month, day);
    }

    override format(date: Date, displayFormat: any): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
}