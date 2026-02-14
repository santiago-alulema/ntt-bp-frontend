import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { GridComponent } from './grid.component';
import { Column } from '@components/shared/models/Column.models';

describe('GridComponent private validators', () => {
  let fixture: ComponentFixture<GridComponent<any>>;
  let component: GridComponent<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GridComponent<any>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('assertNoDuplicateName should throw when duplicate column names exist (trim-aware)', () => {
    const cols: Column[] = [
      { name: 'id', title: 'ID' } as any,
      { name: ' id ', title: 'ID2' } as any, 
    ];

    expect(() => (component as any)['assertNoDuplicateName'](cols))
      .toThrowError(/Duplicate column 'name' detected: id/i);
  });

  it('assertNoDuplicateName should not throw for unique names (and ignore empty)', () => {
    const cols: Column[] = [
      { name: 'id', title: 'ID' } as any,
      { name: 'name', title: 'Name' } as any,
      { name: '   ', title: 'Empty' } as any, 
      { name: '', title: 'Empty2' } as any,   
    ];

    expect(() => (component as any)['assertNoDuplicateName'](cols)).not.toThrow();
  });

  it('assertNoDuplicateNumbers should throw when duplicate numbers exist', () => {
    expect(() => (component as any)['assertNoDuplicateNumbers']([5, 10, 5]))
      .toThrowError(/Duplicate number detected/i);
  });

  it('assertNoDuplicateNumbers should not throw for unique numbers', () => {
    expect(() => (component as any)['assertNoDuplicateNumbers']([5, 10, 20]))
      .not.toThrow();
  });
});