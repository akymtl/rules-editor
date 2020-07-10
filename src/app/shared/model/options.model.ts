export const Options = {
    less: {
        label: 'less than',
        placeholder: 'Enter the value',
        type: 'number'
    },
    greater: {
        label: 'greater than',
        placeholder: 'Enter the value',
        type: 'number'
    },
    range: {
        label: 'within range of',
        placeholder: 'Enter in format start, end',
        type: 'text'
    },
}

export interface IOptions {
    less: any;
    greater: any;
    range: any;
}