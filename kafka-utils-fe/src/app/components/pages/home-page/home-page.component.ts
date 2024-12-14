import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavigationLink } from 'models/navigationLink.interface';
import { LINKS } from 'models/constants';

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  imports: [MatTabsModule, MatToolbarModule, RouterLink, RouterOutlet],
})
export class HomePageComponent {
  navigationLinks: NavigationLink[] = [
    { label: 'Consumer', link: LINKS.CONSUMER_PAGE, disabled: false },
    { label: 'Producer', link: LINKS.PRODUCER_PAGE, disabled: true },
    { label: 'Consumer Groups', link: LINKS.CONSUMER_GROUP_PAGE, disabled: true },
  ];
  activeNavLink = this.navigationLinks[0];
}
