import { TestBed } from '@angular/core/testing';
import { HttpParams } from '@angular/common/http';

import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be any params', () => {
    const params = new HttpParams();
    expect(service.createGetRouteParams({})).toEqual(params);
  });

  it('should return correct params only with pagination (page and perPage)', () => {
    let params = new HttpParams();
    params = params.append('page', '1');
    params = params.append('perPage', '12');

    expect(
      service.createGetRouteParams({ pagination: { page: 1, perPage: 12 } })
    ).toEqual(params);
  });

  it('should return correct params only with pagination (only page)', () => {
    let params = new HttpParams();
    params = params.append('page', '1');

    expect(service.createGetRouteParams({ pagination: { page: 1 } })).toEqual(
      params
    );
  });

  it('should return correct params only with sorting (check 1)', () => {
    let params = new HttpParams();
    params = params.append('sortingField', 'testField');
    params = params.append('sortingType', 'asc');

    expect(
      service.createGetRouteParams({
        sorting: { type: 'asc', field: 'testField' },
      })
    ).toEqual(params);
  });
  it('should return correct params only with sorting (check 2)', () => {
    let params = new HttpParams();
    params = params.append('sortingField', 'testField2');
    params = params.append('sortingType', 'desc');

    expect(
      service.createGetRouteParams({
        sorting: { type: 'desc', field: 'testField2' },
      })
    ).toEqual(params);
  });
  it('should return correct params only with search', () => {
    let params = new HttpParams();
    params = params.append('search', 'search query');

    expect(service.createGetRouteParams({ search: 'search query' })).toEqual(
      params
    );
  });

  it('should return correct params only with one text filter', () => {
    let params = new HttpParams();
    params = params.append('filter__test', 'test with text');

    expect(
      service.createGetRouteParams({ filter: { test: 'test with text' } })
    ).toEqual(params);
  });
  it('should return correct params only with one number filter (check 1)', () => {
    let params = new HttpParams();
    params = params.append('filter__test', '[0,1]');

    expect(service.createGetRouteParams({ filter: { test: [0, 1] } })).toEqual(
      params
    );
  });
  it('should return correct params only with one number filter (check 2)', () => {
    let params = new HttpParams();
    params = params.append('filter__test', '[null,1]');

    expect(
      service.createGetRouteParams({ filter: { test: [null, 1] } })
    ).toEqual(params);
  });

  it('should return correct params only with one number filter (check 3)', () => {
    let params = new HttpParams();
    params = params.append('filter__test', '[1,null]');

    expect(
      service.createGetRouteParams({ filter: { test: [1, null] } })
    ).toEqual(params);
  });
  it('should return correct params only with one date filter (check 1)', () => {
    const dateString = new Date().toISOString();
    let params = new HttpParams();
    params = params.append('filter__test', `["${dateString}",null]`);

    expect(
      service.createGetRouteParams({ filter: { test: [dateString, null] } })
    ).toEqual(params);
  });
  it('should return correct params only with one date filter (check 2)', () => {
    const dateString = new Date().toISOString();
    let params = new HttpParams();
    params = params.append('filter__test', `["${dateString}","${dateString}"]`);

    expect(
      service.createGetRouteParams({
        filter: { test: [dateString, dateString] },
      })
    ).toEqual(params);
  });
  it('should return correct params only with one date filter (check 3)', () => {
    const dateString = new Date().toISOString();
    let params = new HttpParams();
    params = params.append('filter__test', `[null,"${dateString}"]`);

    expect(
      service.createGetRouteParams({ filter: { test: [null, dateString] } })
    ).toEqual(params);
  });
  it('should return correct params only with several filters', () => {
    const dateString = new Date().toISOString();
    let params = new HttpParams();
    params = params.append('filter__test1', `[null,"${dateString}"]`);
    params = params.append('filter__test2', 'test text string');

    expect(
      service.createGetRouteParams({
        filter: { test1: [null, dateString], test2: 'test text string' },
      })
    ).toEqual(params);
  });

  it('should return correct params with page, sorting and filters', () => {
    const dateString = new Date().toISOString();
    let params = new HttpParams();
    params = params.append('page', '1');
    params = params.append('perPage', '12');
    params = params.append('sortingField', 'testField');
    params = params.append('sortingType', 'asc');
    params = params.append('filter__test1', `[null,"${dateString}"]`);
    params = params.append('filter__test2', 'test text string');

    expect(
      service.createGetRouteParams({
        pagination: { page: 1, perPage: 12 },
        sorting: { type: 'asc', field: 'testField' },
        filter: { test1: [null, dateString], test2: 'test text string' },
      })
    ).toEqual(params);
  });

  it('should return correct params with page, sorting and search', () => {
    let params = new HttpParams();
    params = params.append('page', '1');
    params = params.append('perPage', '12');
    params = params.append('sortingField', 'testField');
    params = params.append('sortingType', 'asc');
    params = params.append('search', 'test text string');

    expect(
      service.createGetRouteParams({
        pagination: { page: 1, perPage: 12 },
        sorting: { type: 'asc', field: 'testField' },
        search: 'test text string',
      })
    ).toEqual(params);
  });

  it('should return correct params only with page, sorting and filter even if search is', () => {
    const dateString = new Date().toISOString();
    let params = new HttpParams();
    params = params.append('page', '1');
    params = params.append('perPage', '12');
    params = params.append('sortingField', 'testField');
    params = params.append('sortingType', 'asc');
    params = params.append('filter__test1', `[null,"${dateString}"]`);
    params = params.append('filter__test2', 'test text string');

    expect(
      service.createGetRouteParams({
        pagination: { page: 1, perPage: 12 },
        sorting: { type: 'asc', field: 'testField' },
        search: 'test text string',
        filter: { test1: [null, dateString], test2: 'test text string' },
      })
    ).toEqual(params);
  });
});
