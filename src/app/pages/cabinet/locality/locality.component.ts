import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import * as fromRoot from '../../../store/root.reducer';
import * as LocalitiesActions from '../../../store/locality/locality.actions';
import * as LocalitiesSelectors from '../../../store/locality/locality.selectors';
import { ILocality } from '../../../models/Locality';
import { SimpleStatus } from '../../../models/enums/SimpleStatus';

@Component({
  selector: 'app-locality',
  templateUrl: './locality.component.html',
  styleUrls: ['./locality.component.scss'],
})
export class LocalityComponent implements OnInit, OnDestroy {
  localityId: string;
  locality$: Subscription;
  locality: ILocality | null;
  isFetching$: Subscription;
  isFetching = false;

  localityStatusString = 'Статус';

  simpleStatus = SimpleStatus;

  constructor(
    private store: Store<fromRoot.State>,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.localityId = this.route.snapshot.paramMap.get('id') as string;
    this.store.dispatch(
      LocalitiesActions.getLocalityRequest({ id: this.localityId })
    );

    this.locality$ = this.store
      .select(LocalitiesSelectors.selectLocality)
      .subscribe((locality) => {
        this.locality = locality;

        this.localityStatusString =
          locality && locality.status === 0
            ? 'Статус: <span class="red-text">Не активно</span>'
            : locality && locality.status === 1
            ? 'Статус: <span class="green-text">Активно</span>'
            : 'Статус';
      });

    this.isFetching$ = this.store
      .select(LocalitiesSelectors.selectGetLocalityIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });
  }

  ngOnDestroy(): void {
    if (this.locality$) {
      this.locality$.unsubscribe();
    }
    if (this.isFetching$) {
      this.isFetching$.unsubscribe();
    }
  }

  goToPreviousPage(): void {
    this.location.back();
  }

  enableLocality(): void {
    this.store.dispatch(
      LocalitiesActions.updateLocalityStatusRequest({
        id: this.locality._id,
        status: SimpleStatus.active,
      })
    );
  }

  disableLocality(): void {
    this.store.dispatch(
      LocalitiesActions.updateLocalityStatusRequest({
        id: this.locality._id,
        status: SimpleStatus.inactive,
      })
    );
  }
}
