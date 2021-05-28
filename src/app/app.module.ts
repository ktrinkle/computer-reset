import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent, DialogCancelComponent } from './home/home.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { AdminComponent } from './admin/admin.component';
import { EventComponent } from './event/event.component';
import { AdminfutureComponent, AlertComponent } from './admin/adminfuture/adminfuture.component';
import { AdmintodayComponent } from './admin/admintoday/admintoday.component';
import { AdminuserComponent } from './admin/adminuser/adminuser.component';
import { CreateeventComponent } from './admin/createevent/createevent.component';
import { UserlistComponent } from './admin/userlist/userlist.component';
import { StandbyComponent } from './admin/standby/standby.component';
import { RulesComponent } from './helper/rules/rules.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { JwtInterceptor } from './httpinject.service';
import { AppConfigService } from './app-config.service';

import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { LoadEventComponent } from './helper/load-event/load-event.component';
import { PasteventComponent } from './admin/pastevent/pastevent.component';
import { AppAlertComponent } from './helper/alert/alert.component';


export function appInitFb(appConfigService: AppConfigService) {
  return () => appConfigService.loadFb();
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PrivacyComponent,
    AdminComponent,
    EventComponent,
    AdminfutureComponent,
    AdmintodayComponent,
    AdminuserComponent,
    CreateeventComponent,
    UserlistComponent,
    StandbyComponent,
    RulesComponent,
    AppAlertComponent,
    DialogCancelComponent,
    LoadEventComponent,
    PasteventComponent
  ],
  imports:[
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatButtonToggleModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatSelectModule,
    MatListModule,
    ReactiveFormsModule,
    MatSidenavModule,
    FlexLayoutModule,
    MatTabsModule,
    MatSnackBarModule,
    MatNativeDateModule,
    MatRippleModule,
    MatDialogModule,
    NgxSkeletonLoaderModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    AppRoutingModule
  ],
  providers: [
    // Http Interceptor(s) -  adds with Client Credentials
    [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
    ],
    [AppConfigService,
      {
        provide: APP_INITIALIZER,
        useFactory: appInitFb,
        multi: true,
        deps: [AppConfigService]
      }
    ]
  ],
  exports: [
    AdminfutureComponent,
    HomeComponent,
    DialogCancelComponent,
    AppAlertComponent
  ],
  entryComponents: [
    DialogCancelComponent,
    AppAlertComponent
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
