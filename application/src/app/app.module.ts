import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { NowPlayingComponent } from './now-playing/now-playing.component';
import { SearchComponent } from './search/search.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    NowPlayingComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    MatInputModule,
    MatToolbarModule,
    LayoutModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
