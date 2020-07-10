export const Properties = {
    Rental: {
        amount: {
            label: 'Amount (Dollars)',
            field: 'dropdown',
        },
        tenure: {
            label: 'Tenure (Months)',
            field: 'dropdown',
        },
        product: {
            label: 'Product (Single)',
            field: 'input',
            type: 'text',
        },
    },
    Customer: {
        age: {
            label: 'Age (Years)',
            field: 'dropdown',
        },
        pincode: {
            label: 'Pincode (Single)',
            field: 'input',
            type: 'number',
        },
    },
}

export interface IProperties {
    amount?: string | number;
    tenure?: string | number;
    product?: string;
    age?: string | number;
    pincode?: string;
}