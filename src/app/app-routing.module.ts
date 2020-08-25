import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { EventComponent } from './event/event.component';
import { AdminComponent } from './admin/admin.component';
import { AppComponent } from './app.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full', resolve: { '': AppComponent }},
  { path: 'home', component: HomeComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'event', component: EventComponent },
  { path: 'admin', component: AdminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }