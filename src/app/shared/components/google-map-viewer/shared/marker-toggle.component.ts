// src/app/components/marker-toggle/marker-toggle.component.ts
import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PolylineService } from '../../../services/mapServices/polyline.service';
import { LiveTrackingService } from './LiveTracking.service';
import { PlayTrackService } from './play-track.service';
@Component({
  selector: 'app-marker-toggle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="marker-toggle-container">
      @if(drawPolyline()){
      <button
        class="toggle-button"
        (click)="togglePolyline()"
        [class.active]="polylineService.showPolyline()"
      >
        <i
          class="fa-solid fa-s"
          style="transform: rotate(40deg); display:inline-block; color:blue"
        ></i>

        <!-- <span>{{ category.name | titlecase }}</span> -->
      </button>
   <!-- ✅ PLAY TRACK CONTROLS -->
         <div class="playback-group d-flex align-items-center gap-1 border-start ps-2 ms-1">
             <!-- Play/Pause Button -->
             <button class="toggle-button" 
                 [class.active]="playTrackService.isPlaybackActive()" 
                 (click)="togglePlayback()" 
                 [disabled]="liveTrackingService.isTrackingActive()"
                 title="Play History">
                 @if(playTrackService.isLoading()) {
                     <span class="spinner-border spinner-border-sm text-primary" role="status"></span>
                 } @else {
                     <i class="fa-solid" [class.fa-pause]="playTrackService.isPlaybackActive()" [class.fa-play]="!playTrackService.isPlaybackActive()" style="color: blue;"></i>
                 }
             </button>

             <!-- Speed Slider (Only show when playing or paused) -->
             @if(playTrackService.isPlaybackActive()) {
                 <div class="d-flex flex-column align-items-center" style="width: 80px;">
                     <input 
                        type="range" 
                        min="0.5" max="8" step="0.5" 
                        [ngModel]="playTrackService.playbackSpeed()" 
                        (ngModelChange)="onSpeedChange($event)"
                        class="form-range" 
                        style="height: 5px;">
                     <span style="font-size: 10px;">{{ playTrackService.playbackSpeed() }}x</span>
                 </div>
             }
         </div>
      <button
        class="toggle-button"
        [class.active]="polylineService.showDirectionArrows()"
        (click)="toggleDirectionArrows()"
      >
        <i class="fa-solid fa-location-arrow" style="color:blue"></i>
      </button>

       <button
          class="toggle-button"
          [class.active]="liveTrackingService.isTrackingActive()"
          (click)="toggleLiveTracking()"
          title="Toggle Live Tracking"
        >
          <!-- Using a 'Tower' icon to represent Live Signal -->
          <i class="fa-solid fa-tower-broadcast" style="color:red"></i>
        </button>

      } @for (category of categories; track category.name) {
      <button
        class="toggle-button"
        [class.active]="!isCategoryHidden(category.name)"
        (click)="toggleVisibility(category.name)"
      >
        <img
          [src]="category.icon"
          alt="{{ category.name }}"
          class="toggle-icon"
        />
        <!-- <span>{{ category.name | titlecase }}</span> -->
      </button>

      }
    </div>
  `,
  styleUrls: ['./marker-toggle.component.scss'],
})
export class MarkerToggleComponent {
  polylineService = inject(PolylineService);
  drawPolyline = input<boolean>(false);
   liveTrackingService = inject(LiveTrackingService);
    playTrackService = inject(PlayTrackService); // ✅
  readonly categories = [
    { name: 'green', icon: 'assets/imagesnew/green_Marker1.png' },
    { name: 'yellow', icon: 'assets/imagesnew/yellow_Marker1.png' },
    { name: 'red', icon: 'assets/imagesnew/red_Marker1.png' },
    { name: 'static', icon: 'assets/imagesnew/start_marker.png' },
  ];

  // सर्विस से छिपी हुई कैटेगरी का signal पढ़ें
  private hiddenCategories = this.polylineService.hiddenMarkerCategories;

  toggleVisibility(category: string): void {
    this.polylineService.toggleCategoryVisibility(category);
  }

  isCategoryHidden(category: string): boolean {
    return this.hiddenCategories()[category] === true;
  }
  togglePolyline(): void {
    this.polylineService.toggle();
  }
  // 🆕 New method to toggle direction arrows
  toggleDirectionArrows(): void {
    this.polylineService.toggleDirectionArrows();
  }
   // ✅ New Method to Toggle Live Tracking
  toggleLiveTracking(): void {
    this.liveTrackingService.toggleTracking();
  }
   togglePlayback() {
      // Auto-stop live tracking if running
      if (this.liveTrackingService.isTrackingActive()) {
          this.liveTrackingService.stopTracking();
      }
      this.playTrackService.togglePlayback();
  }

  onSpeedChange(speed: number) {
      this.playTrackService.setSpeed(speed);
  }
}
