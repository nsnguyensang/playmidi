import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayPageRoutingModule } from './play-routing.module';
import { QuizInfoComponent } from '../quiz-info/quiz-info.component';
import { KeyboardComponent } from '../keyboard/keyboard.component';
import { NotationComponent } from '../notation/notation.component';
import { NoteInfoComponent } from '../note-info/note-info.component';
import { PlayControlComponent } from '../play-control/play-control.component';
import { NotationService } from '../Services/notation.service';
import { PianoService } from '../Services/piano.service';
import { QuizService } from '../Services/quiz.service';
import { SoundService } from '../Services/sound.service';
import { SafePipe } from '../shared/safe.pipe';
import { PlayPage } from './play.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayPageRoutingModule
  ],
  declarations: [
    PlayPage,
    QuizInfoComponent,
    KeyboardComponent,
    NotationComponent,
    PlayControlComponent,
    NoteInfoComponent,
    SafePipe,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
    PianoService,
    SoundService,
    NotationService,
    QuizService
  ],
  bootstrap: [PlayPage],
})

export class PlayPageModule {}
