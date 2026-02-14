import { FinancialProduct } from '../models/Dtos/product.model';

const normalize = (v: unknown): string =>
    String(v ?? '').trim().toLowerCase();

export const filterProducts = (
    list: FinancialProduct[],
    term: string
) => {

    const q = normalize(term);
    if (!q) return list;

    return list.filter(x => {
        const haystack = [
            x.name,
            x.description,
            x.date_release,   
            x.date_revision   
        ]
            .map(normalize)
            .join(' ');

        return haystack.includes(q);
    });
}
