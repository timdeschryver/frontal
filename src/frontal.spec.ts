import { Component } from '@angular/core';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { FrontalComponent } from './frontal';

let fixture: ComponentFixture<FrontalComponent>;

describe('FrontalInput', () => {
  beforeEach(async(setup));

  it('should open the menu', () => {
    expect(fixture.componentInstance.getState().open).toBeFalsy();
    fixture.componentInstance.openMenu();
    expect(fixture.componentInstance.getState().open).toBeTruthy();
  });
});

function setup() {
  return TestBed.configureTestingModule({
    declarations: [FrontalComponent],
  })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(FrontalComponent);
    });
}
