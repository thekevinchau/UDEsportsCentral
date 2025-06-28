import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchDeleteComponent } from './match-delete.component';

describe('MatchDeleteComponent', () => {
  let component: MatchDeleteComponent;
  let fixture: ComponentFixture<MatchDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
