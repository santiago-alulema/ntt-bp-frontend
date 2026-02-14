import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { DialogService } from './dialog.service';

describe('DialogService', () => {
  it('alert(): should set state with default type success when type is missing (branch: ??)', async () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(DialogService);

    const p = service.alert({ title: 'T', message: 'M' });

    const s = service.state();
    expect(s).toBeTruthy();
    expect(s!.mode).toBe('alert');
    expect(s!.type).toBe('success'); 
    expect(s!.title).toBe('T');
    expect(s!.message).toBe('M');

    service.close(true);
    await p;
  });

  it('alert(): should keep provided type (branch: ?? other side)', async () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(DialogService);

    const p = service.alert({ title: 'T', message: 'M', type: 'error' });

    const s = service.state();
    expect(s).toBeTruthy();
    expect(s!.type).toBe('error'); 

    service.close(true);
    await p;
  });

  it('confirm(): should set default type warning and resolve boolean on close (branches: ?? + close)', async () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(DialogService);

    const p = service.confirm({ title: 'C', message: 'Seguro?' }); 

    const s = service.state();
    expect(s).toBeTruthy();
    expect(s!.mode).toBe('confirm');
    expect(s!.type).toBe('warning'); 

    service.close(false);
    const res = await p;

    expect(res).toBe(false);
    expect(service.state()).toBeNull(); 
  });

  it('close(): should do nothing when there is no state (branch: if(!s) return)', () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(DialogService);

    expect(service.state()).toBeNull();

    service.close(true);
    expect(service.state()).toBeNull();
  });
});