import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';

import { SimpleLayoutComponent } from './simple-layout.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { HttpClientModule } from '@angular/common/http';

describe('SimpleLayoutComponent', () => {
  let component: SimpleLayoutComponent;
  let fixture: ComponentFixture<SimpleLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimpleLayoutComponent, FooterComponent],
      imports: [
        RouterTestingModule,
        MatCardModule,
        RouterTestingModule,
        InlineSVGModule.forRoot(),
        HttpClientModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should has logo', () => {
    const logoImage = fixture.debugElement.query(By.css('img')).nativeElement;

    expect(logoImage).toBeTruthy();
    expect(logoImage.getAttribute('src')).toContain('logo.png');
  });

  it('should has employee identification, if the page belongs to the employees flow', () => {
    component.isEmployee = true;
    fixture.detectChanges();

    const identification = fixture.debugElement.query(
      By.css('.employee-definer')
    );

    expect(identification).toBeTruthy();
  });

  it('should not has employee identification, if the page belongs to the client flow', () => {
    component.isEmployee = false;
    fixture.detectChanges();

    const identification = fixture.debugElement.query(
      By.css('.employee-definer')
    );

    expect(identification).toBeFalsy();
  });
});
