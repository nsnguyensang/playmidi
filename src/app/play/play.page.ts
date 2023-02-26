import { Component, ViewChild, OnInit } from '@angular/core';
import { Subscription }   from 'rxjs';

import { NotationComponent } from '../notation/notation.component';

import { PianoService } from 'src/app/Services/piano.service';
import { SoundService } from 'src/app/Services/sound.service';
import { QuizService } from '../Services/quiz.service';
import { PianoNote } from '../core/piano-note';
import { PianoMode } from '../core/piano-mode.enum';
import { QuizStatus } from '../core/quiz-status.enum';
import {ServerHttpService} from '../Services/server-http.service';
import p5 from 'p5';

declare const p5;
declare const ml5;
@Component({
  selector: 'app-play',
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})
export class PlayPage {
  PianoMode = PianoMode; // allows template access to PianoMode enum
  title = 'Piano Play';
  mode: PianoMode = PianoMode.Play;
  subscription: Subscription;

  quizCorrect = 0;
  quizIncorrect = 0;
  quizLength = 16;
  quizStatus: QuizStatus = QuizStatus.None;
  resultDescription = '';

  private currentTestNote: PianoNote;
  private timeoutId: any;
  private delayMs = 1000;

  lesson_id: number[] = new Array();
  lesson_title: string[] = new Array();
  title2id = {};
  
  myArray: any[] = [];
  
  @ViewChild(NotationComponent, {static: false}) notation: NotationComponent;

  constructor(
    private serverHttp: ServerHttpService,
    private pianoService: PianoService,
    private soundService: SoundService,
    // private tunerPage: TunerPage,
    private quizService: QuizService) {
      this.subscription = pianoService.notePlayed$.subscribe(note=>this.handleNotePlayed(note));
  }
  // STATE
  hasStarted = false;
  hasEverStarted = false;
  pitchReachedDelay = false;

  // DISPLAY
  noteName = 'C#';
  selected = '';

  displayFrequency = 0;

  // STATS
  detuneDifference = 4;
  tunedQueue = 0;
  elapsedTimeRightPitch;

  // P5
  p5;
  advice;
  pitch;

  // NOTES FREQUENCY
  guitarNotes = [

    { note: 'C2', freq: 65.41, keyId: 16, noteId: 'c2'},
    { note: 'C#2/Db2', freq: 69.30, keyId: 17, noteId: 'c2s'},
    { note: 'D2', freq: 73.42, keyId: 18, noteId: 'd2' },
    { note: 'D#2/Eb2', freq: 77.78, keyId: 19, noteId: 'd2s' },
    { note: 'E2', freq: 82.41, keyId: 20, noteId: 'e2' },
    { note: 'F2', freq: 87.31, keyId: 21, noteId: 'f2' },
    { note: 'F#2/Gb2', freq: 92.50, keyId: 22, noteId: 'f2s' },
    { note: 'G2', freq: 98, keyId: 23, noteId: 'g2' },
    { note: 'G#2/Ab2', freq: 103.83, keyId: 24, noteId: 'g2s'},
    { note: 'A2', freq: 110, keyId: 25, noteId: 'a2'},
    { note: 'A#2/Bb2', freq: 116.54, keyId: 26, noteId: 'a2s' },
    { note: 'B2', freq: 123.47, keyId: 27, noteId: 'b2' },
    { note: 'C3', freq: 130.81, keyId: 28, noteId: 'c3' },
    { note: 'C#3/Db3', freq: 138.59, keyId: 29, noteId: 'c3s' },
    { note: 'D3', freq: 146.83, keyId: 30, noteId: 'd3' },
    { note: 'D#3/Eb3', freq: 155.56, keyId: 31, noteId: 'd3s' },
    { note: 'E3', freq: 164.81, keyId: 32, noteId: 'e3' },
    { note: 'F3', freq: 174.61, keyId: 33, noteId: 'f3' },
    { note: 'F#3/Gb3', freq: 185, keyId: 34, noteId: 'f3s' },
    { note: 'G3', freq: 196, keyId: 35, noteId: 'g3' },
    { note: 'G#3/Ab3', freq: 207.65, keyId: 36, noteId: 'g3s' },
    { note: 'A3', freq: 220.00, keyId: 37, noteId: 'a3' },
    { note: 'A#3/Bb3', freq: 233.08, keyId: 38, noteId: 'a3s' },
    { note: 'B3', freq:  246.94, keyId: 39, noteId: 'b3' },
    { note: 'C4', freq: 261.63, keyId: 40, noteId: 'c4' },
    { note: 'C#4/Db4', freq: 277.18, keyId: 41, noteId: 'c4s' },
    { note: 'D4', freq: 293.66, keyId: 42, noteId: 'd4' },
    { note: 'D#4/Eb4', freq: 311.13, keyId: 43, noteId: 'd4s' },
    { note: 'E4', freq: 329.63, keyId: 44, noteId: 'e4' },
    { note: 'F4', freq: 349.23, keyId: 45, noteId: 'f4' },
    { note: 'F#4/Gb4', freq: 369.99, keyId: 46, noteId: 'f4s' },
    { note: 'G4', freq: 392, keyId: 47, noteId: 'g4' },
    { note: 'G#4/Ab4', freq: 415, keyId: 48, noteId: 'g4s' },
    { note: 'A4', freq: 440, keyId: 49, noteId: 'a4' },
    { note: 'A#4/Bb4', freq: 466.16, keyId: 50, noteId: 'a4s' },
    { note: 'B4', freq: 493.88, keyId: 51, noteId: 'b4' },
    { note: 'C5', freq: 523.25, keyId: 52, noteId: 'c5' },
    { note: 'C#5/Db5', freq: 554.37, keyId: 53, noteId: 'c5s' },
    { note: 'D5', freq: 587.33, keyId: 54, noteId: 'd5' },
    { note: 'D#5/Eb5', freq: 622.25, keyId: 55, noteId: 'd5s' },
    { note: 'E5', freq: 659.25, keyId: 56, noteId: 'e5' },
    { note: 'F5', freq: 698.46, keyId: 57, noteId: 'f5' },
    { note: 'F#5/Gb5', freq: 739.99, keyId: 58, noteId: 'f5s' },
    { note: 'G5', freq: 783.99, keyId: 59, noteId: 'g5' },
    { note: 'G#5/Ab5', freq: 830.61, keyId: 60, noteId: 'g5s' },
    { note: 'A5', freq: 880.00, keyId: 61, noteId: 'a5' },
    { note: 'A#5/Bb5', freq: 932.33, keyId: 62, noteId: 'a5s' },
    { note: 'B5', freq: 987.77, keyId: 63, noteId: 'b5' },
    { note: 'C6', freq: 1046.50, keyId: 64, noteId: 'c6' },



  ];
  // UTIL
  selectedToNote = {
    guitar: this.guitarNotes,
  };

  registerInput() {
    this.hasStarted = !this.hasStarted;
    if (!this.hasEverStarted) {
      this.hasEverStarted = true;
      new p5((tuner) => this.handleInput(tuner, this));
    } else {
      this.handleInput(this.p5, this);
    }
  }

  switchTo(instrument: string) {
    this.selected = instrument;
  }

  checkTunedQueue() {
    // if (!this.elapsedTimeRightPitch) {
    //   return;
    // }
    // const endTime = performance.now();
    // if (Math.round((endTime - this.elapsedTimeRightPitch) / 1000) > 1 && this.pitchReachedDelay === false) {
    //   this.pitchReachedDelay = true;
    //   this.pitchReached.play();
    //   setTimeout(() => {
    //     this.pitchReachedDelay = false;
    //     this.elapsedTimeRightPitch = null;
    //   }, 1000);
    // }
  }


  renderDisplay(tuner: any, toneDiff: number, noteDetected: any) {
    if (tuner.abs(toneDiff) < this.detuneDifference) {
      // this.advice = 'Hold there';
      if (this.elapsedTimeRightPitch === null) {
        this.elapsedTimeRightPitch = performance.now();
      }
    } else if (toneDiff > this.detuneDifference) {
      // this.advice = 'Tune Down';
      this.elapsedTimeRightPitch = null;
    } else if (toneDiff < -this.detuneDifference ) {
      // this.advice = 'Tune Up';
      this.elapsedTimeRightPitch = null;
    }
    this.noteName = noteDetected.note;
    this.currentTestNote = new PianoNote(noteDetected.keyId, noteDetected.noteId);
    this.checkTunedQueue();
    this.myArray.push(noteDetected.freq);
    console.log(this.myArray.slice(-2)[0]);

    if (noteDetected.keyId > 16 && noteDetected.keyId <= 64 && this.myArray.slice(-2)[0] !== noteDetected.freq  ) {
      this.pianoService.playNoteByKeyId(noteDetected.keyId);
    } else {
      console.log('Error');
    }
  }

  handleInput(tuner, object) {
    let freq = 0;

    object.p5 = tuner;

    tuner.setup = () => {
      const modelUrl = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
      const audioContext = new AudioContext();
      const mic = new p5.AudioIn(); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
      let pitch;
      mic.start(loadModel);

      // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
      function loadModel() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        pitch = ml5.pitchDetection(modelUrl, audioContext, mic.stream, modelLoaded);
      }

      // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
      function modelLoaded() {
        pitch.getPitch(gotPitch);
      }
      // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
      function gotPitch(error: string, frequency: number) {
        if (error) {
          console.error(error);
        }
        if (frequency) {
          freq = frequency;
        }
        pitch.getPitch(gotPitch);
      }
    };

    tuner.draw = () => {
      let noteDetected;
      let toneDiff = Infinity;
      this.selectedToNote[this.selected].forEach(note => {
        const diff = freq - note.freq;
        this.displayFrequency = Math.floor(freq);
        if (tuner.abs(diff) < tuner.abs(toneDiff)) {
          noteDetected = note;
          toneDiff = diff;
        }
      });
      object.renderDisplay(tuner, toneDiff, noteDetected);
    };
  }
  ngOnInit() {
    this.soundService.initialize();
    this.serverHttp.getLessons().subscribe((data) =>  {
      for(let d of data) {
        this.lesson_id.push(d['lesson_id'])
        this.lesson_title.push(d['lesson_title'])
      }
      // console.log(this.lesson_id)
      // console.log(this.lesson_title)
      this.lesson_title.forEach((key, i) => this.title2id[key] = this.lesson_id[i]);

    });

  }

  handleModeSelected(selectedMode: PianoMode) {
    if( this.mode == selectedMode ) {return;}
    // Mode has been changed
    this.mode = selectedMode;
    if(this.mode == PianoMode.Quiz) {
        this.newQuiz();
    }
    else {
      // Clear all notes from the notation component
      this.notation.clear();
    }
  }

  handleKeyPlayed(keyId: number) {
    if(this.mode == PianoMode.Play) {
        this.pianoService.playNoteByKeyId(keyId);
    }
    else {
      // We are in Quiz mode, so just play the note sound
      this.soundService.playNote(keyId);
      // Update the quiz in progress
      if(this.quizService.inProgress) {
        this.quizService.recordResult(keyId, this.currentTestNote);
        this.quizCorrect = this.quizService.correct;
        this.quizIncorrect = this.quizService.incorrect;

        if(this.quizService.next()) {
          this.notation.clear();
          this.currentTestNote= this.pianoService.getNote( this.quizService.getCurrentNoteId() );
          this.notation.addNote(this.currentTestNote);
        }
        else {
          setTimeout( () => this.finishQuiz(), this.delayMs );
        }
      }
    }
  }

  handleNotePlayed(note: PianoNote){
    this.soundService.playNote(note.keyId); 
  }

  handleButtonClicked(data: any){
    if (data.button == 'start') {
      this.startQuiz(data.level);
    }
    else if(data.button = 'try-again') {
      this.newQuiz();
    }
  }

  private newQuiz() {
    this.notation.clear();
    this.quizStatus = QuizStatus.Starting;
  }

  private startQuiz(lesson_title: string) {
    let notes: string[] = [];
    const lesson_id = this.title2id[lesson_title];
    this.serverHttp.getLessonsContent(lesson_id).subscribe(value => {
      notes = this.pianoService.getLessonContent(value.notes_list);
      // console.log('notes: ', notes);
      this.quizLength = notes.length;
      console.log(this.quizLength);
      this.quizService.startQuiz(this.quizLength, notes);
      this.quizStatus = QuizStatus.InProgress;
      this.quizCorrect = this.quizService.correct;
      this.quizIncorrect = this.quizService.incorrect;
      this.currentTestNote = this.pianoService.getNote( this.quizService.getCurrentNoteId() );
      this.notation.addNote(this.currentTestNote);
    });

    // this.quizService.startQuiz(this.quizLength, notes);
    // this.quizStatus = QuizStatus.InProgress;
    // this.quizCorrect = this.quizService.correct;
    // this.quizIncorrect = this.quizService.incorrect;
    // this.currentTestNote = this.pianoService.getNote( this.quizService.getCurrentNoteId() );
    // this.notation.addNote(this.currentTestNote);
  }

  private finishQuiz() {
    if(this.quizCorrect == this.quizLength) {
      this.resultDescription = 'Perfect score, awesome!';
    }
    else if(this.quizCorrect > (this.quizLength * 0.8)) {
      this.resultDescription = 'Great score, well done!';
    }
    else if(this.quizCorrect > (this.quizLength * 0.6)) {
      this.resultDescription = 'Good score!';
    }
    else if(this.quizCorrect > (this.quizLength * 0.4)) {
      this.resultDescription = 'Not bad, keep trying.';
    }
    else {
      this.resultDescription = 'Looks like you need more practice.';
    }

    this.quizStatus = QuizStatus.Finished;

  }

}
