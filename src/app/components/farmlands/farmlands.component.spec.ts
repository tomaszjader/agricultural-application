import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmlandsComponent } from './farmlands.component';

describe('FarmlandsComponent', () => {
  let component: FarmlandsComponent;
  let fixture: ComponentFixture<FarmlandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FarmlandsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmlandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
