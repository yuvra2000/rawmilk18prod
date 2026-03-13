import { Injectable } from '@angular/core';
import { tsParticles } from '@tsparticles/engine';
import { loadFull } from 'tsparticles';

@Injectable({
  providedIn: 'root'
})
export class ParticlesService {
  constructor() {
    loadFull(tsParticles); // Load all tsParticles features once
  }

  loadParticles(containerId: string): void {
    tsParticles.load({
      id: containerId,
      options: {
        particles: {
          number: {
            value: 400,
            density: {
              enable: true,
              area: 800
            }
          },
          color: { value: '#fff' },
          shape: {
            type: 'circle',
            stroke: { width: 0, color: '#ff0000' },
            polygon: { nb_sides: 5 },
            image: {
              src: '',
              width: 100,
              height: 100
            }
          },
          opacity: {
            value:1,
            random: false,
            anim: { enable: false, speed: 2, opacity_min: 0, sync: false }
          },
          size: {
            value:0.5,
            random: false,
            anim: { enable: false, speed: 0.8, size_min: 0.2, sync: false }
          },
          links: {
            enable: true,
            distance: 100,
            color: '#735dff4a',
            opacity: 0.2,
            width: 0.7
          },
          move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: true,
            straight: false,
            outModes: {
              default: 'bounce'
            }
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onHover: { enable: true, mode: 'push' },
            onClick: { enable: true, mode: 'push' },
            resize: true
          },
          modes: {
            grab: { distance: 100, links: { opacity: 1 } },
            bubble: { distance: 200, size: 80, duration: 0.4 },
            repulse: { distance: 200, duration: 0.4 },
            push:{
              particles_nb: 4
            },
            remove:{
              particles_nb: 2
            }
          }
        },
        retina_detect: true
      } as any
    });
  }

  destroyParticles(containerId: any): void {
    const particlesInstance = tsParticles.domItem(containerId);
    if (particlesInstance) {
      particlesInstance.destroy(); // Destroy particles instance for the given container
    }
  }
}
