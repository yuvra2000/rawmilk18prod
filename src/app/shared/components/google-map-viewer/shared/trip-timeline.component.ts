import { Component, input, output, computed, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { trigger, stagger, style, animate, transition, query } from '@angular/animations';

@Component({
  selector: 'app-trip-timeline',
  standalone: true,
  imports: [CommonModule, NgbTooltipModule],
  encapsulation: ViewEncapsulation.None,
  animations: [
    // Stagger Animation
    trigger('staggerEvents', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          stagger(30, [
            animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ],
  template: `
    <div class="timeline-container custom-scrollbar" [@staggerEvents]="groupedTimelineEvents().length">
      
      @if (isLoading()) {
        <div class="timeline-loader">
          <div class="loader-spinner"></div>
          <p class="loader-text">Loading Trip Timeline...</p>
        </div>
      } 
      
      @else if (groupedTimelineEvents().length === 0) {
        <div class="empty-state">
          <i class="fa-solid fa-road empty-icon"></i>
          <p class="empty-text">No timeline events found.</p>
        </div>
      }

      @else {
        <div class="timeline-wrapper">
          
          @for (group of groupedTimelineEvents(); track group.date) {
            
            <div class="date-group-wrapper">
              <div class="date-header-sticky">
                <span class="date-pill">{{ group.date }}</span>
              </div>

              @for (item of group.events; track item.id || $index; let isLast = $last) {
                
                <div class="timeline-item">
                  
                  <div class="time-col">
                    @if (item.start_time) {
                      <span class="time-badge">{{ formatTime(item.start_time) }}</span>
                    } @else {
                      <span class="time-placeholder">--:--</span>
                    }
                  </div>

                  <div class="marker-col">
                    <div class="timeline-line"
                      [ngClass]="{ 'hide-line': isLast && isLastGroup(group) }"
                      [style.background]="getGradientLine(item.type)">
                    </div>

                    <div class="timeline-dot"
                      (click)="emitOutput(item)"
                      [ngbTooltip]="item.start_location"
                      container="body"
                      placement="right"
                      [ngClass]="{ 'active-dot': expandedEvent() === item }">
                       @if(item.type === 'travel') { <i class="fa-solid fa-truck-fast dot-icon"></i> }
                       @if(item.type === 'stoppage') { <i class="fa-solid fa-pause dot-icon"></i> }
                       @if(item.customer_data) { <i class="fa-solid fa-check dot-icon"></i> }
                    </div>
                  </div>

                  <div class="content-col">
                    <div class="event-card"
                         (click)="toggleExpand(item)"
                         [ngClass]="{ 'expanded': expandedEvent() === item }">
                      
                      <div class="event-header">
                        <div class="header-left">
                          <span class="status-badge" [ngClass]="getBadgeClass(item)">
                            {{ getStatusText(item) }}
                          </span>
                          <span class="location-title text-truncate" [title]="item.cleanStartLocation">
                            {{ item.cleanStartLocation }}
                          </span>
                        </div>
                        <i class="fa-solid fa-chevron-down expand-icon" [class.rotated]="expandedEvent() === item"></i>
                      </div>

                      <div class="event-details">
                        <div class="details-grid">
                          @if (item.type === 'travel') {
                            <div class="detail-item">
                              <span class="label">Dist.</span>
                              <span class="value">{{ item.distance }} km</span>
                            </div>
                            <div class="detail-item">
                              <span class="label">Time</span>
                              <span class="value">{{ formatDuration(item.travelTime) }}</span>
                            </div>
                          }

                          @if (item.type === 'stoppage') {
                            <div class="detail-item full-width">
                              <span class="label text-danger">Duration</span>
                              <span class="value text-danger">{{ formatDuration(item.duration) }}</span>
                            </div>
                          }

                          @if (item.customer_data) {
                            <div class="detail-item full-width">
                              <span class="label text-primary">Customer</span>
                              <span class="value text-primary">Visited</span>
                            </div>
                          }
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    /* 1. Core Layout */
    .timeline-container {
      height: 100%;
      background: #f8f9fa; /* Flat clean background for sidebar */
      font-family: 'Inter', 'Segoe UI', sans-serif;
      padding: 0;
      overflow-x: hidden;
    }
    .timeline-wrapper { padding: 12px 8px 40px; } /* Compact padding */
    
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

    /* 2. Sticky Date Header */
    .date-header-sticky {
      position: sticky; top: 0; z-index: 10;
      text-align: center; margin-bottom: 12px;
      padding-top: 5px;
      pointer-events: none;
    }
    .date-pill {
      background: rgba(226, 232, 240, 0.95); color: #475569;
      padding: 4px 12px; border-radius: 16px;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.5px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      backdrop-filter: blur(2px);
    }

    /* 3. Timeline Row - CONTINUOUS LINE FIX */
    .timeline-item {
      display: flex;
      align-items: stretch; 
      position: relative;
      /* Margin हटाकर Padding दी ताकि लाइन बीच में न टूटे */
      padding-bottom: 12px; 
    }

    /* Left: Time Badge (Compact) */
    .time-col {
      width: 50px; flex-shrink: 0;
      display: flex; flex-direction: column; align-items: flex-end;
      padding-top: 10px; padding-right: 6px;
    }
    .time-badge {
      background: #fff; color: #334155;
      padding: 2px 5px; border-radius: 4px;
      font-size: 11px; font-weight: 600;
      border: 1px solid #e2e8f0;
    }
    .time-placeholder { font-size: 10px; color: #cbd5e1; }

    /* Middle: Marker & Gradient Line */
    .marker-col {
      width: 20px; position: relative; flex-shrink: 0;
      display: flex; justify-content: center;
    }
    .timeline-line {
      position: absolute;
      top: 20px;       /* Starts from center of dot */
      bottom: -70px;   /* Extends to next row's dot */
      width: 2px; 
      z-index: 0;
    }
    .hide-line { display: none; }

    .timeline-dot {
      width: 14px; height: 14px; border-radius: 50%;
      z-index: 2; margin-top: 13px; /* Align with time */
      background: #f8fafc; border: 2px solid #cbd5e1;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s ease; cursor: pointer;
      // box-shadow: 0 0 0 2px #f8f9fa; /* White halo to separate line from dot */
    }
    .timeline-dot:hover, .active-dot {
      transform: scale(1.15); border-color: #3b82f6; background: #fff;
    }
    .dot-icon { font-size: 7px; color: #64748b; }

    /* Right: Expandable Card (Fluid Width) */
    .content-col { flex-grow: 1; padding-left: 6px; min-width: 0; }
    
    .event-card {
      background: #fff; border-radius: 8px;
      padding: 8px 10px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 2px rgba(0,0,0,0.02);
      transition: all 0.2s ease; cursor: pointer;
    }
    .event-card:hover { border-color: #cbd5e1; }
    .event-card.expanded {
      border-color: #3b82f6;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
    }

    /* Header Layout - Optimized for Sidebar */
    .event-header {
      display: flex; justify-content: space-between; align-items: flex-start;
    }
    .header-left { 
      display: flex; flex-direction: column; /* Stack vertically */
      gap: 3px; overflow: hidden; width: 100%;
    }
    
    .location-title {
      font-size: 12px; font-weight: 600; color: #1e293b;
      display: block; width: 100%;
    }
    
    .status-badge {
      font-size: 9px; font-weight: 700; text-transform: uppercase;
      padding: 2px 6px; border-radius: 4px; display: inline-block;
      align-self: flex-start;
    }
    .badge-travel { background: #dcfce7; color: #15803d; }
    .badge-stop   { background: #fee2e2; color: #b91c1c; }
    .badge-other  { background: #f1f5f9; color: #475569; }

    .expand-icon { font-size: 10px; color: #94a3b8; margin-top: 2px; transition: transform 0.2s; }
    .rotated { transform: rotate(180deg); }

    /* Details (Expandable) */
    .event-details {
      display: grid; 
      grid-template-rows: 0fr; 
      transition: grid-template-rows 0.3s ease-out;
    }
    .event-card.expanded .event-details { grid-template-rows: 1fr; }
    
    .details-grid { overflow: hidden; }
    
    .event-card.expanded .details-grid {
      padding-top: 8px; margin-top: 6px;
      border-top: 1px solid #f1f5f9;
      display: flex; flex-direction: column; gap: 4px;
    }

    .detail-item { display: flex; justify-content: space-between; align-items: center; }
    
    .label { font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 600; }
    .value { font-size: 11px; color: #334155; font-weight: 500; }

    /* Loader & Empty */
    .timeline-loader, .empty-state {
      display: flex; flex-direction: column; align-items: center; padding-top: 40px;
    }
    .loader-spinner {
      width: 30px; height: 30px; border: 3px solid #f3f3f3;
      border-top-color: #1D4380; border-radius: 50%;
      animation: spin 0.8s linear infinite; margin-bottom: 10px;
    }
    .loader-text, .empty-text { font-size: 12px; color: #64748b; }
    .empty-icon { font-size: 24px; color: #cbd5e1; margin-bottom: 10px; }

    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `]
})
export class TripTimelineComponent {
  events = input<any[]>([]);
  isLoading = input<boolean>(false);
  theme = input<'light' | 'dark'>('light'); 
  
  expandedEvent = signal<any | null>(null);
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

  // --- Actions ---

  toggleExpand(item: any) {
    if (this.expandedEvent() === item) {
      this.expandedEvent.set(null);
    } else {
      this.expandedEvent.set(item);
    }
  }
  
  emitOutput(item: any) {
    this.eventClicked.emit(item);
  }

  isLastGroup(group: any): boolean {
    const groups = this.groupedTimelineEvents();
    return groups[groups.length - 1] === group;
  }

  // --- UI Helpers ---

  getBadgeClass(item: any): string {
    if (item.type === 'travel') return 'badge-travel';
    if (item.type === 'stoppage') return 'badge-stop';
    return 'badge-other';
  }

  getStatusText(item: any): string {
    if (item.type === 'travel') return 'Moving';
    if (item.type === 'stoppage') return 'Stopped';
    return 'Station';
  }

  getGradientLine(type: string): string {
    if (type === 'travel') {
      return 'linear-gradient(to bottom, #22c55e, #16a34a)'; 
    } else if (type === 'stoppage') {
      return 'linear-gradient(to bottom, #ef4444, #dc2626)'; 
    } else {
      return 'linear-gradient(to bottom, #cbd5e1, #94a3b8)'; 
    }
  }

  // --- Data Formatting ---

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
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    if (isNaN(hour)) return timePart;
    const period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
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