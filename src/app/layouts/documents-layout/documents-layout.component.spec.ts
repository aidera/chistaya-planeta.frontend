import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { InlineSVGModule } from 'ng-inline-svg';
import { HttpClientModule } from '@angular/common/http';

import { DocumentsLayoutComponent } from './documents-layout.component';
import { FooterComponent } from '../../components/footer/footer.component';

describe('DocumentsLayoutComponent', () => {
  let component: DocumentsLayoutComponent;
  let fixture: ComponentFixture<DocumentsLayoutComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DocumentsLayoutComponent, FooterComponent],
        imports: [
          RouterTestingModule,
          MatCardModule,
          RouterTestingModule,
          InlineSVGModule.forRoot(),
          HttpClientModule,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
