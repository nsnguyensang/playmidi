import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'signup', component: SignupComponent
  },
  {
    path: '', component: LoginFormComponent
  },
  {
    path: '',
    redirectTo: 'loginForm',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  {
    path: 'play',
    loadChildren: () => import('./play/play.module').then(m => m.PlayPageModule)
  },
  {
    path: 'prod-detail',
    loadChildren: () => import('./prod-detail/prod-detail.module').then(m => m.ProdDetailPageModule)
  },
  {
    path: 'lession',
    loadChildren: () => import('./lession/lession.module').then(m => m.LessionPageModule)
  },
  {
    path: "play-midi",
    loadChildren: () => import('./play-midi/play-midi.module').then(m => m.PlayMidiPageModule)
  },
  {
    path: 'play-midi',
    loadChildren: () => import('./play-midi/play-midi.module').then( m => m.PlayMidiPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
