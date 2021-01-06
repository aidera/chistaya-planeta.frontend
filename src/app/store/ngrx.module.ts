import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { environment } from '../../environments/environment';
import { rootEffects } from './root.effects';
import * as fromRoot from './root.reducer';

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forRoot(fromRoot.rootReducer),
    EffectsModule.forRoot(rootEffects),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    StoreRouterConnectingModule.forRoot(),
  ],
  exports: [
    StoreModule,
    EffectsModule,
    StoreDevtoolsModule,
    StoreRouterConnectingModule,
  ],
})
export class NgrxModule {}
