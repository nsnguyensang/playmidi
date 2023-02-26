import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { PianoNote }  from '../core/piano-note';
import { Router } from '@angular/router';
// import { Observable } from 'rxjs';
// import { throwError } from 'rxjs/internal/observable/throwError';
// import {map, catchError} from 'rxjs/operators';
import { ServerHttpService } from '../Services/server-http.service';



@Injectable()
export class PianoService {

  private pianoKeyMap = {};
  private pianoNoteMap = {};

  // Observable sources
  private pianoNotePlayedSource = new Subject<PianoNote>();

  // Observable streams
  notePlayed$ = this.pianoNotePlayedSource.asObservable();

  constructor(private httpClient: ServerHttpService, private router: Router) {

    this.pianoKeyMap = {
      16: [ 'c2' ],
      17: [ 'c2s', 'd2f' ],
      18: [ 'd2' ],
      19: [ 'd2s', 'e2f' ],
      20: [ 'e2' ],
      21: [ 'f2' ],
      22: [ 'f2s', 'g2f' ],
      23: [ 'g2' ],
      24: [ 'g2s', 'a2f' ],
      25: [ 'a2' ],
      26: [ 'a2s', 'b2f' ],
      27: [ 'b2' ],
      28: [ 'c3' ],
      29: [ 'c3s', 'd3f' ],
      30: [ 'd3' ],
      31: [ 'd3s', 'e3f' ],
      32: [ 'e3' ],
      33: [ 'f3' ],
      34: [ 'f3s', 'g3f' ],
      35: [ 'g3' ],
      36: [ 'g3s', 'a3f' ],
      37: [ 'a3' ],
      38: [ 'a3s', 'b3f' ],
      39: [ 'b3' ],
      40: [ 'c4' ],
      41: [ 'c4s', 'd4f' ],
      42: [ 'd4' ],
      43: [ 'd4s', 'e4f' ],
      44: [ 'e4' ],
      45: [ 'f4' ],
      46: [ 'f4s', 'g4f' ],
      47: [ 'g4' ],
      48: [ 'g4s', 'a4f' ],
      49: [ 'a4' ],
      50: [ 'a4s', 'b4f' ],
      51: [ 'b4' ],
      52: [ 'c5' ],
      53: [ 'c5s', 'd5f' ],
      54: [ 'd5' ],
      55: [ 'd5s', 'e5f' ],
      56: [ 'e5' ],
      57: [ 'f5' ],
      58: [ 'f5s', 'g5f' ],
      59: [ 'g5' ],
      60: [ 'g5s', 'a5f' ],
      61: [ 'a5' ],
      62: [ 'a5s', 'b5f' ],
      63: [ 'b5' ],
      64: [ 'c6' ]
    };

    // create pianoNoteMap, mapping noteIds to keyIds.
    Object.keys(this.pianoKeyMap).forEach(
      keyId => this.pianoKeyMap[keyId].forEach(
        note => this.pianoNoteMap[note] = keyId)
      );
  }



  getNote(noteId: string): PianoNote {
    if(this.pianoNoteMap.hasOwnProperty(noteId)) {
      const keyId = parseInt(this.pianoNoteMap[noteId]);
      return new PianoNote(keyId, noteId);
    }
    else{
      throw new Error('Invalid noteId.');
    }
  }

  getNoteByKeyId(keyId: number): PianoNote {
    if(this.pianoKeyMap.hasOwnProperty(keyId)) {
      const noteId = this.pianoKeyMap[keyId][0]; // default to first note for keyId
      return new PianoNote(keyId, noteId);
    }
    else{
      throw new Error('Invalid keyId. The valid range of keyId is 16 to 64.');
    }
  }

  playNote(noteId: string): void {
    const note = this.getNote(noteId);
    this.pianoNotePlayedSource.next(note);
  }

  playNoteByKeyId(keyId: number): void {
    const note = this.getNoteByKeyId(keyId);
    this.pianoNotePlayedSource.next(note);
  }

  getAlternateNote(noteId: string): PianoNote {

    if(!this.pianoNoteMap.hasOwnProperty(noteId)) {
      throw new Error('Invalid noteId');
    }

    let alternateNote: PianoNote;
    const keyId = parseInt(this.pianoNoteMap[noteId]);
    const notes = this.pianoKeyMap[keyId];

    if(notes.length > 1) {
      if(notes[0] == noteId) {
        alternateNote = new PianoNote(keyId, notes[1]);
      }
      else {
        alternateNote = new PianoNote(keyId, notes[0]);;
      }
    }

    return alternateNote;
  }

  getAllNoteIds(): string[] {
    console.log(Object.keys(this.pianoNoteMap));

    return Object.keys(this.pianoNoteMap);
  }

  // private REST_API_SERVER = 'http://34.101.62.222:9090';

  getLessonContent(lesson_content: string): string[] {
    const keys: string[] = [];

    const notes = lesson_content.split(',');
    for (const note of notes) {
      const _note = note.split('/');
      // console.log(this.pianoNoteMap[_note[0]]);

      if(!this.pianoNoteMap.hasOwnProperty(_note[0])) {
        throw new Error('Invalid noteId');
      }
      keys.push(_note[0]);
    }
    return keys;
  };

  getAllNaturalNoteIds(lowerOctave: number = 2, upperOctave = 6): string[] {
    const naturalNotes: string[] = [];

    Object.keys(this.pianoNoteMap).forEach( note => {
      if(note.length == 2) {
        const n = parseInt( note[1] );
        if(n >= lowerOctave && n <= upperOctave) {
        naturalNotes.push(note);
        }
      }
    });

    return naturalNotes;
  }

}
