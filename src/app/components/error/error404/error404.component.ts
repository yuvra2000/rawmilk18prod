import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ParticlesService } from '../../../shared/services/particles.service';

@Component({
  selector: 'app-error404',
  standalone: true,
  imports: [SharedModule,RouterModule],
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.scss']
})
export class Error404Component {
  constructor(private particlesService: ParticlesService) {
    let html = document.querySelector('html');
    html?.removeAttribute("data-width");
  }

  private containerId = 'particles-js';
  ngAfterViewInit(): void {
    this.particlesService.loadParticles(this.containerId);
  }
  ngOndestroy(){
    this.particlesService.destroyParticles(this.containerId);
  }

}
