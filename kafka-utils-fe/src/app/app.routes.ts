import { Router, Routes } from '@angular/router';
import {
  ConsumerGroupPageComponent,
  ConsumerPageComponent,
  ProducerPageComponent,
} from 'components/pages';
import { LINKS } from 'models/constants';
import { inject } from '@angular/core';

export const routes: Routes = [
  { path: '', redirectTo: LINKS.CONSUMER_PAGE, pathMatch: 'full' },
  {
    path: LINKS.CONSUMER_PAGE,
    component: ConsumerPageComponent,
  },
  {
    path: LINKS.PRODUCER_PAGE,
    component: ProducerPageComponent,
    canActivate: [
      () => {
        const router = inject(Router);
        router.navigate([LINKS.CONSUMER_PAGE]);
        return false;
      },
    ],
  },
  {
    path: LINKS.CONSUMER_GROUP_PAGE,
    component: ConsumerGroupPageComponent,
    canActivate: [
      () => {
        const router = inject(Router);
        router.navigate([LINKS.CONSUMER_PAGE]);
        return false;
      },
    ],
  },
];
