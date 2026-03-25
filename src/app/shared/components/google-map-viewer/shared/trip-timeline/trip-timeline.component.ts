import { Component, input, output, computed, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-trip-timeline',
  standalone: true,
  imports: [CommonModule, NgbTooltipModule],
  template: `
    <div class="timeline-container custom-scrollbar">
      <div class="date-header mt-0 mb-3">
        <span class="date-text" ngbTooltip="Timeline Events">Timeline</span>
      </div>

      <!-- Loading State -->
       @if (isLoading()) {
        <div class="timeline-loader">
            <div class="loader-spinner"></div>
            <p class="loader-text">Loading Timeline...</p>
        </div>
       }

      <div class="day-events-wrapper">
        <!-- Group Loop -->
        @for (group of groupedTimelineEvents(); track group.date) {
            
            <!-- Events Loop -->
            @for (item of group.events; track $index; let isLast = $last) {
                <div class="timeline-item my-0 p-0 col-12">
                    
                    <!-- Time Section -->
                    <div class="timeline-time d-flex flex-column gap-1 col-4 m-0">
                        @if (item.start_time) {
                            <span>{{ formatTime(item.start_time) }}</span>
                        } @else {
                            <span>--:--</span>
                        }
                        <span class="timeline-date">{{ getStartDate(item.start_time) }}</span>
                    </div>

                    <!-- Line & Dot Section -->
                    <div class="timeline-marker col-1" position="top" container="body">
                        <div class="timeline-line" 
                            [ngClass]="{
                                'green-line': item.type === 'travel' && !isLast,
                                'red-line': item.type === 'stoppage',
                                'dotted-green-line': item.type === 'travel' && isLast,
                                'customer-line': item.type === 'station' && item.flag,
                                'orange-line': item.type === 'station' && item.flag === 0,
                                'gray-line': item.type === 'station' && item.flag === 1
                            }">
                        </div>
                        
                        <div class="timeline-dot" 
                            (click)="onEventClick(item)"
                            [ngbTooltip]="item.start_location"
                            container="body"
                            placement="top"
                            [ngClass]="{
                                'green-dot': item.type === 'travel', 
                                'red-dot': item.type === 'stoppage' && !item.customer_data,
                                'customer-dot': item.customer_data,
                                'orange-dot': item.type === 'station' && item.flag === 0,
                                'gray-dot': item.type === 'station' && item.flag === 1
                            }">
                        </div>
                    </div>

                    <!-- Content Card Section -->
                    <div class="timeline-content col-5">
                        <div class="event-card mb-2" 
                            (click)="onEventClick(item)"
                            style="cursor: pointer;"
                            [ngClass]="{
                                'travel-card': item.type === 'travel', 
                                'stoppage-card': item.type === 'stoppage',
                                'customer-card': item.customer_data
                            }">
                            
                            <div class="event-header">
                                <span class="">
                                    <i class="fa-solid me-2" 
                                    [ngClass]="{
                                        'fa-truck-moving': item.type === 'travel', 
                                        'fa-bell': item.type === 'stoppage' && !item.customer_data,
                                        'fa-person': item.customer_data,
                                        'fa-flag-checkered': item.type === 'station'
                                    }"></i>
                                </span>
                                <span class="status-text" [ngClass]="{
                                        'status-moving': item.type === 'travel', 
                                        'status-stop': item.type === 'stoppage',
                                        'status-station': item.type === 'station'
                                    }">
                                    {{ item.type === 'travel' ? 'Moving' : (item.type === 'stoppage' ? 'Stop' : item.cleanStartLocation) }}
                                </span>
                            </div>

                            <div class="event-details">
                                @if (item.type === 'travel') {
                                    <div class="travel-stats d-flex flex-column"> 
                                        <div class="d-flex gap-2">
                                            <div class="travelledDistance">Distance:</div> 
                                            <div style="color: #0e2140;">{{ item.distance }} km</div> 
                                        </div> 
                                        <div class="d-flex gap-2"> 
                                            <div class="travelledTime">Travelled Time:</div> 
                                            <div style="color: #0e2140;">{{ formatDuration(item.travelTime) }}</div>
                                        </div>
                                    </div>
                                }

                                @if (item.type === 'stoppage') {
                                    <div class="duration-text">Duration: {{ formatDuration(item.duration) }}</div>
                                }

                                @if (item.type === 'station') {
                                    <div class="location-text">{{ item.cleanStartLocation }}</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
        }
      </div>
    </div>
  `,
  styleUrls: ['./trip-timeline.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TripTimelineComponent {
  events = input<any[]>([]);
  isLoading = input<boolean>(false);
  eventClicked = output<any>();

  readonly groupedTimelineEvents = computed(() => {
    const rawData = this.events();
    if (!rawData || rawData.length === 0) return [];

    const groupedData: { date: string, events: any[] }[] = [];
    let currentDateGroup: { date: string, events: any[] } | null = null;

    rawData.forEach(item => {
      const itemDate = this.getStartDate(item.start_time);
      if (!currentDateGroup || currentDateGroup.date !== itemDate) {
        currentDateGroup = { date: itemDate, events: [] };
        groupedData.push(currentDateGroup);
      }
      currentDateGroup.events.push({
        ...item,
        cleanStartLocation: this.getCleanLocation(item.start_location || item.location),
        cleanEndLocation: item.type === 'travel' ? this.getCleanLocation(item.end_location) : null,
      });
    });
    return groupedData;
  });

  onEventClick(item: any) {
    this.eventClicked.emit(item);
  }

  getCleanLocation(locationString: string): string {
    if (!locationString) return 'N/A';
    const parts = locationString.split('*(');
    return parts[0].trim();
  }

  formatTime(dateTimeString: string): string {
    if (!dateTimeString) return 'N/A';
    const parts = dateTimeString.split(' ');
    if (parts.length < 2) return 'N/A';
    const timePart = parts[1];
    const [hourStr, minuteStr] = timePart.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    if (isNaN(hour)) return timePart;
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
  }

  getStartDate(dateTimeString: string): string {
    if (!dateTimeString) return '';
    return dateTimeString.split(' ')[0] || '';
  }

  formatDuration(durationString: string): string {
    if (!durationString || !durationString.includes(':')) return 'N/A';
    const parts = durationString.split(':').map(Number);
    const hours = parts[0] || 0;
    const minutes = parts[1] || 0;
    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0 || hours > 0) result += `${minutes}m`;
    return result.trim() || '0m';
  }
}