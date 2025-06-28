import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchesBoxComponent } from './matches-box.component';

describe('MatchesBoxComponent', () => {
  let component: MatchesBoxComponent;
  let fixture: ComponentFixture<MatchesBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchesBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchesBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
