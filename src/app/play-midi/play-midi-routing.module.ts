import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayMidiPage } from './play-midi.page';

const routes: Routes = [
  {
    path: '',
    component: PlayMidiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayMidiPageRoutingModule {}
