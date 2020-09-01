import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { EventComponent } from './event/event.component';
import { AdminComponent } from './admin/admin.component';
import { AppComponent } from './app.component';
import { AdminGuard } from './admin/admin.guard';
import { AdminfutureComponent } from './admin/adminfuture/adminfuture.component';
import { AdmintodayComponent } from './admin/admintoday/admintoday.component';
import { AdminuserComponent } from './admin/adminuser/adminuser.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'event', component: EventComponent },
  { path: 'admin', component: AdminComponent, canActivateChild: [AdminGuard] , children: [{
    path: 'future',
    component: AdminfutureComponent
  }, {
    path: 'today',
    component: AdmintodayComponent
  }, {
    path: 'user',
    component: AdminuserComponent
  }
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }