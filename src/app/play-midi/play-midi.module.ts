import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayMidiPageRoutingModule } from './play-midi-routing.module';

import { PlayMidiPage } from './play-midi.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayMidiPageRoutingModule,
  ],
  declarations: [PlayMidiPage]
})
export class PlayMidiPageModule { }
