import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-workers',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './workers.html',
  styleUrl: './workers.css',
})
export class Workers {

}
