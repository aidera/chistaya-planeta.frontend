import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-divisions-table',
  templateUrl: './divisions-table.component.html',
  styleUrls: ['./divisions-table.component.scss'],
})
export class DivisionsTableComponent implements OnInit {
  public currentForm: 'fast' | 'advanced' | 'id' = 'fast';

  public fastSearchForm: FormGroup;
  public advancedSearchForm: FormGroup;
  public idSearchForm: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.initFastSearchForm();
    this.initAdvancedSearchForm();
    this.initIdSearchForm();
  }

  initFastSearchForm(): void {
    this.fastSearchForm = new FormGroup({
      search: new FormControl(''),
    });
  }

  initAdvancedSearchForm(): void {
    this.fastSearchForm = new FormGroup({
      type: new FormControl(''),
      deliveryType: new FormControl(''),
      deliveryCustomerCarNumber: new FormControl(''),
      deliveryHasAssistant: new FormControl(''),
      locality: new FormControl(''),
      deliveryAddressFromStreet: new FormControl(''),
      deliveryAddressFromHouse: new FormControl(''),
      division: new FormControl(''),
      approximateRawType: new FormControl(''),
      approximateRawAmountUnit: new FormControl(''),
      approximateRawAmountFrom: new FormControl(''),
      approximateRawAmountTo: new FormControl(''),
      customerOrganizationLegalName: new FormControl(''),
      customerOrganizationActualName: new FormControl(''),
      customerContactName: new FormControl(''),
      customerContactPhone: new FormControl(''),
      paymentMethod: new FormControl(''),
      desiredPickupDateFrom: new FormControl(''),
      desiredPickupDateTo: new FormControl(''),
      customerComment: new FormControl(''),
      status: new FormControl(''),
      manager: new FormControl(''),
      driver: new FormControl(''),
      companyCar: new FormControl(''),
      statusDateAcceptedFrom: new FormControl(''),
      statusDateAcceptedTo: new FormControl(''),
      statusDateInTransitFrom: new FormControl(''),
      statusDateInTransitTo: new FormControl(''),
      statusDatePackedFrom: new FormControl(''),
      statusDatePackedTo: new FormControl(''),
      statusDateDeliveredFrom: new FormControl(''),
      statusDateDeliveredTo: new FormControl(''),
      statusDateWeighedFrom: new FormControl(''),
      statusDateWeighedTo: new FormControl(''),
      statusDateCompletedFrom: new FormControl(''),
      statusDateCompletedTo: new FormControl(''),
      customerCancellationReason: new FormControl(''),
      companyCancellationReason: new FormControl(''),
      companyComment: new FormControl(''),
      rawAmount: new FormControl(''),
      paymentAmount: new FormControl(''),
      createdAtFrom: new FormControl(''),
      createdAtTo: new FormControl(''),
      updatedAtFrom: new FormControl(''),
      updatedAtTo: new FormControl(''),
    });
  }

  initIdSearchForm(): void {
    this.idSearchForm = new FormGroup({
      id: new FormControl(''),
      scheduledOrder: new FormControl(''),
      client: new FormControl(''),
    });
  }
}
