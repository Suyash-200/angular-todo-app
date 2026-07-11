import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardServices } from './board-services';

describe('BoardServices', () => {
  let component: BoardServices;
  let fixture: ComponentFixture<BoardServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardServices],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardServices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
