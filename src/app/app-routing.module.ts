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
import { CreateeventComponent } from './admin/createevent/createevent.component';
import { UserlistComponent } from './admin/userlist/userlist.component';
import { StandbyComponent } from './admin/standby/standby.component';
import { PasteventComponent } from './admin/pastevent/pastevent.component';
import { UserResolver } from './app.resolver';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '', resolve: { data: UserResolver }, children: [
  { path: 'home', component: HomeComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'event', component: EventComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] , children: [
    {
    path: 'userlist',
    component: UserlistComponent,
    canActivate: [AdminGuard]
  },{
    path: 'future',
    component: AdminfutureComponent,
    canActivate: [AdminGuard]
  }, {
    path: 'today',
    component: AdmintodayComponent,
    canActivate: [AdminGuard]
  }, {
    path: 'standby',
    component: StandbyComponent,
    canActivate: [AdminGuard]
  }, {
    path: 'event',
    component: CreateeventComponent,
    canActivate: [AdminGuard]
  }, {
    path: 'user',
    component: AdminuserComponent,
    canActivate: [AdminGuard]
  }, {
    path: 'past',
    component: PasteventComponent,
    canActivate: [AdminGuard]
  },
  ]},
]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
