import { describe, it, expect } from 'vitest';
import { filterProducts } from './products-search.util';

describe('filterProducts', () => {
  it('should return full list when term is empty', () => {
    const list: any[] = [
      { id: '1', name: 'Cuenta', description: 'Producto', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' },
      { id: '2', name: 'Tarjeta', description: 'Plástico', logo: '', date_release: '2025-02-01', date_revision: '2026-02-01' },
    ];

    const res = filterProducts(list as any, '');
    expect(res).toHaveLength(2);
  });

  it('should filter by name/description and be case-insensitive', () => {
    const list: any[] = [
      { id: '1', name: 'Cuenta', description: 'Producto bancario', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' },
      { id: '2', name: 'Tarjeta', description: 'Plástico', logo: '', date_release: '2025-02-01', date_revision: '2026-02-01' },
    ];

    const res = filterProducts(list as any, 'BANCARIO');
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe('1');
  });

  it('should filter by date fields too', () => {
    const list: any[] = [
      { id: '1', name: 'Cuenta', description: 'x', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' },
      { id: '2', name: 'Tarjeta', description: 'y', logo: '', date_release: '2025-02-01', date_revision: '2026-02-01' },
    ];

    const res = filterProducts(list as any, '2025-02-01');
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe('2');
  });

  it('should handle null/undefined fields (normalize branch v ?? "")', () => {
  const list: any[] = [
    {
      id: '1',
      name: undefined,
      description: null,
      logo: '',
      date_release: undefined,
      date_revision: null,
    },
    {
      id: '2',
      name: 'Tarjeta',
      description: 'ok',
      logo: '',
      date_release: '2025-02-01',
      date_revision: '2026-02-01',
    },
  ];

  const res = filterProducts(list as any, 'tarjeta');
  expect(res).toHaveLength(1);
  expect(res[0].id).toBe('2');
});
});