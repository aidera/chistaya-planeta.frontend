import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import * as fromRoot from '../../../../store/root.reducer';
import * as ClientsActions from '../../../../store/clients/clients.actions';
import * as ClientsSelectors from '../../../../store/clients/clients.selectors';
import { ItemPageComponent } from '../../item-page.component';
import { IClient } from '../../../../models/Client';
import {
  clientStatusColors,
  clientStatusStrings,
} from '../../../../data/clientStatusData';
import { responseCodes } from '../../../../data/responseCodes';
import { ClientStatus } from '../../../../models/enums/ClientStatus';
import { ModalAction } from '../../../../components/modal/modal.component';
import { SocketIoService } from '../../../../services/socket-io/socket-io.service';
import { GettersService } from '../../../../services/getters/getters.service';
import { ItemFieldListElement } from '../../../../components/item-field/item-field-inactive-list/item-field-inactive-list.component';

@Component({
  selector: 'app-client-item',
  templateUrl: './client-item.component.html',
  styleUrls: ['./client-item.component.scss'],
})
export class ClientItemComponent
  extends ItemPageComponent
  implements OnInit, OnDestroy {
  /* ------------------ */
  /* Main item settings */
  /* ------------------ */
  public item: IClient;

  /* -------------------- */
  /* Display helpers data */
  /* -------------------- */
  public beautifiedPhone = '';

  /* -------------- */
  /* Forms settings */
  /* -------------- */
  public isUpdateStatusModalOpen = false;
  public updateStatusForm: FormGroup;

  /* ----------- */
  /* Static data */
  /* ----------- */
  public clientStatusStrings = clientStatusStrings;
  public clientStatusColors = clientStatusColors;
  public clientStatus = ClientStatus;

  constructor(
    /* parent */
    protected store: Store<fromRoot.State>,
    protected route: ActivatedRoute,
    protected router: Router,
    /* this */
    private title: Title,
    private snackBar: MatSnackBar,
    private socket: SocketIoService,
    public getters: GettersService
  ) {
    super(store, router, route);

    title.setTitle('Клиент - Чистая планета');
  }

  ngOnInit(): void {
    /* ------------- */
    /* Form settings */
    /* ------------- */
    this.updateStatusForm = new FormGroup({
      blockReason: new FormControl(''),
    });

    /* ---------------- */
    /* Request settings */
    /* ---------------- */
    this.getItemRequest = (withLoading: boolean) => {
      this.store.dispatch(
        ClientsActions.getClientRequest({ id: this.itemId, withLoading })
      );
    };

    /* ----------------- */
    /* Store connections */
    /* ----------------- */
    this.item$ = this.store
      .select(ClientsSelectors.selectClient)
      .subscribe((client) => {
        this.item = client;

        /* ---------- */
        /* Page Title */
        /* ---------- */

        if (client) {
          this.title.setTitle(`Клиент - ${client.name} - Чистая планета`);
        }

        /* -------------------- */
        /* Display data helpers */
        /* -------------------- */

        if (client && client.phone) {
          this.beautifiedPhone = this.getters.getBeautifiedPhoneNumber(
            client.phone
          );
        }
      });

    this.getItemError$ = this.store
      .select(ClientsSelectors.selectGetClientError)
      .subscribe((error) => {
        if (error?.code) {
          this.getItemError =
            error.code === responseCodes.notFound ? 'Не найдено' : error.code;
        } else {
          this.getItemError = null;
        }
      });

    this.itemIsFetching$ = this.store
      .select(ClientsSelectors.selectGetClientIsFetching)
      .subscribe((status) => {
        this.itemIsFetching = status;
      });

    this.itemIsUpdating$ = this.store
      .select(ClientsSelectors.selectUpdateClientIsFetching)
      .subscribe((status) => {
        this.itemIsUpdating = status;
      });

    this.itemIsUpdateSucceed$ = this.store
      .select(ClientsSelectors.selectUpdateClientSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.activeField = null;
          this.isUpdateStatusModalOpen = false;
          this.updateStatusForm.setValue({
            blockReason: '',
          });

          this.updateResultSnackbar = this.snackBar.open(
            'Обновлено',
            'Скрыть',
            {
              duration: 2000,
            }
          );

          this.store.dispatch(ClientsActions.refreshUpdateClientSucceed());
        }
      });

    this.updateItemError$ = this.store
      .select(ClientsSelectors.selectUpdateClientError)
      .subscribe((error) => {
        if (error) {
          this.updateResultSnackbar = this.snackBar.open(
            'Ошибка при обновлении. Пожалуйста, обратитесь в отдел разработки',
            'Скрыть',
            {
              duration: 2000,
              panelClass: 'error',
            }
          );
        }

        this.store.dispatch(ClientsActions.refreshUpdateClientFailure());
      });

    this.socket.get()?.on('clients', (data) => {
      if (data.action === 'add' || data.action === 'delete') {
        this.getItemRequest(false);
      }
      if (data.action === 'update' && data.id) {
        if (this.item?._id === data.id) {
          this.getItemRequest(false);
        }
      }
    });

    /* --------------------------- */
    /* --- Parent class ngInit --- */
    /* --------------------------- */
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    this.socket.get()?.off('clients');
  }

  public onUpdateStatusModalAction(action: ModalAction): void {
    switch (action) {
      case 'cancel':
        this.isUpdateStatusModalOpen = false;
        break;
      case 'resolve':
        this.isUpdateStatusModalOpen = false;
        break;
    }
    if (action === 'reject') {
      this.blockClient();
    }
  }

  public activateClient(): void {
    this.store.dispatch(
      ClientsActions.updateClientStatusRequest({
        id: this.item._id,
        status: ClientStatus.active,
      })
    );
  }

  public blockClient(): void {
    this.store.dispatch(
      ClientsActions.updateClientStatusRequest({
        id: this.item._id,
        status: ClientStatus.blocked,
        blockReason: this.updateStatusForm.get('blockReason').value,
      })
    );
  }
}
